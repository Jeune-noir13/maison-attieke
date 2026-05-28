'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, ShoppingCart, Trash2, UtensilsCrossed } from 'lucide-react'
import { useCart } from '@/lib/store'

export default function FavorisPage() {
  const { status } = useSession()
  const router = useRouter()
  const { addItem } = useCart()
  const [favoris,  setFavoris]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  const load = () => fetch('/api/utilisateur/favoris')
    .then(async r => { if (!r.ok) return []; const t = await r.text(); try { return t ? JSON.parse(t) : [] } catch { return [] } })
    .then(d => { setFavoris(Array.isArray(d) ? d : []); setLoading(false) })
    .catch(() => setLoading(false))

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/connexion'); return }
    if (status !== 'authenticated') return
    load()
  }, [status])

  const remove = async (menuItemId: string) => {
    await fetch('/api/utilisateur/favoris', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ menuItemId }) })
    setFavoris(f => f.filter(x => x.menuItemId !== menuItemId))
  }

  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 py-5">
          <Link href="/compte" className="text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-white font-black text-lg flex items-center gap-2">
            <Heart size={18} className="text-red-400" />Mes favoris
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : favoris.length === 0 ? (
          <div className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-12 text-center">
            <Heart size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucun favori</p>
            <p className="text-gray-700 text-sm mt-1">Ajoutez des plats à vos favoris depuis le menu</p>
            <Link href="/menu" className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Voir le menu
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {favoris.map((fav, i) => (
              <motion.div key={fav.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-4 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1a1a1a] shrink-0">
                  {fav.menuItem?.image
                    ? <img src={fav.menuItem.image} alt={fav.menuItem.nom} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><UtensilsCrossed size={20} className="text-gray-700" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{fav.menuItem?.nom}</p>
                  <p className="text-gray-500 text-xs truncate mt-0.5">{fav.menuItem?.description}</p>
                  <p className="text-orange-400 font-bold text-sm mt-1">{fav.menuItem?.prix?.toLocaleString()} F</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => addItem({ id: fav.menuItemId, nom: fav.menuItem?.nom, prix: fav.menuItem?.prix, image: fav.menuItem?.image, categorie: fav.menuItem?.categorie || '' })}
                    className="w-8 h-8 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 transition-colors">
                    <ShoppingCart size={14} />
                  </button>
                  <button onClick={() => remove(fav.menuItemId)}
                    className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
