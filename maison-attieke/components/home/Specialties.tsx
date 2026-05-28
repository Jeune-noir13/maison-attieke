'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Plus } from 'lucide-react'
import { useCart } from '@/lib/store'

interface MenuItem {
  id: string
  nom: string
  description: string
  prix: number
  image: string | null
  categorie: string
  note: number
  nombreAvis: number
}

const CATS = [
  { label: 'Tous', value: null },
  { label: 'Braisés', value: 'BRAISES' },
  { label: 'Grillades', value: 'GRILLADES' },
  { label: 'Kedjenou', value: 'KEDJENOU' },
  { label: 'Boissons', value: 'BOISSONS' },
]

export default function Specialties({ items }: { items: MenuItem[] }) {
  const { addItem, toggleCart } = useCart()
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const filtered = activeTab ? items.filter(i => i.categorie === activeTab) : items

  const handleAdd = (item: MenuItem) => {
    addItem({ id: item.id, nom: item.nom, prix: item.prix, image: item.image || undefined, categorie: item.categorie })
    toggleCart()
  }

  return (
    <section className="py-16 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"
        >
          <div>
            <span className="tag-orange mb-2 inline-block">Les incontournables</span>
            <h2 className="section-title">Nos <span className="gradient-text">spécialités</span></h2>
          </div>
          <Link href="/menu" className="btn-outline text-sm shrink-0">Voir tout le menu</Link>
        </motion.div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {CATS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setActiveTab(value)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === value
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a] hover:border-orange-500/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab ?? 'all'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className="card-dark overflow-hidden group cursor-pointer"
              >
                <Link href={`/menu/${item.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.nom}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized={item.image.startsWith('http')}
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-500/10 flex items-center justify-center text-4xl">🍽️</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-bold">{item.note}</span>
                    </div>
                  </div>
                </Link>
                <div className="p-3">
                  <Link href={`/menu/${item.id}`}>
                    <h3 className="text-white font-semibold text-sm leading-tight mb-1 hover:text-orange-400 transition-colors line-clamp-2">{item.nom}</h3>
                  </Link>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-bold">{item.prix.toLocaleString()} <span className="text-xs text-gray-500">FCFA</span></span>
                    <button
                      onClick={() => handleAdd(item)}
                      className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-all shadow-lg shadow-orange-500/30 active:scale-90 hover:scale-110"
                    >
                      <Plus size={16} className="text-black" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-sm">Aucun article dans cette catégorie pour le moment</p>
          </div>
        )}
      </div>
    </section>
  )
}
