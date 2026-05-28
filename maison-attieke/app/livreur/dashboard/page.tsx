'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Navigation, Phone, CheckCircle, Truck, LogOut, Wifi, WifiOff, Package, Loader2, AlertCircle, ExternalLink, Bell } from 'lucide-react'

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

export default function LivreurDashboard() {
  const router = useRouter()
  const [livreur, setLivreur] = useState<any>(null)
  const [assigned, setAssigned] = useState<any[]>([])
  const [available, setAvailable] = useState<any[]>([])
  const [gpsActive, setGpsActive] = useState(false)
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [gpsError, setGpsError] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [accepting, setAccepting] = useState<string | null>(null)
  const watchId = useRef<number | null>(null)

  const loadCommandes = useCallback(async () => {
    const d = await fetch('/api/livreur/commandes').then(r => r.json())
    if (d.assigned) setAssigned(d.assigned)
    if (d.available) setAvailable(d.available)
  }, [])

  useEffect(() => {
    fetch('/api/livreur/verify')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setLivreur(d.livreur); return loadCommandes() })
      .then(() => setLoading(false))
      .catch(() => router.replace('/livreur'))
  }, [router, loadCommandes])

  // Auto-refresh orders every 15s
  useEffect(() => {
    const interval = setInterval(loadCommandes, 15000)
    return () => clearInterval(interval)
  }, [loadCommandes])

  const sendPosition = useCallback(async (lat: number, lng: number) => {
    await fetch('/api/livreur/position', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng }),
    })
  }, [])

  const startGPS = () => {
    if (!navigator.geolocation) { setGpsError('GPS non supporté'); return }
    setGpsError('')
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setPosition({ lat, lng })
        setGpsActive(true)
        sendPosition(lat, lng)
      },
      (err) => { setGpsError(`GPS: ${err.message}`); setGpsActive(false) },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    )
  }

  const stopGPS = () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current)
    setGpsActive(false); setPosition(null); watchId.current = null
  }

  useEffect(() => {
    if (gpsActive && position) sendPosition(position.lat, position.lng)
  }, [position, gpsActive, sendPosition])

  useEffect(() => () => { stopGPS() }, [])

  const acceptOrder = async (commandeId: string) => {
    setAccepting(commandeId)
    await fetch('/api/livreur/commandes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accept', commandeId }),
    })
    await loadCommandes()
    setAccepting(null)
  }

  const updateStatut = async (commandeId: string, statut: string) => {
    setUpdating(commandeId)
    await fetch('/api/livreur/commandes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commandeId, statut }),
    })
    await loadCommandes()
    setUpdating(null)
  }

  const logout = async () => {
    await fetch('/api/livreur/verify', { method: 'DELETE' })
    stopGPS(); router.replace('/livreur')
  }

  const buildMapUrl = (cmd: any) => {
    if (position && cmd.clientLat && cmd.clientLng) {
      const minLat = Math.min(position.lat, cmd.clientLat) - 0.005
      const maxLat = Math.max(position.lat, cmd.clientLat) + 0.005
      const minLng = Math.min(position.lng, cmd.clientLng) - 0.005
      const maxLng = Math.max(position.lng, cmd.clientLng) + 0.005
      return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng},${minLat},${maxLng},${maxLat}&layer=mapnik&marker=${position.lat},${position.lng}`
    }
    if (position) return `https://www.openstreetmap.org/export/embed.html?bbox=${position.lng - 0.008},${position.lat - 0.008},${position.lng + 0.008},${position.lat + 0.008}&layer=mapnik&marker=${position.lat},${position.lng}`
    return null
  }

  const itineraireUrl = (cmd: any) => {
    if (position && cmd.clientLat && cmd.clientLng)
      return `https://www.google.com/maps/dir/${position.lat},${position.lng}/${cmd.clientLat},${cmd.clientLng}`
    if (cmd.clientLat && cmd.clientLng)
      return `https://www.google.com/maps/search/?api=1&query=${cmd.clientLat},${cmd.clientLng}`
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cmd.adresse)}`
  }

  if (loading) return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center">
      <Loader2 size={28} className="text-orange-500 animate-spin" />
    </div>
  )

  const active = assigned.filter(c => c.statut !== 'LIVRE')
  const done = assigned.filter(c => c.statut === 'LIVRE')

  return (
    <div className="min-h-screen bg-[#060606] pb-10">
      {/* Header */}
      <header className="bg-[#0a0a0a] border-b border-[#141414] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
          <Truck size={16} className="text-black" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-sm truncate">{livreur?.prenom} {livreur?.nom}</h1>
          <div className="flex items-center gap-2">
            <code className="text-orange-400/60 text-xs font-mono">{livreur?.livreurId}</code>
            <span className={`text-xs px-1.5 py-0.5 rounded-full border ${gpsActive ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-gray-600 bg-gray-500/10 border-gray-500/20'}`}>
              {gpsActive ? '● GPS actif' : '○ GPS inactif'}
            </span>
          </div>
        </div>
        {available.length > 0 && (
          <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-2 py-1">
            <Bell size={11} className="text-orange-400" />
            <span className="text-orange-400 text-xs font-bold">{available.length}</span>
          </div>
        )}
        <button onClick={logout} className="text-gray-600 hover:text-red-400 transition-colors p-2">
          <LogOut size={15} />
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* GPS Panel */}
        <div className={`rounded-2xl border p-4 transition-colors ${gpsActive ? 'bg-green-500/5 border-green-500/15' : 'bg-[#0e0e0e] border-[#1a1a1a]'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-white font-semibold text-sm">Partage de position</h2>
              <p className="text-gray-600 text-xs mt-0.5">Visible par vos clients en temps réel</p>
            </div>
            {gpsActive ? <Wifi size={16} className="text-green-400" /> : <WifiOff size={16} className="text-gray-600" />}
          </div>
          {position && (
            <div className="bg-black/20 rounded-xl p-2.5 mb-3 font-mono text-xs text-green-400/70">
              📍 {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
            </div>
          )}
          {gpsError && (
            <div className="flex items-center gap-2 text-red-400 text-xs mb-3 bg-red-500/5 border border-red-500/15 rounded-xl p-2">
              <AlertCircle size={12} />{gpsError}
            </div>
          )}
          <button
            onClick={gpsActive ? stopGPS : startGPS}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${gpsActive ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-orange-500 hover:bg-orange-600 text-black'}`}
          >
            <Navigation size={14} />
            {gpsActive ? 'Désactiver GPS' : 'Activer mon GPS'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Dispo', value: available.length, icon: '📬', color: 'text-yellow-400' },
            { label: 'En cours', value: active.length, icon: '🛵', color: 'text-orange-400' },
            { label: 'Livrées', value: done.length, icon: '✅', color: 'text-green-400' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-3 text-center">
              <div className="text-xl">{icon}</div>
              <div className={`text-lg font-black ${color}`}>{value}</div>
              <div className="text-gray-700 text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Available orders */}
        {available.length > 0 && (
          <div>
            <h2 className="text-yellow-400 font-semibold text-sm mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Commandes disponibles ({available.length})
            </h2>
            <div className="space-y-3">
              {available.map((cmd) => (
                <motion.div key={cmd.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0e0e0e] border border-yellow-500/20 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <code className="text-yellow-400 text-xs font-mono font-bold">{cmd.numero}</code>
                      <p className="text-white font-medium text-sm mt-0.5">{cmd.user?.prenoms} {cmd.user?.nom}</p>
                    </div>
                    <span className="text-orange-400 font-bold text-sm">{cmd.total?.toLocaleString()} F</span>
                  </div>
                  <div className="bg-[#111] rounded-xl p-2.5 mb-3 text-xs text-gray-500 space-y-0.5">
                    {cmd.lignes?.map((l: any) => (
                      <div key={l.id} className="flex justify-between">
                        <span>{l.menuItem?.nom}</span><span>×{l.quantite}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                    <MapPin size={11} className="text-orange-500 shrink-0" />
                    <span className="truncate">{cmd.adresse}</span>
                    {cmd.clientLat && <span className="text-green-400 shrink-0">· 📍 GPS</span>}
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${cmd.user?.telephone}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111] border border-[#222] text-gray-400 text-xs hover:text-orange-400 transition-colors">
                      <Phone size={12} />{cmd.user?.telephone}
                    </a>
                    <button
                      onClick={() => acceptOrder(cmd.id)}
                      disabled={accepting === cmd.id}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-bold text-sm py-2 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {accepting === cmd.id ? <Loader2 size={14} className="animate-spin" /> : '🛵'} Accepter la livraison
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Active deliveries */}
        <div>
          <h2 className="text-white font-semibold text-sm mb-2">Mes livraisons en cours</h2>
          {active.length === 0 ? (
            <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-8 text-center">
              <Package size={30} className="text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Acceptez une commande ci-dessus</p>
            </div>
          ) : (
            <div className="space-y-3">
              {active.map((cmd) => {
                const mapUrl = buildMapUrl(cmd)
                const navUrl = itineraireUrl(cmd)
                return (
                  <motion.div key={cmd.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <code className="text-orange-400 text-xs font-mono font-bold">{cmd.numero}</code>
                        <p className="text-white font-medium text-sm mt-0.5">{cmd.user?.prenoms} {cmd.user?.nom}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${STATUT_COLORS[cmd.statut]}`}>
                        {STATUT_LABELS[cmd.statut]}
                      </span>
                    </div>

                    {/* Map */}
                    {mapUrl && (
                      <div className="rounded-xl overflow-hidden mb-3 h-36">
                        <iframe src={mapUrl} className="w-full h-full border-0" title="Carte livraison" />
                      </div>
                    )}

                    {/* Call + itineraire */}
                    <div className="flex gap-2 mb-3">
                      <a href={`tel:${cmd.user?.telephone}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors">
                        <Phone size={14} /> Appeler le client
                      </a>
                      <a href={navUrl} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors">
                        <ExternalLink size={14} /> Itinéraire
                      </a>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600 text-xs mb-3">
                      <MapPin size={11} className="text-orange-500 shrink-0" />
                      <span className="truncate">{cmd.adresse}</span>
                    </div>

                    {/* Status buttons */}
                    <div className="flex gap-1">
                      {['EN_ROUTE', 'ARRIVE', 'LIVRE'].map((s) => {
                        const order = ['EN_ATTENTE', 'EN_PREPARATION', 'EN_ROUTE', 'ARRIVE', 'LIVRE']
                        const isActive = cmd.statut === s
                        const isPast = order.indexOf(cmd.statut) > order.indexOf(s)
                        return (
                          <button key={s} onClick={() => updateStatut(cmd.id, s)}
                            disabled={updating === cmd.id || isPast}
                            className={`flex-1 py-2 text-xs rounded-xl font-medium border transition-all ${isActive ? 'bg-orange-500 text-black border-orange-500' : isPast ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-[#111] text-gray-600 border-[#1a1a1a] hover:text-white'}`}>
                            {updating === cmd.id ? '...' : STATUT_LABELS[s]}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Done */}
        {done.length > 0 && (
          <div>
            <h2 className="text-gray-600 font-semibold text-sm mb-2">Livrées aujourd'hui ({done.length})</h2>
            <div className="space-y-2">
              {done.slice(0, 5).map((cmd) => (
                <div key={cmd.id} className="bg-[#0a0a0a] border border-[#141414] rounded-xl p-3 flex items-center gap-3 opacity-60">
                  <CheckCircle size={15} className="text-green-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs truncate">{cmd.user?.prenoms} {cmd.user?.nom}</p>
                    <p className="text-gray-600 text-xs">{cmd.numero}</p>
                  </div>
                  <span className="text-green-400 text-xs font-bold shrink-0">{cmd.total?.toLocaleString()} F</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
