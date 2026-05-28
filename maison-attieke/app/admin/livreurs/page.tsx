'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Loader2, Copy, CheckCircle, MapPin, Phone, Truck } from 'lucide-react'

interface Livreur { id: string; livreurId: string; nom: string; prenom: string; telephone: string; statut: string; enLigne: boolean; position: any; commandes: any[] }

export default function AdminLivreursPage() {
  const [livreurs, setLivreurs] = useState<Livreur[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', motDePasse: '' })
  const [saving, setSaving] = useState(false)
  const [newCredentials, setNewCredentials] = useState<{ livreurId: string; mdpClair: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const load = () => fetch('/api/admin/livreurs').then(r => r.json()).then(d => setLivreurs(Array.isArray(d) ? d : []))
  useEffect(() => { load() }, [])

  const create = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/livreurs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setNewCredentials({ livreurId: data.livreurIdClair, mdpClair: data.mdpClair })
      setForm({ nom: '', prenom: '', telephone: '', motDePasse: '' })
      load()
    }
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const del = async (id: string) => {
    if (!confirm('Supprimer ce livreur ?')) return
    await fetch(`/api/admin/livreurs/${id}`, { method: 'DELETE' })
    load()
  }

  const STATUT_MAP: Record<string, string> = {
    DISPONIBLE: 'Disponible',
    EN_LIVRAISON: 'En livraison',
    INACTIF: 'Inactif',
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Gestion des livreurs</h1>
          <p className="text-gray-600 text-sm">{livreurs.length} livreur(s) enregistré(s)</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          <Plus size={15} />Nouveau livreur
        </button>
      </div>

      {/* Credentials display after creation */}
      <AnimatePresence>
        {newCredentials && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-green-400 font-semibold mb-3">
              <CheckCircle size={16} />Livreur créé avec succès — Transmettez ces identifiants
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'ID Livreur', value: newCredentials.livreurId, key: 'id' },
                { label: 'Mot de passe temporaire', value: newCredentials.mdpClair, key: 'mdp' },
              ].map(({ label, value, key }) => (
                <div key={key} className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-xl p-3">
                  <p className="text-gray-600 text-xs mb-1">{label}</p>
                  <div className="flex items-center justify-between">
                    <code className="text-orange-400 font-bold font-mono">{value}</code>
                    <button onClick={() => copy(value, key)} className="text-gray-600 hover:text-white transition-colors">
                      {copied === key ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-3">⚠️ Notez ces informations maintenant. Le mot de passe ne sera plus visible ensuite.</p>
            <button onClick={() => setNewCredentials(null)} className="mt-2 text-gray-600 text-xs hover:text-white">Fermer</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Livreurs grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {livreurs.map((l, i) => (
          <motion.div key={l.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-4 hover:border-[#252525] transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-bold text-sm">
                    {l.prenom.charAt(0)}{l.nom.charAt(0)}
                  </div>
                  {l.enLigne && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0e0e0e]" />}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{l.prenom} {l.nom}</p>
                  <code className="text-orange-400/70 text-xs font-mono">{l.livreurId}</code>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${l.enLigne ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-gray-600 bg-gray-500/10 border-gray-500/20'}`}>
                {l.enLigne ? '● En ligne' : '○ Hors ligne'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-2"><Phone size={11} />{l.telephone}</div>
              {l.position ? (
                <div className="flex items-center gap-2 text-orange-400/60">
                  <MapPin size={11} />Lat: {l.position.lat.toFixed(4)}, Lng: {l.position.lng.toFixed(4)}
                  <span className="text-gray-700">· {new Date(l.position.updatedAt).toLocaleTimeString('fr-FR')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-700"><MapPin size={11} />Position non disponible</div>
              )}
              {l.commandes?.length > 0 && (
                <div className="flex items-center gap-2 text-blue-400/60"><Truck size={11} />{l.commandes.length} livraison(s) en cours</div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#141414]">
              <span className="text-xs text-gray-700">{STATUT_MAP[l.statut] || l.statut}</span>
              <button onClick={() => del(l.id)} className="text-xs text-gray-700 hover:text-red-400 transition-colors">Supprimer</button>
            </div>
          </motion.div>
        ))}

        {livreurs.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-600">
            <Truck size={32} className="mx-auto mb-3 opacity-30" />
            <p>Aucun livreur enregistré</p>
            <p className="text-xs mt-1">Créez votre premier livreur en cliquant sur "Nouveau livreur"</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/80 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-bold">Créer un livreur</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-white"><X size={18} /></button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Prénom *</label>
                      <input value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} className="input-dark text-sm" placeholder="Madou" />
                    </div>
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Nom *</label>
                      <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} className="input-dark text-sm" placeholder="Koné" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 text-xs mb-1 block">Téléphone *</label>
                    <input value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))} className="input-dark text-sm" placeholder="+225 07 00 00 00 00" />
                  </div>
                  <div>
                    <label className="text-gray-600 text-xs mb-1 block">Mot de passe initial *</label>
                    <input type="text" value={form.motDePasse} onChange={e => setForm(f => ({ ...f, motDePasse: e.target.value }))} className="input-dark text-sm font-mono" placeholder="Ex: Cocody2024!" />
                    <p className="text-gray-700 text-xs mt-1">Le livreur devra l'utiliser pour se connecter</p>
                  </div>
                  <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-3 text-xs text-orange-400/60">
                    Un ID unique (ex: LIV-001) sera généré automatiquement et servira d'identifiant de connexion.
                  </div>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setShowModal(false)} className="flex-1 border border-[#2a2a2a] text-gray-400 hover:text-white rounded-xl py-2.5 text-sm transition-colors">Annuler</button>
                  <button onClick={create} disabled={saving || !form.nom || !form.prenom || !form.telephone || !form.motDePasse}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-black font-bold rounded-xl py-2.5 text-sm flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}Créer le livreur
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
