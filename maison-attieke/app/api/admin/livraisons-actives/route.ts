import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const livraisons = await prisma.commande.findMany({
    where: { statut: { in: ['EN_ROUTE', 'ARRIVE'] } },
    include: {
      user: { select: { nom: true, prenoms: true, telephone: true } },
      livreur: {
        include: { position: true }
      },
      lignes: { include: { menuItem: { select: { nom: true } } } }
    },
    orderBy: { updatedAt: 'desc' }
  })

  return NextResponse.json(livraisons)
}
