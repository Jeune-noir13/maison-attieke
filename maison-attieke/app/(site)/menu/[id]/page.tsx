import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductClient from './ProductClient'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const item = await prisma.menuItem.findUnique({ where: { id: params.id } })
  if (!item) notFound()

  const related = await prisma.menuItem.findMany({
    where: { categorie: item.categorie, id: { not: item.id }, disponible: true },
    take: 4,
    orderBy: { note: 'desc' },
  })

  return <ProductClient item={item} related={related} />
}
