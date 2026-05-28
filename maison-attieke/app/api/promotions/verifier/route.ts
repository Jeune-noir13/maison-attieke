import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { code, sousTotal } = await req.json()
  if (!code) return NextResponse.json({ error: 'Code requis' }, { status: 400 })

  const promo = await prisma.promotion.findFirst({
    where: {
      code: code.toUpperCase().trim(),
      actif: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  })

  if (!promo) return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 404 })
  if (promo.usedCount >= promo.maxUses) return NextResponse.json({ error: 'Code épuisé' }, { status: 400 })
  if (sousTotal < promo.minCommande) return NextResponse.json({ error: `Commande minimum : ${promo.minCommande.toLocaleString()} FCFA` }, { status: 400 })

  let discount = 0
  if (promo.type === 'PERCENT') discount = Math.round(sousTotal * promo.valeur / 100)
  else if (promo.type === 'FIXED') discount = promo.valeur
  else if (promo.type === 'FREE_DELIVERY') discount = 0

  return NextResponse.json({ promo, discount, freeLivraison: promo.type === 'FREE_DELIVERY' })
}
