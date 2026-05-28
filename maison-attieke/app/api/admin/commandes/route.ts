import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const commandes = await prisma.commande.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { nom: true, prenoms: true, telephone: true } },
      livreur: { select: { livreurId: true, nom: true, prenom: true } },
      lignes: { include: { menuItem: { select: { nom: true } } } },
    },
  })
  return NextResponse.json(commandes)
}
