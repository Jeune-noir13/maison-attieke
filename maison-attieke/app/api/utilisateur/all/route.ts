import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const clients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: {
      id: true, nom: true, prenoms: true, email: true, telephone: true,
      points: true, image: true, sexe: true, createdAt: true,
      _count: { select: { commandes: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(clients)
}
