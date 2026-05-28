import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requireAdmin } from '@/lib/admin-auth'

// POST : client envoie un message (about page)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nom, email, message } = body
  if (!nom || !email || !message) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id ?? null
  const msg = await prisma.contactMessage.create({
    data: { nom, email, message, userId }
  })
  return NextResponse.json(msg, { status: 201 })
}

// GET : admin liste les messages
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { nom: true, prenoms: true, telephone: true } } }
  })
  return NextResponse.json(messages)
}

// PATCH : admin répond à un message
export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { id, reponse } = await req.json()
  const msg = await prisma.contactMessage.update({
    where: { id },
    data: { reponse, lu: true }
  })
  return NextResponse.json(msg)
}
