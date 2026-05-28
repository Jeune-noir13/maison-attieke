import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const commandes = await prisma.commande.findMany({
    where: { userId: (session.user as any).id },
    include: { lignes: { include: { menuItem: { select: { nom: true } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(commandes)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()
  const { items, adresse, paiement, clientLat, clientLng, codePromo, utiliserPoints } = body

  if (!items?.length || !adresse) {
    return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 })
  }

  // Fetch real prices from DB
  const menuItemIds = items.map((i: any) => i.id)
  const menuItems = await prisma.menuItem.findMany({ where: { id: { in: menuItemIds } } })
  const priceMap = Object.fromEntries(menuItems.map((m) => [m.id, m.prix]))

  const lignes = items.map((item: any) => ({
    menuItemId: item.id,
    quantite: item.quantite,
    prixUnitaire: priceMap[item.id],
    prixTotal: priceMap[item.id] * item.quantite,
  }))

  const sousTotal = lignes.reduce((sum: number, l: any) => sum + l.prixTotal, 0)

  // Frais de livraison dynamiques depuis les settings
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } })
  let livraison = settings?.fraisLivraison ?? 500

  // Points fidélité à utiliser (100 pts = 500 F)
  let discountPoints = 0
  let pointsUtilises = 0
  if (utiliserPoints) {
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } })
    const pts = user?.points ?? 0
    if (pts >= 100) {
      pointsUtilises = Math.min(pts, Math.floor(sousTotal / 500) * 100)
      discountPoints = (pointsUtilises / 100) * 500
    }
  }

  // Code promo
  let discountPromo = 0
  let promotionId: string | null = null
  if (codePromo) {
    const promo = await prisma.promotion.findFirst({
      where: {
        code: codePromo.toUpperCase(),
        actif: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    })
    if (promo && sousTotal >= promo.minCommande && promo.usedCount < promo.maxUses) {
      promotionId = promo.id
      if (promo.type === 'PERCENT') {
        discountPromo = Math.round(sousTotal * promo.valeur / 100)
      } else if (promo.type === 'FIXED') {
        discountPromo = promo.valeur
      } else if (promo.type === 'FREE_DELIVERY') {
        livraison = 0
      }
    }
  }

  const discountApplied = discountPoints + discountPromo
  const total = Math.max(0, sousTotal - discountApplied + livraison)
  const numero = `LMA-${Date.now()}`

  const commande = await prisma.commande.create({
    data: {
      numero,
      userId: (session.user as any).id,
      adresse,
      clientLat: clientLat ?? null,
      clientLng: clientLng ?? null,
      paiement: paiement || 'LIVRAISON',
      sousTotal,
      livraison,
      discountApplied,
      pointsUtilises,
      total,
      statut: 'EN_ATTENTE',
      promotionId,
      lignes: { create: lignes },
    },
    include: { lignes: { include: { menuItem: true } } },
  })

  // Décrémenter les points utilisés
  if (pointsUtilises > 0) {
    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { points: { decrement: pointsUtilises } },
    })
  }

  // Incrémenter le compteur de la promo
  if (promotionId) {
    await prisma.promotion.update({
      where: { id: promotionId },
      data: { usedCount: { increment: 1 } },
    })
  }

  // Gain de points fidélité (1 point par 100 FCFA du sous-total)
  const pointsGagnes = Math.floor(sousTotal / 100)
  await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { points: { increment: pointsGagnes } },
  })

  return NextResponse.json({ ...commande, discountApplied, pointsGagnes }, { status: 201 })
}
