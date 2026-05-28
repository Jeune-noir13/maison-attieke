'use client'
import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Phone, Star, ChevronDown, CheckCircle, Loader2 } from 'lucide-react'

const LiveMap = dynamic(() => import('@/components/suivi/LiveMap'), { ssr: false })

const DISPLAY_STEPS = [
  { keys: ['EN_ATTENTE','EN_PREPARATION'], label: 'Préparation', sub: 'En cours'   },
  { keys: ['EN_ROUTE'],                    label: 'En route',    sub: 'En cours'   },
  { keys: ['ARRIVE'],                      label: 'Livraison',   sub: 'Bientôt là!'},
  { keys: ['LIVRE'],                       label: 'Livré',       sub: 'Merci !'    },
]
const getDispIdx = (s: string) => DISPLAY_STEPS.findIndex(d => d.keys.includes(s))

/* ── Star picker ─────────────────────────────────────────── */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <Star size={26} className={n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
        </button>
      ))}
    </div>
  )
}

export default function SuiviPage({ params }: { params: { id: string } }) {
  const [commande,    setCommande]    = useState<any>(null)
  const [livreurInfo, setLivreurInfo] = useState<any>(null)
  const [livreurPos,  setLivreurPos]  = useState<{ lat: number; lng: number } | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [confirming,  setConfirming]  = useState(false)

  // Review state
  const [showReview,   setShowReview]   = useState(false)
  const [noteCmd,      setNoteCmd]      = useState(5)
  const [noteLiv,      setNoteLiv]      = useState(5)
  const [commentaire,  setCommentaire]  = useState('')
  const [reviewing,    setReviewing]    = useState(false)
  const [reviewed,     setReviewed]     = useState(false)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadCommande = async () => {
    try {
      const r = await fetch(`/api/commandes/${params.id}`)
      if (r.ok) { const d = await r.json(); setCommande(d); return d }
    } catch {}
    return null
  }

  const loadLivreur = async (dbId: string) => {
    try {
      const r = await fetch(`/api/livreur/info/${dbId}`)
      if (r.ok) {
        const d = await r.json()
        setLivreurInfo(d)
        if (d.position) setLivreurPos({ lat: d.position.lat, lng: d.position.lng })
      }
    } catch {}
  }

  useEffect(() => {
    const init = async () => {
      const cmd = await loadCommande()
      setLoading(false)
      if (cmd?.avis) { setReviewed(true) }
      if (cmd?.livreurId) {
        await loadLivreur(cmd.livreurId)
        pollRef.current = setInterval(async () => {
          const u = await loadCommande()
          if (u?.livreurId) await loadLivreur(u.livreurId)
        }, 5000)
      }
    }
    init()
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const confirmDelivery = async () => {
    setConfirming(true)
    await fetch(`/api/commandes/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'confirmer' }),
    })
    const updated = await loadCommande()
    setConfirming(false)
    if (updated?.statut === 'LIVRE') setShowReview(true)
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewing(true)
    await fetch('/api/avis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commandeId: params.id, noteCommande: noteCmd, noteLivreur: noteLiv, commentaire }),
    })
    setReviewing(false)
    setReviewed(true)
    setShowReview(false)
  }

  const statut    = commande?.statut ?? 'EN_ATTENTE'
  const dispIdx   = getDispIdx(statut)
  const clientPos = commande?.clientLat ? { lat: commande.clientLat, lng: commande.clientLng } : null
  const tempsMin  = livreurPos ? 12 : 20
  const hasLivreur = !!livreurInfo
  const initials   = livreurInfo ? `${livreurInfo.prenom?.[0] ?? ''}${livreurInfo.nom?.[0] ?? ''}` : '?'

  const itineraryUrl = livreurPos && clientPos
    ? `https://www.google.com/maps/dir/${livreurPos.lat},${livreurPos.lng}/${clientPos.lat},${clientPos.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(commande?.adresse ?? '')}`

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col pt-16">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <Link href="/compte/commandes" className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1 min-w-0">
          {loading ? <div className="h-4 w-40 bg-[#1a1a1a] rounded animate-pulse" /> : (
            <>
              <p className="text-gray-400 text-xs">Commande <span className="text-white font-mono font-semibold">#{commande?.numero}</span></p>
              <span className="inline-block mt-0.5 bg-orange-500/15 text-orange-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {statut === 'EN_ATTENTE' ? 'En attente' : statut === 'EN_PREPARATION' ? 'En préparation' : statut === 'EN_ROUTE' ? 'En route' : statut === 'ARRIVE' ? 'Arrivé' : 'Livré'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* MAP */}
      <div className="relative mx-4 rounded-2xl overflow-hidden bg-[#111]" style={{ height: 280 }}>
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (livreurPos || clientPos) ? (
          <LiveMap livreurPos={livreurPos} clientPos={clientPos} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-4xl animate-bounce">🛵</span>
            <p className="text-gray-600 text-xs">En attente de la position du livreur</p>
          </div>
        )}
        {livreurPos && (
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 pointer-events-none">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white text-xs font-medium">En direct</span>
          </div>
        )}
      </div>

      {/* Livreur card */}
      <div className="mx-4 mt-3 bg-[#111] rounded-2xl border border-[#1f1f1f] px-4 py-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white font-black text-sm shrink-0 ring-2 ring-[#2a2a2a]">
          {hasLivreur ? initials : '🛵'}
        </div>
        <div className="flex-1 min-w-0">
          {hasLivreur ? (
            <>
              <p className="text-white font-bold text-sm truncate">{livreurInfo.prenom} {livreurInfo.nom}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xs font-semibold">4.8</span>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">{loading ? 'Chargement...' : 'Livreur non assigné'}</p>
          )}
        </div>
        <div className="text-center px-4 border-x border-[#1f1f1f]">
          <p className="text-gray-400 text-[10px] whitespace-nowrap">Votre livreur arrive dans</p>
          <p className="text-white font-black text-xl leading-none mt-0.5">{tempsMin} min</p>
        </div>
        {hasLivreur && livreurInfo.telephone && (
          <a href={`tel:${livreurInfo.telephone}`}
            className="w-11 h-11 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center shrink-0 hover:bg-green-500/20 transition-colors">
            <Phone size={18} className="text-green-400" />
          </a>
        )}
      </div>

      {/* Progress steps */}
      <div className="mx-4 mt-3 bg-[#111] rounded-2xl border border-[#1f1f1f] px-5 py-4">
        <div className="relative flex items-start justify-between">
          <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-[#2a2a2a]" />
          <div className="absolute top-3.5 left-0 h-0.5 bg-orange-500 transition-all duration-700"
            style={{ width: `${dispIdx < 0 ? 0 : (dispIdx / (DISPLAY_STEPS.length - 1)) * 100}%` }} />
          {DISPLAY_STEPS.map((step, i) => {
            const done = i < dispIdx, active = i === dispIdx, pending = i > dispIdx
            return (
              <div key={step.label} className="relative flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 transition-all
                  ${done   ? 'bg-orange-500 border-orange-500' : ''}
                  ${active ? 'bg-orange-500/20 border-orange-500 ring-4 ring-orange-500/15' : ''}
                  ${pending ? 'bg-[#1a1a1a] border-[#2a2a2a]' : ''}`}>
                  {done ? <span className="text-white text-xs">✓</span>
                    : active ? <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    : <span className="w-1.5 h-1.5 bg-[#3a3a3a] rounded-full" />}
                </div>
                <span className={`text-[10px] font-semibold text-center leading-tight ${done || active ? 'text-orange-400' : 'text-gray-600'}`}>
                  {step.label}
                </span>
                {active && <span className="text-[9px] text-orange-300/70 text-center">{step.sub}</span>}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Confirmer la réception (ARRIVE) ─────────────────── */}
      {statut === 'ARRIVE' && (
        <div className="mx-4 mt-3 bg-purple-500/5 border border-purple-500/20 rounded-2xl p-4 text-center">
          <p className="text-purple-300 text-sm font-semibold mb-1">Votre livreur est arrivé !</p>
          <p className="text-gray-500 text-xs mb-3">Confirmez la réception de votre commande</p>
          <button onClick={confirmDelivery} disabled={confirming}
            className="bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white font-bold px-8 py-3 rounded-xl text-sm transition-all flex items-center gap-2 mx-auto disabled:opacity-60">
            {confirming ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
            {confirming ? 'Confirmation...' : 'J\'ai bien reçu ma commande'}
          </button>
        </div>
      )}

      {/* ── Avis (après LIVRE) ──────────────────────────────── */}
      {statut === 'LIVRE' && !reviewed && !showReview && (
        <div className="mx-4 mt-3 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">⭐</p>
          <p className="text-white font-bold text-sm mb-1">Donner votre avis</p>
          <p className="text-gray-500 text-xs mb-3">Notez votre expérience et le livreur</p>
          <button onClick={() => setShowReview(true)}
            className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Laisser un avis
          </button>
        </div>
      )}

      {showReview && (
        <form onSubmit={submitReview} className="mx-4 mt-3 bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 space-y-5">
          <h3 className="text-white font-bold text-base text-center">Votre avis</h3>

          <div>
            <p className="text-gray-400 text-sm mb-2">Note de la commande</p>
            <StarPicker value={noteCmd} onChange={setNoteCmd} />
          </div>

          {livreurInfo && (
            <div>
              <p className="text-gray-400 text-sm mb-2">Note du livreur ({livreurInfo.prenom})</p>
              <StarPicker value={noteLiv} onChange={setNoteLiv} />
            </div>
          )}

          <div>
            <p className="text-gray-400 text-sm mb-2">Commentaire (optionnel)</p>
            <textarea value={commentaire} onChange={e => setCommentaire(e.target.value)} rows={3}
              placeholder="Partagez votre expérience…"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-orange-500 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none resize-none text-sm transition-colors" />
          </div>

          <button type="submit" disabled={reviewing}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
            {reviewing ? <Loader2 size={15} className="animate-spin" /> : null}
            {reviewing ? 'Envoi...' : 'Envoyer mon avis'}
          </button>
        </form>
      )}

      {reviewed && (
        <div className="mx-4 mt-3 bg-green-500/5 border border-green-500/15 rounded-2xl p-4 text-center">
          <CheckCircle size={28} className="text-green-400 mx-auto mb-1" />
          <p className="text-white font-bold text-sm">Merci pour votre avis !</p>
        </div>
      )}

      {/* CTA details */}
      <div className="mx-4 mt-3 space-y-2">
        <button onClick={() => setShowDetails(v => !v)}
          className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-4 rounded-2xl text-sm tracking-wide transition-all flex items-center justify-center gap-2">
          VOIR LES DÉTAILS DE LA COMMANDE
          <ChevronDown size={16} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
        </button>

        {showDetails && commande && (
          <div className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-4 space-y-2">
            {commande.lignes?.map((l: any) => (
              <div key={l.id} className="flex justify-between text-sm">
                <span className="text-gray-400">{l.menuItem?.nom} × {l.quantite}</span>
                <span className="text-white">{l.prixTotal?.toLocaleString()} F</span>
              </div>
            ))}
            <div className="border-t border-[#1f1f1f] pt-2 flex justify-between font-bold">
              <span className="text-white">Total</span>
              <span className="text-orange-400">{commande.total?.toLocaleString()} FCFA</span>
            </div>
            {commande.adresse && <p className="text-gray-500 text-xs pt-1">📍 {commande.adresse}</p>}
            <a href={itineraryUrl} target="_blank" rel="noopener noreferrer"
              className="block w-full mt-1 text-center bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-blue-400 text-sm font-medium py-2.5 rounded-xl transition-colors">
              🗺️ Voir l'itinéraire
            </a>
          </div>
        )}

        {statut === 'LIVRE' && (
          <Link href="/menu" className="block w-full text-center bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-gray-400 hover:text-white text-sm font-medium py-3 rounded-2xl transition-colors">
            Commander à nouveau
          </Link>
        )}
      </div>

      <div className="h-8" />
    </div>
  )
}
