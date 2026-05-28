import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requireAdmin } from '@/lib/admin-auth'

// POST : créer/continuer une conversation ou envoyer un message
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { sessionId, contenu, action } = body

  if (action === 'admin_reply') {
    // Admin répond à une conversation
    const admin = await requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    const { conversationId, message } = body
    const [conv, msg] = await prisma.$transaction([
      prisma.chatConversation.update({
        where: { id: conversationId },
        data: { statut: 'ADMIN', updatedAt: new Date() }
      }),
      prisma.chatMsg.create({
        data: { conversationId, expediteur: 'admin', contenu: message }
      })
    ])
    return NextResponse.json({ conv, msg })
  }

  if (action === 'escalade') {
    const conv = await prisma.chatConversation.update({
      where: { sessionId },
      data: { statut: 'ADMIN' }
    })
    // Ajouter message système
    await prisma.chatMsg.create({
      data: {
        conversationId: conv.id,
        expediteur: 'bot',
        contenu: '🔔 Votre conversation a été transmise à notre équipe. Un conseiller va vous répondre sous peu.'
      }
    })
    return NextResponse.json(conv)
  }

  if (!sessionId || !contenu) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id ?? null

  // Trouver ou créer la conversation
  let conv = await prisma.chatConversation.findUnique({ where: { sessionId } })
  if (!conv) {
    conv = await prisma.chatConversation.create({
      data: { sessionId, userId, statut: 'BOT' }
    })
  }

  // Sauvegarder le message utilisateur
  await prisma.chatMsg.create({
    data: { conversationId: conv.id, expediteur: 'user', contenu }
  })

  return NextResponse.json({ conversationId: conv.id, statut: conv.statut })
}

// GET : récupérer les messages d'une conversation (poll)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  const isAdmin = searchParams.get('admin') === '1'

  if (isAdmin) {
    const admin = await requireAdmin(req)
    if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    // Admin: liste toutes les conversations actives
    const convs = await prisma.chatConversation.findMany({
      where: { statut: { in: ['ADMIN', 'BOT'] } },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 1 },
        user: { select: { nom: true, prenoms: true } }
      }
    })
    return NextResponse.json(convs)
  }

  if (!sessionId) return NextResponse.json({ error: 'sessionId requis' }, { status: 400 })

  const conv = await prisma.chatConversation.findUnique({
    where: { sessionId },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  })

  if (!conv) return NextResponse.json({ messages: [], statut: 'BOT' })

  // Marquer les messages admin comme lus
  await prisma.chatMsg.updateMany({
    where: { conversationId: conv.id, expediteur: 'admin', lu: false },
    data: { lu: true }
  })

  return NextResponse.json({ messages: conv.messages, statut: conv.statut, conversationId: conv.id })
}
