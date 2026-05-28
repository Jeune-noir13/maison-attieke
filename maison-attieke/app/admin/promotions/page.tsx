'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, CheckCircle, X } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  PERCENT: '% Réduction',
  FIXED: 'Montant fixe',
  FREE_DELIVERY: 'Livraison gratuite',
}

const emptyForm = { code: '', description: '', type: 'PERCENT', valeur: 10, minCommande: 0, maxUses: 100, expiresAt: '' }

export default function PromotionsPage() {
  const [promos, setPromos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })

  const load = () => fetch('/api/admin/promotions')
    .then(async r => { const t = await r.text(); try { return t ? JSON.parse(t) : [] } catch { return [] } })
    .then(d => { setPromos(Array.isArray(d) ? d : []); setLoading(false) })

  useEffect(() => { load() }, [])

  const upd = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => { setSaved(false); setShowForm(false); setForm({ ...emptyForm }) }, 1200)
    load()
  }

  const toggle = async (p: any) => {
    await fetch('/api/admin/promotions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, actif: !p.actif }),
    })
    setPromos(ps => ps.map(x => x.id === p.id ? { ...x, actif: !x.actif } : x))
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette promotion ?')) return
    await fetch('/api/admin/promotions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setPromos(ps => ps.filter(p => p.id !== id))
  }

  const inputCls = 'w-full bg-[#111] border border-[#1f1f1f] focus:border-orange-500/40 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-colors placeholder-gray-700'

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag size={20} className="text-orange-400" /> Promotions & Codes promo
          </h1>
          <p className="text-gray-600 text-sm">Créez des réductions pour vos clients</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          {showForm ? <X size={15} /> : <Plus size={15} />}
          {showForm ? 'Annuler' : 'Nouveau code'}
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={handleCreate} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm">Créer un nouveau code promo</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-1.5 block">Code promo *</label>
                <input value={form.code} onChange={e => upd('code', e.target.value.toUpperCase())}
                  placeholder="EX: NOEL20" required className={inputCls} />
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-1.5 block">Type de réduction *</label>
                <select value={form.type} onChange={e => upd('type', e.target.value)} className={inputCls}>
                  <option value="PERCENT">% Pourcentage</option>
                  <option value="FIXED">Montant fixe (FCFA)</option>
                  <option value="FREE_DELIVERY">Livraison gratuite</option>
                </select>
              </div>

              {form.type !== 'FREE_DELIVERY' && (
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider mb-1.5 block">
                    {form.type === 'PERCENT' ? 'Pourcentage (%)' : 'Montant à déduire (FCFA)'}
                  </label>
                  <input type="number" min={1} value={form.valeur} onChange={e => upd('valeur', Number(e.target.value))}
                    className={inputCls} />
                </div>
              )}

              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-1.5 block">Commande minimum (FCFA)</label>
                <input type="number" min={0} value={form.minCommande} onChange={e => upd('minCommande', Number(e.target.value))}
                  placeholder="0 = pas de minimum" className={inputCls} />
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-1.5 block">Nb d'utilisations max</label>
                <input type="number" min={1} value={form.maxUses} onChange={e => upd('maxUses', Number(e.target.value))}
                  className={inputCls} />
              </div>
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-1.5 block">Date d'expiration (optionnel)</label>
                <input type="date" value={form.expiresAt} onChange={e => upd('expiresAt', e.target.value)}
                  className={inputCls} />
              </div>
            </div>

            <div>
              <label className="text-gray-500 text-xs uppercase tracking-wider mb-1.5 block">Description *</label>
              <input value={form.description} onChange={e => upd('description', e.target.value)}
                placeholder="Ex: -20% pour Noël !" required className={inputCls} />
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle size={14} /> : <Plus size={14} />}
                {saved ? 'Créé !' : 'Créer la promotion'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : promos.length === 0 ? (
        <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl p-12 text-center">
          <Tag size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucune promotion créée</p>
          <p className="text-gray-700 text-sm mt-1">Créez votre premier code promo avec le bouton ci-dessus</p>
        </div>
      ) : (
        <div className="space-y-2">
          {promos.map(p => {
            const expired = p.expiresAt && new Date(p.expiresAt) < new Date()
            return (
              <motion.div key={p.id} layout className={`bg-[#0e0e0e] border rounded-2xl p-4 flex items-center gap-4 ${p.actif && !expired ? 'border-[#1a1a1a]' : 'border-[#1a1a1a] opacity-50'}`}>
                <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Tag size={16} className="text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-orange-400 font-black text-sm bg-orange-500/10 px-2 py-0.5 rounded">{p.code}</code>
                    <span className="text-gray-500 text-xs">{TYPE_LABELS[p.type]}</span>
                    {p.type !== 'FREE_DELIVERY' && (
                      <span className="text-white font-bold text-xs">
                        {p.type === 'PERCENT' ? `-${p.valeur}%` : `-${p.valeur.toLocaleString()} F`}
                      </span>
                    )}
                    {expired && <span className="text-red-400 text-xs bg-red-500/10 px-2 py-0.5 rounded">Expiré</span>}
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{p.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-700">
                    <span>{p.usedCount}/{p.maxUses} utilisations</span>
                    {p.minCommande > 0 && <span>Min: {p.minCommande.toLocaleString()} F</span>}
                    {p.expiresAt && <span>Exp: {new Date(p.expiresAt).toLocaleDateString('fr-FR')}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggle(p)} title={p.actif ? 'Désactiver' : 'Activer'}
                    className="text-gray-600 hover:text-orange-400 transition-colors">
                    {p.actif ? <ToggleRight size={22} className="text-orange-400" /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => remove(p.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
