import { prisma } from '@/lib/prisma'
import SucrClient from './SucrClient'

export const dynamic = 'force-dynamic'

export default async function SucrPage() {
  const items = await prisma.menuItem.findMany({
    where: { categorie: 'SUCRERIES', disponible: true },
    orderBy: { note: 'desc' },
  })
  return <SucrClient items={items} />
}
