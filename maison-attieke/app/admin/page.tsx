'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Users, UtensilsCrossed, TrendingUp, Clock, CheckCircle, Truck, AlertCircle, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const STATUT_COLORS: Record<string, string> = {
  EN_ATTENTE: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  EN_PREPARATION: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  EN_ROUTE: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  ARRIVE: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  LIVRE: 'text-green-400 bg-green-500/10 border-green-500/20',
}
const STATUT_LABELS: Record<string, string> = {
  EN_ATTENTE: 'En attente', EN_PREPARATION: 'Préparation',
  EN_ROUTE: 'En route', ARRIVE: 'Arrivé', LIVRE: 'Livré',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-[#111] rounded-2xl" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 h-80 bg-[#111] rounded-2xl" />
        <div className="h-80 bg-[#111] rounded-2xl" />
      </div>
    </div>
  )

  const kpis = [
    { label: 'Commandes totales', value: stats.totalCommandes, icon: ShoppingBag, color: 'orange', sub: `+${stats.commandesAujourdhui} aujourd'hui` },
    { label: 'Clients', value: stats.totalClients, icon: Users, color: 'blue', sub: 'comptes actifs' },
    { label: 'Produits actifs', value: stats.totalMenu, icon: UtensilsCrossed, color: 'green', sub: 'au menu' },
    { label: 'Revenus', value: `${(stats.revenus / 1000).toFixed(0)}k`, icon: TrendingUp, color: 'purple', sub: 'FCFA total' },
  ]

  const colorMap: Record<string, string> = {
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/15',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/15',
    green: 'text-green-400 bg-green-500/10 border-green-500/15',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/15',
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-gray-600 text-sm mt-0.5">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-green-500/10 border border-green-500/20 text-green-400 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Restaurant ouvert
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(({ label, value, icon: Icon, color, sub }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4 hover:border-[#2a2a2a] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorMap[color]}`}>
                <Icon size={16} />
              </div>
              <ArrowUpRight size={14} className="text-gray-700" />
            </div>
            <div className="text-2xl font-black text-white mb-0.5">{value}</div>
            <div className="text-gray-500 text-xs font-medium">{label}</div>
            <div className="text-gray-700 text-xs mt-1">{sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#141414]">
            <h2 className="text-white font-semibold text-sm">Commandes récentes</h2>
            <Link href="/admin/commandes" className="text-orange-400 text-xs hover:underline flex items-center gap-1">Voir toutes <ArrowUpRight size={12} /></Link>
          </div>
          <div className="divide-y divide-[#111]">
            {stats.recentCommandes.slice(0, 7).map((cmd: any) => (
              <div key={cmd.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#111] transition-colors">
                <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400 font-bold text-xs shrink-0">
                  {cmd.user?.prenoms?.charAt(0)}{cmd.user?.nom?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{cmd.user?.prenoms} {cmd.user?.nom}</p>
                  <p className="text-gray-600 text-xs truncate">{cmd.lignes?.map((l: any) => l.menuItem?.nom).join(', ')}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-orange-400 text-xs font-bold">{cmd.total?.toLocaleString()} F</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUT_COLORS[cmd.statut] || 'text-gray-400'}`}>
                    {STATUT_LABELS[cmd.statut] || cmd.statut}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Statuts donut */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4">
            <h2 className="text-white font-semibold text-sm mb-4">Statuts commandes</h2>
            <div className="space-y-2">
              {stats.commandesParStatut.map((s: any) => {
                const pct = stats.totalCommandes > 0 ? Math.round((s._count.statut / stats.totalCommandes) * 100) : 0
                return (
                  <div key={s.statut}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">{STATUT_LABELS[s.statut] || s.statut}</span>
                      <span className="text-gray-600">{s._count.statut} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top items */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4">
            <h2 className="text-white font-semibold text-sm mb-4">Plats populaires</h2>
            <div className="space-y-2">
              {stats.topItems.map((t: any, i: number) => (
                <div key={t.menuItemId} className="flex items-center gap-2">
                  <span className="text-orange-500/50 text-xs font-bold w-4">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-xs truncate">{t.item?.nom}</p>
                  </div>
                  <span className="text-gray-600 text-xs shrink-0">{t._sum.quantite} cmd</span>
                </div>
              ))}
              {!stats.topItems.length && <p className="text-gray-700 text-xs text-center py-2">Pas encore de données</p>}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4">
            <h2 className="text-white font-semibold text-sm mb-3">Actions rapides</h2>
            <div className="space-y-2">
              {[
                { href: '/admin/menu', label: 'Ajouter un plat', icon: '➕' },
                { href: '/admin/livreurs', label: 'Nouveau livreur', icon: '🛵' },
                { href: '/admin/site', label: 'Modifier le site', icon: '⚙️' },
              ].map(({ href, label, icon }) => (
                <Link key={href} href={href} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#111] hover:bg-[#161616] transition-colors text-xs text-gray-400 hover:text-white">
                  <span>{icon}</span><span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
