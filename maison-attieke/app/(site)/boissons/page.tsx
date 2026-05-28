import { prisma } from '@/lib/prisma'
import BoissonsClient from './BoissonsClient'

export const dynamic = 'force-dynamic'

export default async function BoissonsPage() {
  const boissons = await prisma.menuItem.findMany({
    where: { categorie: 'BOISSONS', disponible: true },
    orderBy: { note: 'desc' },
  })
  return <BoissonsClient items={boissons} />
}
