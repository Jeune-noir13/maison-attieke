'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    label: 'Braisés',
    href: '/menu?cat=BRAISES',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&q=80',
  },
  {
    label: 'Grillades',
    href: '/menu?cat=GRILLADES',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80',
  },
  {
    label: 'Kedjenou',
    href: '/menu?cat=KEDJENOU',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&q=80',
  },
  {
    label: 'Soupes',
    href: '/menu?cat=SOUPES',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&q=80',
  },
  {
    label: 'Accompagnements',
    href: '/menu?cat=ACCOMPAGNEMENTS',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80',
  },
  {
    label: 'Boissons',
    href: '/boissons',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80',
  },
]

export default function Categories() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-black text-xl sm:text-2xl tracking-wide uppercase">
          Catégories populaires
        </h2>
        <Link href="/menu" className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors flex items-center gap-1">
          Voir tout →
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map(({ label, href, image }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4 }}
          >
            <Link href={href} className="group flex flex-col items-center gap-2.5 block">
              {/* Image */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#1a1a1a] relative border border-[#1f1f1f] group-hover:border-orange-500/40 transition-colors">
                <Image
                  src={image}
                  alt={label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* Slight overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              {/* Label */}
              <span className="text-white font-semibold text-xs sm:text-sm text-center leading-tight group-hover:text-orange-400 transition-colors">
                {label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
