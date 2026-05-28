'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, Star } from 'lucide-react'
import { useCart } from '@/lib/store'

const FILTERS = [
  { value: '', label: 'Toutes', emoji: '🍫' },
  { value: 'chips', label: 'Chips', emoji: '🥔' },
  { value: 'choc', label: 'Chocolats', emoji: '🍫' },
  { value: 'glace', label: 'Biscuits', emoji: '🍪' },
]

export default function SucrClient({ items }: { items: any[] }) {
  const { addItem, toggleCart } = useCart()

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-[#0D0D0D] border-b border-[#1f1f1f] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-black text-white mb-1">🍫 <span className="gradient-text">Sucreries & Snacks</span></h1>
            <p className="text-gray-400">Chips, chocolats, biscuits et glaces pour finir en beauté</p>
          </motion.div>
          <div className="flex gap-2 mt-4">
            {FILTERS.map(({ value, label, emoji }) => (
              <button key={value} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${value === '' ? 'bg-orange-500 text-white' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]'}`}>
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }} className="card-dark overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                {item.image ? <Image src={item.image} alt={item.nom} fill className="object-cover group-hover:scale-110 transition-transform" /> : <div className="w-full h-full bg-pink-500/5 flex items-center justify-center text-4xl">🍫</div>}
                <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-xs">{item.note}</span>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-1">{item.nom}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-orange-400 font-bold text-sm">{item.prix.toLocaleString()} <span className="text-xs">FCFA</span></span>
                  <button onClick={() => { addItem({ id: item.id, nom: item.nom, prix: item.prix, image: item.image, categorie: 'SUCRERIES' }); toggleCart() }} className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors active:scale-90">
                    <Plus size={15} className="text-black" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
