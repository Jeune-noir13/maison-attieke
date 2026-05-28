import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const [totalCommandes, totalClients, totalMenu, commandesAujourdhui, revenus, commandesParStatut] = await Promise.all([
    prisma.commande.count(),
    prisma.user.count({ where: { role: 'CLIENT' } }),
    prisma.menuItem.count({ where: { disponible: true } }),
    prisma.commande.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.commande.aggregate({ _sum: { total: true } }),
    prisma.commande.groupBy({ by: ['statut'], _count: { statut: true } }),
  ])

  const recentCommandes = await prisma.commande.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { nom: true, prenoms: true, email: true } },
      lignes: { include: { menuItem: { select: { nom: true } } } },
    },
  })

  const topItems = await prisma.ligneCommande.groupBy({
    by: ['menuItemId'],
    _sum: { quantite: true },
    orderBy: { _sum: { quantite: 'desc' } },
    take: 5,
  })

  const topItemsWithNames = await Promise.all(
    topItems.map(async (i) => {
      const item = await prisma.menuItem.findUnique({ where: { id: i.menuItemId }, select: { nom: true, prix: true } })
      return { ...i, item }
    })
  )

  return NextResponse.json({
    totalCommandes,
    totalClients,
    totalMenu,
    commandesAujourdhui,
    revenus: revenus._sum.total || 0,
    commandesParStatut,
    recentCommandes,
    topItems: topItemsWithNames,
  })
}
