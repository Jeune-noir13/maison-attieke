import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { statut, livreurId } = await req.json()
  const data: any = {}
  if (statut) data.statut = statut
  if (livreurId !== undefined) data.livreurId = livreurId || null

  const commande = await prisma.commande.update({ where: { id: params.id }, data })
  return NextResponse.json(commande)
}
