import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const userId = (session.user as any).id
  const { label, adresse, commune, defaut } = await req.json()
  // Verify ownership
  const existing = await prisma.adresse.findFirst({ where: { id: params.id, userId } })
  if (!existing) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  if (defaut) {
    await prisma.adresse.updateMany({ where: { userId }, data: { defaut: false } })
  }
  const updated = await prisma.adresse.update({
    where: { id: params.id },
    data: { label, adresse, commune, defaut: !!defaut }
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const userId = (session.user as any).id
  const existing = await prisma.adresse.findFirst({ where: { id: params.id, userId } })
  if (!existing) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  await prisma.adresse.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
