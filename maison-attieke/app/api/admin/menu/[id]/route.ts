import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const body = await req.json()
  const item = await prisma.menuItem.update({ where: { id: params.id }, data: body })
  return NextResponse.json(item)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  await prisma.menuItem.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
