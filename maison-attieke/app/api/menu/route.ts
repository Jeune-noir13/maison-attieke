import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categorie = searchParams.get('categorie')
  const search = searchParams.get('search')
  const populaire = searchParams.get('populaire')

  const where: any = { disponible: true }
  if (categorie) where.categorie = categorie
  if (populaire === 'true') where.populaire = true
  if (search) where.nom = { contains: search, mode: 'insensitive' }

  const items = await prisma.menuItem.findMany({
    where,
    orderBy: [{ populaire: 'desc' }, { note: 'desc' }],
  })

  return NextResponse.json(items)
}
