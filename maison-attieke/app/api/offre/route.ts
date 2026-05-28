import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { commandeId, montantOffert, commentaire } = await req.json()

  const commande = await prisma.commande.findFirst({
    where: { id: commandeId, userId: (session.user as any).id },
  })
  if (!commande) return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } })
  const montantOriginal = commande.sousTotal

  // Auto-negotiation logic
  const reduction = ((montantOriginal - montantOffert) / montantOriginal) * 100
  let statut = 'EN_ATTENTE'
  let montantAccepte: number | null = null

  if (reduction <= 5) {
    statut = 'ACCEPTE'
    montantAccepte = montantOffert
  } else if (reduction <= 10 && (user?.points ?? 0) >= 100) {
    statut = 'ACCEPTE'
    montantAccepte = montantOffert
  } else if (reduction <= 15) {
    statut = 'CONTRE_OFFRE'
    montantAccepte = Math.round(montantOriginal * 0.9)
  } else {
    statut = 'REFUSE'
  }

  const offre = await prisma.offre.upsert({
    where: { commandeId },
    update: { montantOffert, commentaire, statut, montantAccepte },
    create: {
      commandeId,
      userId: (session.user as any).id,
      montantOriginal,
      montantOffert,
      commentaire,
      statut,
      montantAccepte,
    },
  })

  return NextResponse.json(offre)
}
