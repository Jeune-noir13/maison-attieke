import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { livreurId: string } }) {
  const livreur = await prisma.livreur.findUnique({
    where: { livreurId: params.livreurId },
    select: {
      livreurId: true, nom: true, prenom: true, telephone: true,
      statut: true, enLigne: true, position: true,
    },
  })

  if (!livreur) return NextResponse.json({ error: 'Livreur non trouvé' }, { status: 404 })

  return NextResponse.json(livreur)
}
