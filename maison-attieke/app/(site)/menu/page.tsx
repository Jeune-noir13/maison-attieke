import MenuClient from './MenuClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getAllItems() {
  return prisma.menuItem.findMany({
    where: { disponible: true },
    orderBy: [{ populaire: 'desc' }, { note: 'desc' }],
  })
}

export default async function MenuPage() {
  const items = await getAllItems()
  return <MenuClient initialItems={items} />
}
