import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import Categories from '@/components/home/Categories'
import Specialties from '@/components/home/Specialties'
import SmartOrder from '@/components/home/SmartOrder'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'
import { prisma } from '@/lib/prisma'

async function getPopularItems() {
  return prisma.menuItem.findMany({
    where: { populaire: true, disponible: true },
    take: 8,
    orderBy: { note: 'desc' },
  })
}

export default async function HomePage() {
  const popularItems = await getPopularItems()

  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <Specialties items={popularItems} />
      <SmartOrder />
      <HowItWorks />
      <Testimonials />
    </>
  )
}
