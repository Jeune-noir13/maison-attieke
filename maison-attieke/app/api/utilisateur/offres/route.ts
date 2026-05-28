import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const offres = await prisma.offre.findMany({
    where: { userId: (session.user as any).id },
    include: { commande: { select: { numero: true, sousTotal: true, createdAt: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(offres)
}
