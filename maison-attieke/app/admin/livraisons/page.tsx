'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Truck, MapPin, Phone, Package, Clock, RefreshCw, Navigation } from 'lucide-react'

const STATUT_LABELS: Record<string, string> = {
  EN_ROUTE: '🛵 En route',
  ARRIVE: '📍 Arrivé',
}
const STATUT_COLORS: Record<string, string> = {
  EN_ROUTE:  'text-orange-400 bg-orange-500/10 border-orange-500/20',
  ARRIVE:    'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

export default function AdminLivraisonsPage() {
  const [livraisons, setLivraisons] = useState<any[]>([])
  const [loading,    setLoading]    = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const load = useCallback(() => {
    fetch('/api/admin/livraisons-actives')
      .then(r => r.json())
      .then(d => { setLivraisons(Array.isArray(d) ? d : []); setLoading(false); setLastUpdate(new Date()) })
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 10000) // refresh every 10s
    return () => clearInterval(t)
  }, [load])

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck size={20} className="text-orange-400" />
            Livraisons en cours
            {livraisons.length > 0 && (
              <span className="bg-orange-500 text-black text-xs font-black px-2 py-0.5 rounded-full">{livraisons.length}</span>
            )}
          </h1>
          <p className="text-gray-600 text-sm">
            Progression en temps réel · Màj : {lastUpdate.toLocaleTimeString('fr-FR')}
          </p>
        </div>
        <button onClick={load}
          className="flex items-center gap-2 text-gray-400 hover:text-white bg-[#111] border border-[#1a1a1a] px-3 py-2 rounded-xl text-sm transition-colors">
          <RefreshCw size={14} />Actualiser
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="h-48 bg-[#0e0e0e] rounded-2xl animate-pulse" />)}
        </div>
      ) : livraisons.length === 0 ? (
        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-16 text-center">
          <Truck size={48} className="text-gray-800 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Aucune livraison en cours</p>
          <p className="text-gray-700 text-sm mt-1">Les livraisons actives apparaîtront ici en temps réel</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {livraisons.map((cmd, i) => {
            const livreur = cmd.livreur
            const pos     = livreur?.position
            const client  = cmd.user
            const mapsUrl = pos
              ? `https://www.google.com/maps?q=${pos.lat},${pos.lng}`
              : null

            return (
              <motion.div key={cmd.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#141414] bg-[#0a0a0a]">
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-orange-400" />
                    <span className="text-white font-bold text-sm">#{cmd.numero}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUT_COLORS[cmd.statut]}`}>
                    {STATUT_LABELS[cmd.statut] || cmd.statut}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Livreur */}
                  <div className="flex items-center gap-3 bg-[#111] rounded-xl p-3">
                    <div className="w-9 h-9 bg-orange-500/10 rounded-full flex items-center justify-center shrink-0">
                      <Truck size={16} className="text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{livreur?.prenom} {livreur?.nom}</p>
                      <p className="text-gray-600 text-xs">{livreur?.livreurId}</p>
                    </div>
                    {livreur?.telephone && (
                      <a href={`tel:${livreur.telephone}`}
                        className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-colors shrink-0">
                        <Phone size={14} />
                      </a>
                    )}
                  </div>

                  {/* Client */}
                  <div className="flex items-center gap-3 bg-[#111] rounded-xl p-3">
                    <div className="w-9 h-9 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{client?.prenoms} {client?.nom}</p>
                      <p className="text-gray-600 text-xs truncate">{cmd.adresse}</p>
                    </div>
                    {client?.telephone && (
                      <a href={`tel:${client.telephone}`}
                        className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-colors shrink-0">
                        <Phone size={14} />
                      </a>
                    )}
                  </div>

                  {/* Position + heure */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(cmd.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {pos ? (
                      <a href={mapsUrl!} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-orange-400 hover:underline">
                        <Navigation size={11} />
                        Voir sur Maps
                      </a>
                    ) : (
                      <span className="text-gray-700">Position non disponible</span>
                    )}
                  </div>

                  {/* Articles */}
                  <div className="text-xs text-gray-600 truncate">
                    📦 {cmd.lignes?.map((l: any) => `${l.quantite}× ${l.menuItem?.nom}`).join(', ')}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-1 border-t border-[#141414]">
                    <span className="text-gray-600 text-xs">Total</span>
                    <span className="text-orange-400 font-bold text-sm">{cmd.total?.toLocaleString()} F</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
