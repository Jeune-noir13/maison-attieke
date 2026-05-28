import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const livreur = await prisma.livreur.findUnique({
    where: { id: params.id },
    select: {
      livreurId: true, nom: true, prenom: true, telephone: true,
      statut: true, enLigne: true, position: true,
    },
  })
  if (!livreur) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  return NextResponse.json(livreur)
}
