'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/store'
import { Star, Minus, Plus, ArrowLeft, Tag, Heart, Share2, CheckCircle } from 'lucide-react'

const ACCOMPAGNEMENTS = [
  { id: 'acc-1', nom: 'Attiéké', emoji: '🌾', prix: 300 },
  { id: 'acc-2', nom: 'Alloco', emoji: '🍌', prix: 500 },
  { id: 'acc-3', nom: 'Crudités', emoji: '🥗', prix: 200 },
  { id: 'acc-4', nom: 'Sauce maison', emoji: '🫙', prix: 200 },
]

interface MenuItem { id: string; nom: string; description: string; prix: number; image: string | null; categorie: string; note: number; nombreAvis: number }

export default function ProductClient({ item, related }: { item: MenuItem; related: MenuItem[] }) {
  const { addItem, toggleCart } = useCart()
  const [qty, setQty] = useState(1)
  const [showNegociate, setShowNegociate] = useState(false)
  const [offerPrice, setOfferPrice] = useState(item.prix - 500)
  const [offerResult, setOfferResult] = useState<{ statut: string; montantAccepte?: number } | null>(null)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: item.id, nom: item.nom, prix: item.prix, image: item.image || undefined, categorie: item.categorie })
    }
    setAdded(true)
    setTimeout(() => { setAdded(false); toggleCart() }, 800)
  }

  const handleOffer = async () => {
    // Simulate negotiation (real would need a commande)
    const reduction = ((item.prix - offerPrice) / item.prix) * 100
    let statut = 'REFUSE', montantAccepte: number | undefined
    if (reduction <= 5) { statut = 'ACCEPTE'; montantAccepte = offerPrice }
    else if (reduction <= 12) { statut = 'CONTRE_OFFRE'; montantAccepte = Math.round(item.prix * 0.9) }
    else { statut = 'REFUSE' }
    setOfferResult({ statut, montantAccepte })
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/menu" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour au menu
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative aspect-square rounded-2xl overflow-hidden">
            {item.image ? (
              <Image src={item.image} alt={item.nom} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-500/10 flex items-center justify-center text-8xl">🍽️</div>
            )}
            <button className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white hover:text-orange-400 transition-colors">
              <Heart size={18} />
            </button>
            <button className="absolute top-4 right-16 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white hover:text-orange-400 transition-colors">
              <Share2 size={18} />
            </button>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="tag-orange text-xs mb-2 inline-block">{item.categorie}</span>
                <h1 className="text-white font-black text-2xl md:text-3xl">{item.nom}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={`${i < Math.floor(item.note) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />)}</div>
              <span className="text-yellow-400 font-bold text-sm">{item.note}</span>
              <span className="text-gray-500 text-sm">({item.nombreAvis}+ avis)</span>
            </div>

            <p className="text-gray-400 mb-6">{item.description}</p>

            <div className="text-3xl font-black text-orange-400 mb-2">{item.prix.toLocaleString()} <span className="text-lg text-orange-300">FCFA</span></div>

            {/* Accompagnements */}
            <div className="mb-6">
              <p className="text-white font-semibold text-sm mb-2">Accompagnements inclus</p>
              <div className="flex gap-2 flex-wrap">
                {ACCOMPAGNEMENTS.map((a) => (
                  <div key={a.id} className="flex flex-col items-center gap-1 bg-[#1a1a1a] rounded-xl p-2 text-center">
                    <span className="text-xl">{a.emoji}</span>
                    <span className="text-gray-400 text-xs">{a.nom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-full px-4 py-2">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-400 hover:text-white transition-colors"><Minus size={16} /></button>
                <span className="text-white font-bold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="text-gray-400 hover:text-white transition-colors"><Plus size={16} /></button>
              </div>
              <button onClick={handleAdd} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {added ? <><CheckCircle size={16} />Ajouté !</> : <><Plus size={16} />Ajouter au panier</>}
              </button>
            </div>

            {/* Negotiate */}
            <button onClick={() => setShowNegociate(!showNegociate)} className="flex items-center gap-2 text-orange-400 text-sm hover:text-orange-300 transition-colors">
              <Tag size={14} />Négocier le prix ? Faites une offre et nous verrons !
            </button>

            <AnimatePresence>
              {showNegociate && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3">
                  <div className="card-dark p-4">
                    <p className="text-white font-semibold text-sm mb-3">Faire une offre</p>
                    <p className="text-gray-500 text-xs mb-2">Prix actuel : <span className="text-orange-400 font-bold">{item.prix.toLocaleString()} FCFA</span></p>
                    <div className="flex gap-2 mb-3">
                      <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(Number(e.target.value))} className="input-dark flex-1 text-sm" min={100} max={item.prix} />
                      <span className="text-gray-400 self-center text-sm">FCFA</span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      {[-10, -500, -1000].map((d) => (
                        <button key={d} onClick={() => setOfferPrice(Math.max(100, item.prix + d))} className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-gray-400 text-xs py-1.5 rounded-lg transition-colors">
                          {d > 0 ? '+' : ''}{d}
                        </button>
                      ))}
                    </div>
                    <button onClick={handleOffer} className="btn-primary w-full text-sm">ENVOYER L'OFFRE</button>

                    {offerResult && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-3 p-3 rounded-xl text-sm text-center ${offerResult.statut === 'ACCEPTE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : offerResult.statut === 'CONTRE_OFFRE' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {offerResult.statut === 'ACCEPTE' && `✅ Offre acceptée ! Prix : ${offerResult.montantAccepte?.toLocaleString()} FCFA`}
                        {offerResult.statut === 'CONTRE_OFFRE' && `🤝 Contre-offre : ${offerResult.montantAccepte?.toLocaleString()} FCFA`}
                        {offerResult.statut === 'REFUSE' && '❌ Offre refusée. Essayez un montant plus raisonnable.'}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-white font-bold text-xl mb-6">Vous pourriez aimer</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/menu/${r.id}`} className="card-dark overflow-hidden hover:border-orange-500/30 transition-colors group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {r.image ? <Image src={r.image} alt={r.nom} fill className="object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-orange-500/5 flex items-center justify-center text-3xl">🍽️</div>}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium line-clamp-1">{r.nom}</p>
                    <p className="text-orange-400 font-bold text-sm">{r.prix.toLocaleString()} FCFA</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
