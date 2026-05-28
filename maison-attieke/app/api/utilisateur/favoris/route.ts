import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const favoris = await prisma.favori.findMany({
    where: { userId: (session.user as any).id },
    include: { menuItem: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(favoris)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const { menuItemId } = await req.json()
  try {
    const fav = await prisma.favori.create({
      data: { userId: (session.user as any).id, menuItemId }
    })
    return NextResponse.json(fav, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Déjà en favoris' }, { status: 409 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const { menuItemId } = await req.json()
  await prisma.favori.deleteMany({
    where: { userId: (session.user as any).id, menuItemId }
  })
  return NextResponse.json({ success: true })
}
