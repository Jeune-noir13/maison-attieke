'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Package, Clock, ChevronRight, MapPin } from 'lucide-react'

const STATUT_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente', EN_PREPARATION: 'En préparation',
  EN_ROUTE: 'En route', ARRIVE: 'Arrivé', LIVRE: 'Livré',
}
const STATUT_COLORS: Record<string, string> = {
  EN_ATTENTE: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  EN_PREPARATION: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  EN_ROUTE: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  ARRIVE: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  LIVRE: 'text-green-400 bg-green-500/10 border-green-500/20',
}

export default function CommandesPage() {
  const { status } = useSession()
  const router = useRouter()
  const [commandes, setCommandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/connexion'); return }
    if (status === 'authenticated') {
      fetch('/api/commandes')
        .then(async r => { if (!r.ok) return []; const t = await r.text(); try { return t ? JSON.parse(t) : [] } catch { return [] } })
        .then(d => { setCommandes(Array.isArray(d) ? d : []); setLoading(false) })
    }
  }, [status, router])

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const active = commandes.filter(c => c.statut !== 'LIVRE')
  const past = commandes.filter(c => c.statut === 'LIVRE')

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Link href="/compte" className="w-9 h-9 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-white font-black text-xl">Mes commandes</h1>
              <p className="text-gray-500 text-sm">{commandes.length} commande{commandes.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          {commandes.length === 0 ? (
            <div className="card-dark p-12 text-center">
              <Package size={48} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Aucune commande</h3>
              <p className="text-gray-500 text-sm mb-6">Vous n'avez pas encore passé de commande.</p>
              <Link href="/menu" className="btn-primary inline-block">Voir le menu</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active orders */}
              {active.length > 0 && (
                <div>
                  <h2 className="text-orange-400 font-semibold text-sm mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    En cours ({active.length})
                  </h2>
                  <div className="space-y-3">
                    {active.map((cmd, i) => (
                      <motion.div key={cmd.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Link href={`/suivi/${cmd.id}`} className="card-dark p-4 block hover:border-orange-500/30 transition-colors rounded-2xl">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <code className="text-orange-400 text-xs font-mono font-bold">#{cmd.numero}</code>
                              <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                                <Clock size={11} />
                                {new Date(cmd.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full border ${STATUT_COLORS[cmd.statut]}`}>
                              {STATUT_LABELS[cmd.statut]}
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs mb-3 space-y-0.5">
                            {cmd.lignes?.slice(0, 2).map((l: any) => (
                              <div key={l.id}>{l.menuItem?.nom} × {l.quantite}</div>
                            ))}
                            {cmd.lignes?.length > 2 && <div className="text-gray-600">+{cmd.lignes.length - 2} article(s)…</div>}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-gray-600 text-xs">
                              <MapPin size={11} className="text-orange-500 shrink-0" />
                              <span className="truncate max-w-[200px]">{cmd.adresse}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-orange-400 font-bold text-sm">{cmd.total?.toLocaleString()} F</span>
                              <ChevronRight size={14} className="text-gray-600" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Past orders */}
              {past.length > 0 && (
                <div>
                  <h2 className="text-gray-500 font-semibold text-sm mb-3">Historique ({past.length})</h2>
                  <div className="space-y-2">
                    {past.map((cmd, i) => (
                      <motion.div key={cmd.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="card-dark p-4 rounded-2xl opacity-70 hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-between">
                          <div>
                            <code className="text-gray-500 text-xs font-mono">#{cmd.numero}</code>
                            <p className="text-gray-600 text-xs">
                              {new Date(cmd.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-green-400 font-bold text-sm">{cmd.total?.toLocaleString()} F</span>
                            <p className="text-gray-600 text-xs">{cmd.lignes?.length} article(s)</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
