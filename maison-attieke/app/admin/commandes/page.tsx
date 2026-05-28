'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ChevronDown, Truck } from 'lucide-react'

const STATUTS = ['EN_ATTENTE', 'EN_PREPARATION', 'EN_ROUTE', 'ARRIVE', 'LIVRE']
const STATUT_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente', EN_PREPARATION: 'Préparation',
  EN_ROUTE: 'En route', ARRIVE: 'Arrivé', LIVRE: 'Livré',
}
const STATUT_COLORS: Record<string, string> = {
  EN_ATTENTE: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  EN_PREPARATION: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  EN_ROUTE: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  ARRIVE: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  LIVRE: 'text-green-400 bg-green-500/10 border-green-500/20',
}

export default function AdminCommandesPage() {
  const [commandes, setCommandes] = useState<any[]>([])
  const [livreurs, setLivreurs] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const [c, l] = await Promise.all([
      fetch('/api/admin/commandes').then(r => r.json()),
      fetch('/api/admin/livreurs').then(r => r.json()),
    ])
    setCommandes(Array.isArray(c) ? c : [])
    setLivreurs(Array.isArray(l) ? l : [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const iv = setInterval(load, 20000)
    return () => clearInterval(iv)
  }, [])

  const updateStatut = async (id: string, statut: string) => {
    setUpdating(id)
    await fetch(`/api/admin/commandes/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ statut }) })
    setUpdating(null); load()
  }

  const assignLivreur = async (commandeId: string, livreurId: string) => {
    await fetch(`/api/admin/commandes/${commandeId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ livreurId: livreurId || null }) })
    load()
  }

  const filtered = filter ? commandes.filter(c => c.statut === filter) : commandes

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Gestion des commandes</h1>
          <p className="text-gray-600 text-sm">{commandes.length} commandes</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-gray-500 hover:text-white bg-[#111] border border-[#1a1a1a] px-3 py-2 rounded-xl text-sm transition-colors">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilter('')} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${!filter ? 'bg-orange-500 text-black' : 'bg-[#111] text-gray-500 border border-[#1a1a1a] hover:text-white'}`}>
          Toutes ({commandes.length})
        </button>
        {STATUTS.map(s => {
          const count = commandes.filter(c => c.statut === s).length
          return (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filter === s ? 'bg-orange-500 text-black' : 'bg-[#111] text-gray-500 border border-[#1a1a1a] hover:text-white'}`}>
              {STATUT_LABELS[s]} ({count})
            </button>
          )
        })}
      </div>

      {/* Orders */}
      <div className="space-y-2">
        {loading ? (
          [...Array(5)].map((_, i) => <div key={i} className="h-20 bg-[#111] rounded-xl animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-600">Aucune commande</div>
        ) : filtered.map((cmd, i) => (
          <motion.div key={cmd.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-4 hover:border-[#2a2a2a] transition-colors">
            <div className="flex flex-wrap items-start gap-3">
              {/* Order info */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-400 font-mono text-xs font-bold">{cmd.numero}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUT_COLORS[cmd.statut]}`}>{STATUT_LABELS[cmd.statut]}</span>
                </div>
                <p className="text-white text-sm font-medium">{cmd.user?.prenoms} {cmd.user?.nom}</p>
                <p className="text-gray-600 text-xs">{cmd.user?.telephone} · {new Date(cmd.createdAt).toLocaleString('fr-FR')}</p>
                <p className="text-gray-500 text-xs mt-1 truncate max-w-xs">{cmd.lignes?.map((l: any) => `${l.menuItem?.nom} ×${l.quantite}`).join(', ')}</p>
              </div>

              {/* Amount */}
              <div className="text-right shrink-0">
                <div className="text-orange-400 font-bold">{cmd.total?.toLocaleString()} F</div>
                <div className="text-gray-600 text-xs">{cmd.paiement}</div>
              </div>

              {/* Livreur selector */}
              <div className="shrink-0">
                <label className="text-gray-600 text-xs mb-1 block">Livreur</label>
                <select
                  value={cmd.livreurId || ''}
                  onChange={e => assignLivreur(cmd.id, e.target.value)}
                  className="bg-[#111] border border-[#1f1f1f] rounded-lg px-2 py-1.5 text-gray-300 text-xs outline-none focus:border-orange-500/40 min-w-[140px]"
                >
                  <option value="">-- Non assigné --</option>
                  {livreurs.map((l: any) => (
                    <option key={l.id} value={l.id}>{l.livreurId} · {l.prenom} {l.nom}</option>
                  ))}
                </select>
              </div>

              {/* Statut selector */}
              <div className="shrink-0">
                <label className="text-gray-600 text-xs mb-1 block">Statut</label>
                <select
                  value={cmd.statut}
                  onChange={e => updateStatut(cmd.id, e.target.value)}
                  disabled={updating === cmd.id}
                  className="bg-[#111] border border-[#1f1f1f] rounded-lg px-2 py-1.5 text-gray-300 text-xs outline-none focus:border-orange-500/40"
                >
                  {STATUTS.map(s => <option key={s} value={s}>{STATUT_LABELS[s]}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
