import { NextRequest, NextResponse } from 'next/server'
import { requireLivreur } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const livreur = await requireLivreur(req)
  if (!livreur) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { lat, lng } = await req.json()
  if (!lat || !lng) return NextResponse.json({ error: 'Coordonnées requises' }, { status: 400 })

  const position = await prisma.livreurPosition.upsert({
    where: { livreurId: livreur.id as string },
    update: { lat, lng },
    create: { livreurId: livreur.id as string, lat, lng },
  })

  return NextResponse.json(position)
}
