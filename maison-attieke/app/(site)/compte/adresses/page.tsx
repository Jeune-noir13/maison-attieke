'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Plus, Pencil, Trash2, Star, Loader2, X, Check } from 'lucide-react'

interface Adresse { id: string; label: string; adresse: string; commune: string; defaut: boolean }

const emptyForm = { label: '', adresse: '', commune: '', defaut: false }

export default function AdressesPage() {
  const { status } = useSession()
  const router     = useRouter()
  const [adresses, setAdresses] = useState<Adresse[]>([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState<'add' | 'edit' | null>(null)
  const [form,     setForm]     = useState(emptyForm)
  const [editId,   setEditId]   = useState<string | null>(null)
  const [saving,   setSaving]   = useState(false)

  const load = () => fetch('/api/utilisateur/adresses')
    .then(async r => { if (!r.ok) return []; const t = await r.text(); try { return t ? JSON.parse(t) : [] } catch { return [] } })
    .then(d => { setAdresses(Array.isArray(d) ? d : []); setLoading(false) })
    .catch(() => setLoading(false))

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/connexion'); return }
    if (status !== 'authenticated') return
    load()
  }, [status])

  const openAdd  = () => { setForm(emptyForm); setEditId(null); setModal('add') }
  const openEdit = (a: Adresse) => { setForm({ label: a.label, adresse: a.adresse, commune: a.commune, defaut: a.defaut }); setEditId(a.id); setModal('edit') }

  const handleSubmit = async () => {
    if (!form.label || !form.adresse || !form.commune) return
    setSaving(true)
    if (modal === 'add') {
      await fetch('/api/utilisateur/adresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch(`/api/utilisateur/adresses/${editId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    await load(); setSaving(false); setModal(null)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/utilisateur/adresses/${id}`, { method: 'DELETE' })
    await load()
  }

  const handleSetDefault = async (a: Adresse) => {
    await fetch(`/api/utilisateur/adresses/${a.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...a, defaut: true }) })
    await load()
  }

  const inputCls = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-orange-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors'

  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto px-4 pb-16">
        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <Link href="/compte" className="text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
            <h1 className="text-white font-black text-lg">Mes adresses</h1>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-black font-bold px-3 py-2 rounded-xl text-xs transition-colors">
            <Plus size={14} />Ajouter
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : adresses.length === 0 ? (
          <div className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-12 text-center">
            <MapPin size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucune adresse enregistrée</p>
            <button onClick={openAdd} className="mt-4 bg-orange-500 hover:bg-orange-600 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors inline-flex items-center gap-2">
              <Plus size={14} />Ajouter une adresse
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {adresses.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`bg-[#111] rounded-2xl border p-4 ${a.defaut ? 'border-orange-500/30' : 'border-[#1f1f1f]'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.defaut ? 'bg-orange-500/15' : 'bg-[#1a1a1a]'}`}>
                    <MapPin size={17} className={a.defaut ? 'text-orange-400' : 'text-gray-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold text-sm">{a.label}</p>
                      {a.defaut && <span className="text-orange-400 text-xs bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">Par défaut</span>}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">{a.adresse}</p>
                    <p className="text-gray-600 text-xs">{a.commune}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {!a.defaut && (
                      <button onClick={() => handleSetDefault(a)} title="Définir par défaut"
                        className="w-8 h-8 bg-[#1a1a1a] hover:bg-orange-500/10 rounded-lg flex items-center justify-center text-gray-600 hover:text-orange-400 transition-colors">
                        <Star size={13} />
                      </button>
                    )}
                    <button onClick={() => openEdit(a)}
                      className="w-8 h-8 bg-[#1a1a1a] hover:bg-blue-500/10 rounded-lg flex items-center justify-center text-gray-600 hover:text-blue-400 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(a.id)}
                      className="w-8 h-8 bg-[#1a1a1a] hover:bg-red-500/10 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal add/edit */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">{modal === 'add' ? 'Nouvelle adresse' : "Modifier l'adresse"}</h3>
                <button onClick={() => setModal(null)} className="text-gray-600 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'label',   placeholder: 'Étiquette (ex: Maison, Bureau)', label: 'Étiquette' },
                  { key: 'adresse', placeholder: 'Rue, numéro, quartier', label: 'Adresse complète' },
                  { key: 'commune', placeholder: 'Commune (ex: Cocody)', label: 'Commune' },
                ].map(({ key, placeholder, label }) => (
                  <div key={key}>
                    <label className="text-gray-600 text-xs mb-1 block">{label}</label>
                    <input value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder} className={inputCls} />
                  </div>
                ))}
                <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                  <div onClick={() => setForm(f => ({ ...f, defaut: !f.defaut }))}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${form.defaut ? 'bg-orange-500 border-orange-500' : 'border-[#3a3a3a]'}`}>
                    {form.defaut && <Check size={12} className="text-black" strokeWidth={3} />}
                  </div>
                  <span className="text-gray-400 text-sm">Définir comme adresse par défaut</span>
                </label>
              </div>
              <button onClick={handleSubmit} disabled={saving || !form.label || !form.adresse || !form.commune}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mt-4">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                {modal === 'add' ? "Ajouter l'adresse" : 'Enregistrer'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
