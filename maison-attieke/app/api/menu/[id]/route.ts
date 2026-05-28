import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const item = await prisma.menuItem.findUnique({ where: { id: params.id } })
  if (!item) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  return NextResponse.json(item)
}
