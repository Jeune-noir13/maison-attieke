import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const adresses = await prisma.adresse.findMany({
    where: { userId: (session.user as any).id },
    orderBy: [{ defaut: 'desc' }, { id: 'asc' }]
  })
  return NextResponse.json(adresses)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const userId = (session.user as any).id
  const { label, adresse, commune, defaut } = await req.json()
  if (!label || !adresse || !commune) return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  if (defaut) {
    await prisma.adresse.updateMany({ where: { userId }, data: { defaut: false } })
  }
  const created = await prisma.adresse.create({ data: { userId, label, adresse, commune, defaut: !!defaut } })
  return NextResponse.json(created, { status: 201 })
}
