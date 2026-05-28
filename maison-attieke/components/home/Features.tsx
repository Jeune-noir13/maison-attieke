'use client'
import { motion } from 'framer-motion'
import { Tag, PenLine, Truck, ShieldCheck, MapPin } from 'lucide-react'

const features = [
  {
    icon: Tag,
    title: 'À partir de',
    subtitle: '200 FCFA',
  },
  {
    icon: PenLine,
    title: 'Composez',
    subtitle: 'comme vous voulez',
  },
  {
    icon: Truck,
    title: 'Livraison rapide',
    subtitle: '30 – 45 min',
  },
  {
    icon: ShieldCheck,
    title: 'Paiement sécurisé',
    subtitle: 'Orange Money, Wave, MTN, Moov',
  },
  {
    icon: MapPin,
    title: 'Suivi en direct',
    subtitle: 'de votre livreur',
  },
]

export default function Features() {
  return (
    <section className="bg-[#111111] border-y border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-[#1f1f1f]">
          {features.map(({ icon: Icon, title, subtitle }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 px-5 py-5 first:pl-0 last:pr-0 sm:first:pl-5"
            >
              <div className="w-9 h-9 bg-orange-500/10 rounded-full flex items-center justify-center shrink-0">
                <Icon size={17} className="text-orange-400" />
              </div>
              <div>
                <div className="text-white font-semibold text-xs sm:text-sm leading-tight">{title}</div>
                <div className="text-gray-500 text-xs leading-tight mt-0.5">{subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
