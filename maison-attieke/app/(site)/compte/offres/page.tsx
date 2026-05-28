'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, HandCoins, CheckCircle, XCircle, Clock, ArrowLeftRight } from 'lucide-react'

const STATUT_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  EN_ATTENTE:   { label: 'En attente',   color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',  icon: Clock },
  ACCEPTE:      { label: 'Accepté ✓',    color: 'text-green-400 bg-green-500/10 border-green-500/20',     icon: CheckCircle },
  REFUSE:       { label: 'Refusé',       color: 'text-red-400 bg-red-500/10 border-red-500/20',           icon: XCircle },
  CONTRE_OFFRE: { label: 'Contre-offre', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',  icon: ArrowLeftRight },
}

export default function OffresPage() {
  const { status } = useSession()
  const router = useRouter()
  const [offres, setOffres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/connexion'); return }
    if (status !== 'authenticated') return
    fetch('/api/utilisateur/offres')
      .then(async r => {
        if (!r.ok) return []
        const t = await r.text()
        try { return t ? JSON.parse(t) : [] } catch { return [] }
      })
      .then(d => { setOffres(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [status])

  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 py-5">
          <Link href="/compte" className="text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-white font-black text-lg flex items-center gap-2">
            <HandCoins size={18} className="text-purple-400" />Mes offres & négociations
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : offres.length === 0 ? (
          <div className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-12 text-center">
            <HandCoins size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucune offre soumise</p>
            <p className="text-gray-700 text-sm mt-1">Négociez le prix lors de votre prochaine commande</p>
            <Link href="/panier" className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
              Commander
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {offres.map((offre, i) => {
              const cfg = STATUT_CONFIG[offre.statut] ?? STATUT_CONFIG.EN_ATTENTE
              const Icon = cfg.icon
              return (
                <motion.div key={offre.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold text-sm">Commande <span className="text-orange-400 font-mono">#{offre.commande?.numero}</span></p>
                      <p className="text-gray-600 text-xs mt-0.5">{new Date(offre.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${cfg.color}`}>
                      <Icon size={11} />{cfg.label}
                    </span>
                  </div>

                  <div className="bg-[#1a1a1a] rounded-xl p-3 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Prix original</span>
                      <span className="text-white font-bold">{offre.montantOriginal?.toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Votre offre</span>
                      <span className="text-purple-400 font-bold">{offre.montantOffert?.toLocaleString()} FCFA</span>
                    </div>
                    {offre.montantAccepte && (
                      <div className="flex justify-between text-gray-400 border-t border-[#2a2a2a] pt-2">
                        <span>Montant final</span>
                        <span className={`font-bold ${offre.statut === 'ACCEPTE' ? 'text-green-400' : 'text-orange-400'}`}>
                          {offre.montantAccepte?.toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                  </div>

                  {offre.statut === 'CONTRE_OFFRE' && offre.montantAccepte && (
                    <div className="mt-3 bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 text-center">
                      <p className="text-purple-300 text-xs">Nous vous proposons <span className="font-bold text-white">{offre.montantAccepte.toLocaleString()} FCFA</span></p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
