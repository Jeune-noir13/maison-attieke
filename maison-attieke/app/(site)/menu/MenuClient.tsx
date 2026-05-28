'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Plus, Search, Heart } from 'lucide-react'
import { useCart } from '@/lib/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: '', label: 'Tous', emoji: '🍽️' },
  { value: 'BRAISES', label: 'Braisés', emoji: '🔥' },
  { value: 'GRILLADES', label: 'Grillades', emoji: '🍗' },
  { value: 'KEDJENOU', label: 'Kedjenou', emoji: '🍲' },
  { value: 'SOUPES', label: 'Soupes', emoji: '🥘' },
  { value: 'ACCOMPAGNEMENTS', label: 'Accompagnements', emoji: '🌾' },
  { value: 'BOISSONS', label: 'Boissons', emoji: '🥤' },
  { value: 'SUCRERIES', label: 'Sucreries', emoji: '🍫' },
]

interface MenuItem {
  id: string; nom: string; description: string; prix: number
  image: string | null; categorie: string; note: number; nombreAvis: number; populaire: boolean
}

export default function MenuClient({ initialItems }: { initialItems: MenuItem[] }) {
  const [cat, setCat] = useState('')
  const [search, setSearch] = useState('')
  const [favorisIds, setFavorisIds] = useState<Set<string>>(new Set())
  const [favLoading, setFavLoading] = useState<Set<string>>(new Set())
  const { addItem, toggleCart } = useCart()
  const { data: session, status } = useSession()
  const router = useRouter()

  // Load user favorites once authenticated
  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/utilisateur/favoris')
      .then(async r => {
        if (!r.ok) return []
        const t = await r.text()
        try { return t ? JSON.parse(t) : [] } catch { return [] }
      })
      .then((d: any[]) => {
        if (Array.isArray(d)) setFavorisIds(new Set(d.map(f => f.menuItemId)))
      })
      .catch(() => {})
  }, [status])

  const filtered = initialItems.filter((i) => {
    const matchCat = cat ? i.categorie === cat : true
    const matchSearch = search ? i.nom.toLowerCase().includes(search.toLowerCase()) : true
    return matchCat && matchSearch
  })

  const handleAdd = (item: MenuItem) => {
    addItem({ id: item.id, nom: item.nom, prix: item.prix, image: item.image || undefined, categorie: item.categorie })
    toggleCart()
  }

  const toggleFavori = async (item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (status !== 'authenticated') { router.push('/auth/connexion'); return }

    const isFav = favorisIds.has(item.id)
    setFavLoading(s => new Set(s).add(item.id))

    if (isFav) {
      await fetch('/api/utilisateur/favoris', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId: item.id }),
      })
      setFavorisIds(s => { const n = new Set(s); n.delete(item.id); return n })
    } else {
      await fetch('/api/utilisateur/favoris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId: item.id }),
      })
      setFavorisIds(s => new Set(s).add(item.id))
    }

    setFavLoading(s => { const n = new Set(s); n.delete(item.id); return n })
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-[#0D0D0D] border-b border-[#1f1f1f] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-1">Notre <span className="gradient-text">menu</span></h1>
            <p className="text-gray-400">Des plats savoureux préparés avec passion</p>
          </motion.div>

          {/* Search bar */}
          <div className="relative mt-4 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Rechercher un plat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9 pr-4 w-full"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {CATEGORIES.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setCat(value)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${cat === value ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#2a2a2a]'}`}
              >
                <span>{emoji}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500 text-sm mb-6">{filtered.length} plat{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, i) => {
              const isFav = favorisIds.has(item.id)
              const isFavLoading = favLoading.has(item.id)
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4 }}
                  className="card-dark overflow-hidden group"
                >
                  <Link href={`/menu/${item.id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.nom} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-orange-500/5 flex items-center justify-center text-4xl">🍽️</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {item.populaire && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">Populaire</div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs">{item.note}</span>
                      </div>
                      {/* Favorite button */}
                      <button
                        onClick={(e) => toggleFavori(item, e)}
                        disabled={isFavLoading}
                        className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90 ${isFav ? 'bg-red-500 text-white' : 'bg-black/60 text-gray-300 hover:text-red-400'}`}
                      >
                        <Heart size={13} className={isFav ? 'fill-white' : ''} />
                      </button>
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/menu/${item.id}`}>
                      <h3 className="text-white font-semibold text-sm leading-tight mb-1 hover:text-orange-400 transition-colors line-clamp-2">{item.nom}</h3>
                    </Link>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-orange-400 font-bold text-sm">{item.prix.toLocaleString()}</span>
                        <span className="text-gray-500 text-xs ml-1">FCFA</span>
                      </div>
                      <button onClick={() => handleAdd(item)}
                        className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors active:scale-90">
                        <Plus size={15} className="text-black font-bold" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400">Aucun plat trouvé</p>
            <button onClick={() => { setCat(''); setSearch('') }} className="btn-outline mt-4 text-sm">Réinitialiser</button>
          </div>
        )}
      </div>
    </div>
  )
}
