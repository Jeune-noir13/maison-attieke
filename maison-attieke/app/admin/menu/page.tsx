'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, X, Loader2, Star } from 'lucide-react'
import Image from 'next/image'

const CATEGORIES = ['BRAISES', 'GRILLADES', 'KEDJENOU', 'SOUPES', 'ACCOMPAGNEMENTS', 'BOISSONS', 'SUCRERIES']

interface MenuItem { id: string; nom: string; description: string; prix: number; image: string | null; categorie: string; disponible: boolean; populaire: boolean; note: number }

const EMPTY: Omit<MenuItem, 'id'> = { nom: '', description: '', prix: 0, image: '', categorie: 'BRAISES', disponible: true, populaire: false, note: 4.5 }

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [filtered, setFiltered] = useState<MenuItem[]>([])
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = () => fetch('/api/admin/menu').then(r => r.json()).then(d => { setItems(d); setFiltered(d) })
  useEffect(() => { load() }, [])

  useEffect(() => {
    let f = items
    if (search) f = f.filter(i => i.nom.toLowerCase().includes(search.toLowerCase()))
    if (catFilter) f = f.filter(i => i.categorie === catFilter)
    setFiltered(f)
  }, [search, catFilter, items])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal('create') }
  const openEdit = (item: MenuItem) => { setForm({ ...item }); setEditing(item); setModal('edit') }

  const save = async () => {
    setSaving(true)
    if (modal === 'create') {
      await fetch('/api/admin/menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, prix: Number(form.prix) }) })
    } else {
      await fetch(`/api/admin/menu/${editing!.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, prix: Number(form.prix) }) })
    }
    setSaving(false); setModal(null); load()
  }

  const toggle = async (item: MenuItem) => {
    await fetch(`/api/admin/menu/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ disponible: !item.disponible }) })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Supprimer ce plat ?')) return
    setDeleting(id)
    await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' })
    setDeleting(null); load()
  }

  const upd = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Menu & Produits</h1>
          <p className="text-gray-600 text-sm">{items.length} produits au total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          <Plus size={15} />Nouveau plat
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="bg-[#111] border border-[#1a1a1a] rounded-xl pl-8 pr-3 py-2 text-white text-sm outline-none focus:border-orange-500/40 w-52" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-[#111] border border-[#1a1a1a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-orange-500/40">
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#141414]">
                {['Produit', 'Catégorie', 'Prix', 'Note', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider font-medium px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111]">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-[#111] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0">
                        {item.image ? <Image src={item.image} alt={item.nom} width={40} height={40} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{item.nom}</p>
                        <p className="text-gray-600 text-xs line-clamp-1 max-w-[180px]">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-[#1a1a1a] text-gray-400 px-2 py-1 rounded-lg">{item.categorie}</span>
                  </td>
                  <td className="px-4 py-3 text-orange-400 font-bold text-sm">{item.prix.toLocaleString()} F</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Star size={10} className="fill-yellow-400" />{item.note}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(item)} className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${item.disponible ? 'text-green-400' : 'text-gray-600'}`}>
                      {item.disponible ? <ToggleRight size={18} className="text-green-400" /> : <ToggleLeft size={18} />}
                      {item.disponible ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-orange-500/20 hover:text-orange-400 text-gray-500 flex items-center justify-center transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => del(item.id)} disabled={deleting === item.id} className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-red-500/20 hover:text-red-400 text-gray-500 flex items-center justify-center transition-colors">
                        {deleting === item.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)} className="fixed inset-0 bg-black/80 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-[#0e0e0e] border border-[#1f1f1f] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold">{modal === 'create' ? 'Nouveau plat' : 'Modifier le plat'}</h2>
                  <button onClick={() => setModal(null)} className="text-gray-600 hover:text-white"><X size={18} /></button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Nom *</label>
                      <input value={form.nom} onChange={e => upd('nom', e.target.value)} className="input-dark text-sm" placeholder="Attiéké + Poulet" />
                    </div>
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Prix (FCFA) *</label>
                      <input type="number" value={form.prix} onChange={e => upd('prix', e.target.value)} className="input-dark text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 text-xs mb-1 block">Description *</label>
                    <textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={2} className="input-dark text-sm resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Catégorie</label>
                      <select value={form.categorie} onChange={e => upd('categorie', e.target.value)} className="input-dark text-sm">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-600 text-xs mb-1 block">Note (0–5)</label>
                      <input type="number" min={0} max={5} step={0.1} value={form.note} onChange={e => upd('note', parseFloat(e.target.value))} className="input-dark text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-600 text-xs mb-1 block">URL image</label>
                    <input value={form.image || ''} onChange={e => upd('image', e.target.value)} className="input-dark text-sm" placeholder="https://..." />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.disponible} onChange={e => upd('disponible', e.target.checked)} className="accent-orange-500" />
                      <span className="text-gray-400 text-sm">Disponible</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.populaire} onChange={e => upd('populaire', e.target.checked)} className="accent-orange-500" />
                      <span className="text-gray-400 text-sm">Populaire</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setModal(null)} className="flex-1 border border-[#2a2a2a] text-gray-400 hover:text-white rounded-xl py-2.5 text-sm transition-colors">Annuler</button>
                  <button onClick={save} disabled={saving || !form.nom || !form.prix} className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-black font-bold rounded-xl py-2.5 text-sm transition-colors flex items-center justify-center gap-2">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                    {modal === 'create' ? 'Créer' : 'Enregistrer'}
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
