import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET  — public testimonials for home page
export async function GET() {
  const avis = await prisma.avis.findMany({
    take: 12,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { nom: true, prenoms: true, lieuHabitation: true } },
    },
  })
  return NextResponse.json(avis)
}

// POST — submit review after delivery
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()
  const { commandeId, noteCommande, noteLivreur, commentaire } = body

  if (!commandeId || !noteCommande) {
    return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 })
  }

  // Ensure the order belongs to this user and is LIVRE
  const commande = await prisma.commande.findFirst({
    where: { id: commandeId, userId: (session.user as any).id, statut: 'LIVRE' },
  })
  if (!commande) return NextResponse.json({ error: 'Commande introuvable ou non livrée' }, { status: 404 })

  // Upsert (allow updating review)
  const avis = await prisma.avis.upsert({
    where: { commandeId },
    create: {
      commandeId,
      userId: (session.user as any).id,
      livreurId: commande.livreurId,
      noteCommande: Number(noteCommande),
      noteLivreur: noteLivreur ? Number(noteLivreur) : null,
      commentaire: commentaire?.trim() || null,
    },
    update: {
      noteCommande: Number(noteCommande),
      noteLivreur: noteLivreur ? Number(noteLivreur) : null,
      commentaire: commentaire?.trim() || null,
    },
  })

  return NextResponse.json(avis, { status: 201 })
}
