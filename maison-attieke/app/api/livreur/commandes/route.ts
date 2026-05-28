import { NextRequest, NextResponse } from 'next/server'
import { requireLivreur } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

const INCLUDE = {
  user: { select: { nom: true, prenoms: true, telephone: true } },
  lignes: { include: { menuItem: { select: { nom: true } } } },
}

export async function GET(req: NextRequest) {
  const livreur = await requireLivreur(req)
  if (!livreur) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const [assigned, available] = await Promise.all([
    // Orders assigned to this livreur
    prisma.commande.findMany({
      where: { livreurId: livreur.id as string },
      include: INCLUDE,
      orderBy: { createdAt: 'desc' },
    }),
    // Unassigned orders waiting for a livreur
    prisma.commande.findMany({
      where: { livreurId: null, statut: { in: ['EN_ATTENTE', 'EN_PREPARATION'] } },
      include: INCLUDE,
      orderBy: { createdAt: 'asc' },
    }),
  ])

  return NextResponse.json({ assigned, available })
}

export async function PATCH(req: NextRequest) {
  const livreur = await requireLivreur(req)
  if (!livreur) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()

  // Accept a delivery (claim an unassigned order)
  if (body.action === 'accept') {
    const commande = await prisma.commande.findUnique({ where: { id: body.commandeId } })
    if (!commande) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    if (commande.livreurId) return NextResponse.json({ error: 'Déjà prise en charge' }, { status: 409 })

    const updated = await prisma.commande.update({
      where: { id: body.commandeId },
      data: { livreurId: livreur.id as string, statut: 'EN_PREPARATION' },
    })
    return NextResponse.json(updated)
  }

  // Update delivery status
  const { commandeId, statut } = body
  const updated = await prisma.commande.updateMany({
    where: { id: commandeId, livreurId: livreur.id as string },
    data: { statut },
  })
  return NextResponse.json(updated)
}
