'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Award, ShoppingBag } from 'lucide-react'

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    fetch('/api/utilisateur/all')
      .then(r => r.ok ? r.json() : [])
      .then(d => setClients(Array.isArray(d) ? d : []))
  }, [])

  const filtered = clients.filter(c =>
    !search || `${c.nom} ${c.prenoms} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-white">Clients</h1>
        <p className="text-gray-600 text-sm">{clients.length} client(s) enregistré(s)</p>
      </div>

      <div className="relative w-64">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="bg-[#111] border border-[#1a1a1a] rounded-xl pl-8 pr-3 py-2 text-white text-sm outline-none focus:border-orange-500/40 w-full" />
      </div>

      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#141414]">
              {['Client', 'Contact', 'Points fidélité', 'Commandes', 'Depuis le'].map(h => (
                <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111]">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-gray-700 py-8">Aucun client</td></tr>
            ) : filtered.map((c, i) => (
              <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="hover:bg-[#111] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar avec photo si disponible */}
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-orange-500/10 flex items-center justify-center">
                      {c.image
                        ? <img src={c.image + '?t=' + Math.floor(Date.now() / 3600000)} alt={c.prenoms}
                            className="w-full h-full object-cover" />
                        : <span className="text-orange-400 font-bold text-xs">{c.prenoms?.charAt(0)}{c.nom?.charAt(0)}</span>
                      }
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{c.prenoms} {c.nom}</p>
                      {c.sexe && <p className="text-gray-700 text-xs">{c.sexe === 'HOMME' ? '👨' : c.sexe === 'FEMME' ? '👩' : '⚧'} {c.sexe}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  <div>{c.email}</div>
                  {c.telephone && <div className="text-gray-600">{c.telephone}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-orange-400 text-sm font-bold">
                    <Award size={13} />{c.points}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <ShoppingBag size={13} />{c._count?.commandes ?? 0}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
