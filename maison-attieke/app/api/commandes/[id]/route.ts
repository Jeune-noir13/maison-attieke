import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const commande = await prisma.commande.findFirst({
    where: { id: params.id, userId: (session.user as any).id },
    include: {
      lignes: { include: { menuItem: true } },
      avis: true,
    },
  })

  if (!commande) return NextResponse.json({ error: 'Non trouvée' }, { status: 404 })
  return NextResponse.json(commande)
}

// Client confirms delivery received (ARRIVE → LIVRE)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()

  if (body.action === 'confirmer') {
    const commande = await prisma.commande.findFirst({
      where: { id: params.id, userId: (session.user as any).id },
    })
    if (!commande) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
    if (commande.statut !== 'ARRIVE') return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })

    const updated = await prisma.commande.update({
      where: { id: params.id },
      data: { statut: 'LIVRE' },
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'Action inconnue' }, { status: 400 })
}
