'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/store'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Minus, Plus, Trash2, MapPin, CreditCard, Loader2, CheckCircle,
  ArrowLeft, Navigation, Tag, Star, HandCoins, X, ChevronDown, ChevronUp,
} from 'lucide-react'

const PAYMENT_METHODS = [
  { id: 'WAVE',      label: 'Wave',                     emoji: '🔵' },
  { id: 'ORANGE',    label: 'Orange Money',              emoji: '🟠' },
  { id: 'MTN',       label: 'MTN Money',                emoji: '🟡' },
  { id: 'MOOV',      label: 'Moov Money',               emoji: '🟢' },
  { id: 'LIVRAISON', label: 'Paiement à la livraison',  emoji: '💵' },
]

export default function PanierPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()

  const [adresse,        setAdresse]        = useState('')
  const [paiement,       setPaiement]       = useState('WAVE')
  const [loading,        setLoading]        = useState(false)
  const [clientPos,      setClientPos]      = useState<{ lat: number; lng: number } | null>(null)
  const [gpsLoading,     setGpsLoading]     = useState(false)

  // Promo code
  const [codePromo,      setCodePromo]      = useState('')
  const [promoLoading,   setPromoLoading]   = useState(false)
  const [promoResult,    setPromoResult]    = useState<any>(null)
  const [promoError,     setPromoError]     = useState('')

  // Points fidélité
  const [userPoints,     setUserPoints]     = useState(0)
  const [utiliserPoints, setUtiliserPoints] = useState(false)
  const [showPoints,     setShowPoints]     = useState(false)

  // Frais de livraison dynamiques
  const [fraisLivraison, setFraisLivraison] = useState(500)

  // Négociation
  const [showNego,       setShowNego]       = useState(false)
  const [montantOffert,  setMontantOffert]  = useState('')
  const [negoResult,     setNegoResult]     = useState<any>(null)

  useEffect(() => {
    // Fetch frais livraison + user points
    fetch('/api/settings').then(r => r.json()).then(d => setFraisLivraison(d.fraisLivraison ?? 500))
    if (session) {
      fetch('/api/utilisateur').then(async r => {
        if (!r.ok) return
        const t = await r.text()
        try { const d = JSON.parse(t); setUserPoints(d.points ?? 0) } catch {}
      })
    }
    // GPS
    if (navigator.geolocation) {
      setGpsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => { setClientPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsLoading(false) },
        () => setGpsLoading(false),
        { timeout: 8000 }
      )
    }
  }, [session])

  const verifierPromo = async () => {
    if (!codePromo.trim()) return
    setPromoLoading(true); setPromoError(''); setPromoResult(null)
    const res = await fetch('/api/promotions/verifier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codePromo, sousTotal: total() }),
    })
    const data = await res.json()
    setPromoLoading(false)
    if (!res.ok) { setPromoError(data.error); return }
    setPromoResult(data)
  }

  const removePromo = () => { setPromoResult(null); setCodePromo(''); setPromoError('') }

  const sousTotal      = total()
  const discountPoints = utiliserPoints ? Math.min(Math.floor(userPoints / 100) * 500, Math.floor(sousTotal / 500) * 500) : 0
  const discountPromo  = promoResult?.discount ?? 0
  const livraisonFinal = (promoResult?.freeLivraison || utiliserPoints) ? (promoResult?.freeLivraison ? 0 : fraisLivraison) : fraisLivraison
  const grandTotal     = Math.max(0, sousTotal - discountPoints - discountPromo + livraisonFinal)

  const handleOrder = async () => {
    if (!session) { router.push('/auth/connexion'); return }
    if (!adresse.trim()) { alert('Veuillez entrer votre adresse de livraison'); return }
    setLoading(true)
    const res = await fetch('/api/commandes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.map((i) => ({ id: i.id, quantite: i.quantite })),
        adresse,
        paiement,
        clientLat: clientPos?.lat ?? null,
        clientLng: clientPos?.lng ?? null,
        codePromo: promoResult ? codePromo : null,
        utiliserPoints,
      }),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      // Si négociation demandée, soumettre l'offre
      if (showNego && montantOffert && Number(montantOffert) > 0) {
        await fetch('/api/offre', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commandeId: data.id, montantOffert: Number(montantOffert) }),
        }).then(r => r.json()).then(o => setNegoResult(o))
        clearCart()
        // Afficher résultat négociation avant redirect
        setLoading(false)
        return
      }
      clearCart()
      router.push(`/suivi/${data.id}`)
    }
  }

  // Redirect after negotiation result shown
  useEffect(() => {
    if (negoResult) {
      const timer = setTimeout(() => router.push('/compte/commandes'), 3000)
      return () => clearTimeout(timer)
    }
  }, [negoResult, router])

  if (negoResult) return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-[#111] border border-[#1f1f1f] rounded-3xl p-8 text-center max-w-sm w-full">
        {negoResult.statut === 'ACCEPTE' ? (
          <>
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-green-400 font-black text-xl mb-2">Offre acceptée !</h2>
            <p className="text-gray-400 text-sm">Votre commande est confirmée à <span className="text-white font-bold">{negoResult.montantAccepte?.toLocaleString()} FCFA</span></p>
          </>
        ) : negoResult.statut === 'CONTRE_OFFRE' ? (
          <>
            <div className="text-5xl mb-3">🤝</div>
            <h2 className="text-orange-400 font-black text-xl mb-2">Contre-offre !</h2>
            <p className="text-gray-400 text-sm">Nous vous proposons <span className="text-white font-bold">{negoResult.montantAccepte?.toLocaleString()} FCFA</span></p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-3">😔</div>
            <h2 className="text-red-400 font-black text-xl mb-2">Offre refusée</h2>
            <p className="text-gray-400 text-sm">La remise demandée est trop importante. Prix original maintenu.</p>
          </>
        )}
        <p className="text-gray-700 text-xs mt-4">Redirection dans 3 secondes…</p>
      </motion.div>
    </div>
  )

  if (items.length === 0) return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-white text-2xl font-bold mb-2">Votre panier est vide</h2>
        <p className="text-gray-400 mb-6">Ajoutez des plats depuis notre menu</p>
        <Link href="/menu" className="btn-primary">Voir le menu</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/menu" className="w-9 h-9 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">Mon panier</h1>
            <p className="text-gray-400 text-sm">{items.reduce((s, i) => s + i.quantite, 0)} article(s)</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div key={item.id} layout exit={{ opacity: 0, x: -20 }} className="card-dark p-3 sm:p-4 flex gap-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#2a2a2a] shrink-0">
                    {item.image
                      ? <Image src={item.image} alt={item.nom} width={80} height={80} className="w-full h-full object-cover" unoptimized />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">{item.nom}</h3>
                    <p className="text-orange-400 font-bold text-sm">{(item.prix * item.quantite).toLocaleString()} FCFA</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantite - 1)} className="w-7 h-7 bg-[#2a2a2a] hover:bg-orange-500/20 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors">
                        <Minus size={11} />
                      </button>
                      <span className="text-white font-bold text-sm w-5 text-center">{item.quantite}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantite + 1)} className="w-7 h-7 bg-[#2a2a2a] hover:bg-orange-500/20 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors">
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Totals */}
            <div className="card-dark p-4">
              <h3 className="text-white font-bold mb-3 text-sm">Récapitulatif</h3>
              <div className="space-y-2 text-sm mb-3">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-gray-400">
                    <span className="truncate mr-2">{i.nom} ×{i.quantite}</span>
                    <span className="text-white shrink-0">{(i.prix * i.quantite).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#2a2a2a] pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-400"><span>Sous-total</span><span className="text-white">{sousTotal.toLocaleString()} F</span></div>
                {discountPromo > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center gap-1"><Tag size={11} />{codePromo}</span>
                    <span>-{discountPromo.toLocaleString()} F</span>
                  </div>
                )}
                {promoResult?.freeLivraison && (
                  <div className="flex justify-between text-green-400"><span className="flex items-center gap-1"><Tag size={11} />Livraison offerte</span><span>-{fraisLivraison.toLocaleString()} F</span></div>
                )}
                {discountPoints > 0 && (
                  <div className="flex justify-between text-yellow-400"><span className="flex items-center gap-1"><Star size={11} />Points fidélité</span><span>-{discountPoints.toLocaleString()} F</span></div>
                )}
                <div className="flex justify-between text-gray-400"><span>Livraison</span><span className={livraisonFinal === 0 ? 'text-green-400 line-through' : 'text-white'}>{livraisonFinal === 0 ? 'Gratuite' : `${livraisonFinal.toLocaleString()} F`}</span></div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-[#2a2a2a]">
                  <span className="text-white">Total</span>
                  <span className="text-orange-400">{grandTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Code promo */}
            <div className="card-dark p-4">
              <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><Tag size={15} className="text-orange-500" />Code promo</h3>
              {promoResult ? (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
                  <CheckCircle size={15} className="text-green-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-green-400 text-sm font-bold">{promoResult.promo.description}</p>
                    {discountPromo > 0 && <p className="text-green-400/70 text-xs">-{discountPromo.toLocaleString()} FCFA</p>}
                    {promoResult.freeLivraison && <p className="text-green-400/70 text-xs">Livraison gratuite !</p>}
                  </div>
                  <button onClick={removePromo} className="text-gray-600 hover:text-red-400 transition-colors"><X size={14} /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={codePromo} onChange={e => { setCodePromo(e.target.value.toUpperCase()); setPromoError('') }}
                    placeholder="Code promo" onKeyDown={e => e.key === 'Enter' && verifierPromo()}
                    className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] focus:border-orange-500/40 rounded-xl px-3 py-2 text-white text-sm outline-none transition-colors placeholder-gray-600" />
                  <button onClick={verifierPromo} disabled={promoLoading || !codePromo.trim()}
                    className="px-3 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-black font-bold rounded-xl text-sm transition-colors">
                    {promoLoading ? <Loader2 size={14} className="animate-spin" /> : 'OK'}
                  </button>
                </div>
              )}
              {promoError && <p className="text-red-400 text-xs mt-1.5">{promoError}</p>}
            </div>

            {/* Points fidélité */}
            {session && userPoints >= 100 && (
              <div className="card-dark p-4">
                <button onClick={() => setShowPoints(v => !v)} className="w-full flex items-center justify-between text-sm">
                  <span className="text-white font-bold flex items-center gap-2"><Star size={15} className="text-yellow-400" />Points fidélité</span>
                  {showPoints ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </button>
                <AnimatePresence>
                  {showPoints && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-3">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-400 text-xs">Vous avez <span className="text-yellow-400 font-bold">{userPoints} pts</span></p>
                          <p className="text-gray-500 text-xs">100 pts = 500 FCFA</p>
                        </div>
                        <button onClick={() => setUtiliserPoints(v => !v)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-sm ${utiliserPoints ? 'border-yellow-500 bg-yellow-500/5 text-white' : 'border-[#2a2a2a] text-gray-400 hover:border-[#3a3a3a]'}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${utiliserPoints ? 'border-yellow-500 bg-yellow-500' : 'border-gray-600'}`}>
                            {utiliserPoints && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="flex-1 text-left">Utiliser mes points (-{Math.min(Math.floor(userPoints / 100) * 500, Math.floor(sousTotal / 500) * 500).toLocaleString()} FCFA)</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Adresse */}
            <div className="card-dark p-4">
              <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><MapPin size={15} className="text-orange-500" />Adresse de livraison</h3>
              <input value={adresse} onChange={(e) => setAdresse(e.target.value)}
                className="input-dark text-sm mb-3" placeholder="Ex: Cocody Riviera 3, Rue K45..." required />
              <div className={`flex items-center gap-2 text-xs rounded-lg p-2 ${clientPos ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-[#1a1a1a] text-gray-500'}`}>
                <Navigation size={12} className={clientPos ? 'text-green-400' : 'text-gray-600'} />
                {gpsLoading ? 'Détection de votre position...' : clientPos ? 'Position GPS détectée ✓' : 'GPS non disponible — l\'adresse suffira'}
              </div>
            </div>

            {/* Paiement */}
            <div className="card-dark p-4">
              <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2"><CreditCard size={15} className="text-orange-500" />Moyen de paiement</h3>
              <div className="grid grid-cols-1 gap-2">
                {PAYMENT_METHODS.map(({ id, label, emoji }) => (
                  <button key={id} onClick={() => setPaiement(id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-sm ${paiement === id ? 'border-orange-500 bg-orange-500/5 text-white' : 'border-[#2a2a2a] text-gray-400 hover:border-[#3a3a3a]'}`}>
                    <span className="text-base">{emoji}</span>
                    <span className="flex-1 text-left">{label}</span>
                    {paiement === id && <CheckCircle size={14} className="text-orange-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Négociation */}
            <div className="card-dark p-4">
              <button onClick={() => { setShowNego(v => !v); setMontantOffert('') }} className="w-full flex items-center justify-between text-sm">
                <span className="text-white font-bold flex items-center gap-2">
                  <HandCoins size={15} className="text-purple-400" />Négocier le prix
                  <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Nouveau</span>
                </span>
                {showNego ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
              </button>
              <AnimatePresence>
                {showNego && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-3 space-y-2">
                      <p className="text-gray-500 text-xs">Prix actuel : <span className="text-white font-bold">{sousTotal.toLocaleString()} FCFA</span> (hors livraison)</p>
                      <p className="text-gray-500 text-xs">Proposez votre prix — le système accepte jusqu'à -15%</p>
                      <div className="relative">
                        <input type="number" value={montantOffert} onChange={e => setMontantOffert(e.target.value)}
                          placeholder={`Max -15% = ${Math.round(sousTotal * 0.85).toLocaleString()} F`}
                          min={Math.round(sousTotal * 0.85)}
                          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-purple-500/40 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors placeholder-gray-600 pr-16" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 text-xs font-bold">FCFA</span>
                      </div>
                      {montantOffert && (
                        <p className={`text-xs ${Number(montantOffert) >= Math.round(sousTotal * 0.85) ? 'text-green-400' : 'text-red-400'}`}>
                          {Number(montantOffert) >= Math.round(sousTotal * 0.85)
                            ? `✓ Réduction de ${Math.round(((sousTotal - Number(montantOffert)) / sousTotal) * 100)}%`
                            : `✗ Trop bas — minimum ${Math.round(sousTotal * 0.85).toLocaleString()} FCFA`}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={handleOrder} disabled={loading} className="btn-primary w-full text-base flex items-center justify-center gap-2 py-4">
              {loading ? <><Loader2 size={18} className="animate-spin" />Traitement...</> : (showNego && montantOffert ? `FAIRE UNE OFFRE · ${Number(montantOffert).toLocaleString()} FCFA` : `COMMANDER · ${grandTotal.toLocaleString()} FCFA`)}
            </button>

            {!session && <p className="text-center text-orange-400 text-xs">Vous serez redirigé vers la connexion</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
