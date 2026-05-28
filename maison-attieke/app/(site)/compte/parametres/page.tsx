'use client'
import { useEffect, useRef, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Camera, Save, Loader2, CheckCircle, User,
  Phone, Mail, MapPin, Calendar, Lock, Trash2, Eye, EyeOff, AlertTriangle
} from 'lucide-react'

export default function ParametresPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [userData,   setUserData]   = useState<any>(null)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [uploading,  setUploading]  = useState(false)
  const [avatar,     setAvatar]     = useState<string | null>(null)
  const [showDel,    setShowDel]    = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [showPwd,    setShowPwd]    = useState(false)
  const [pwdForm,    setPwdForm]    = useState({ ancien: '', nouveau: '', confirm: '' })
  const [pwdError,   setPwdError]   = useState('')
  const [pwdOk,      setPwdOk]      = useState(false)

  const [form, setForm] = useState({
    nom: '', prenoms: '', sexe: '', email: '', telephone: '',
    lieuHabitation: '', dateNaissance: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/connexion'); return }
    if (status !== 'authenticated') return
    fetch('/api/utilisateur')
      .then(async r => { if (!r.ok) return null; const t = await r.text(); try { return t ? JSON.parse(t) : null } catch { return null } })
      .then(d => {
        if (!d) return
        setUserData(d)
        setAvatar(d.image || null)
        setForm({
          nom:            d.nom            || '',
          prenoms:        d.prenoms        || '',
          sexe:           d.sexe           || '',
          email:          d.email          || '',
          telephone:      d.telephone      || '',
          lieuHabitation: d.lieuHabitation || '',
          dateNaissance:  d.dateNaissance
            ? new Date(d.dateNaissance).toISOString().split('T')[0]
            : ''
        })
      })
      .catch(() => {})
  }, [status, router])

  if (status === 'loading' || !userData) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const initials = `${form.prenoms?.charAt(0) || ''}${form.nom?.charAt(0) || ''}`.toUpperCase() || 'U'

  const handlePhotoUpload = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res  = await fetch('/api/utilisateur/photo', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) {
      setAvatar(data.url + '?t=' + Date.now())
      await update({ image: data.url })  // Update NextAuth session
    }
    setUploading(false)
  }

  const handleRemovePhoto = async () => {
    setUploading(true)
    await fetch('/api/utilisateur/photo', { method: 'DELETE' })
    setAvatar(null)
    setUploading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/utilisateur', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    await fetch('/api/utilisateur', { method: 'DELETE' })
    await signOut({ callbackUrl: '/' })
  }

  const inputCls = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-orange-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors'

  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto px-4 pb-16">
        {/* Header */}
        <div className="flex items-center gap-3 py-5">
          <Link href="/compte" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-white font-black text-lg">Paramètres du compte</h1>
        </div>

        <div className="space-y-4">
          {/* ── Photo de profil ─────────────────────────── */}
          <div className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-5">
            <h2 className="text-white font-semibold text-sm mb-4">Photo de profil</h2>
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-4 ring-orange-500/20">
                  {avatar
                    ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-black font-black text-2xl">{initials}</span>
                  }
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center border-2 border-[#111] transition-colors"
                >
                  {uploading
                    ? <Loader2 size={12} className="text-black animate-spin" />
                    : <Camera size={12} className="text-black" />
                  }
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handlePhotoUpload(f) }} />
              </div>
              <div className="space-y-2 flex-1">
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] hover:border-orange-500/40 text-gray-300 hover:text-white text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Camera size={14} />Changer la photo
                </button>
                {avatar && (
                  <button onClick={handleRemovePhoto} disabled={uploading}
                    className="w-full bg-transparent border border-red-500/20 hover:border-red-500/50 text-red-400 text-sm py-2 rounded-xl transition-colors text-xs">
                    Supprimer la photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Informations personnelles ────────────────── */}
          <div className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-5">
            <h2 className="text-white font-semibold text-sm mb-4">Informations personnelles</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-600 text-xs mb-1.5 block">Prénoms</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    <input value={form.prenoms} onChange={e => setForm(f => ({ ...f, prenoms: e.target.value }))}
                      placeholder="Prénoms" className={`${inputCls} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className="text-gray-600 text-xs mb-1.5 block">Nom</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    <input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                      placeholder="Nom" className={`${inputCls} pl-9`} />
                  </div>
                </div>
              </div>

              {/* Sexe */}
              <div>
                <label className="text-gray-600 text-xs mb-1.5 block">Sexe</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ v: 'HOMME', label: '👨 Homme' }, { v: 'FEMME', label: '👩 Femme' }, { v: 'AUTRE', label: '⚧ Autre' }].map(({ v, label }) => (
                    <button key={v} type="button" onClick={() => setForm(f => ({ ...f, sexe: v }))}
                      className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${form.sexe === v ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-[#2a2a2a] bg-[#1a1a1a] text-gray-500 hover:border-[#3a3a3a]'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-600 text-xs mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Email" className={`${inputCls} pl-9`} />
                </div>
              </div>

              <div>
                <label className="text-gray-600 text-xs mb-1.5 block">Téléphone</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                  <input type="tel" value={form.telephone} onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
                    placeholder="+225 07 07 07 07 07" className={`${inputCls} pl-9`} />
                </div>
              </div>

              <div>
                <label className="text-gray-600 text-xs mb-1.5 block">Lieu d'habitation</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                  <input value={form.lieuHabitation} onChange={e => setForm(f => ({ ...f, lieuHabitation: e.target.value }))}
                    placeholder="Cocody, Abidjan" className={`${inputCls} pl-9`} />
                </div>
              </div>

              <div>
                <label className="text-gray-600 text-xs mb-1.5 block">Date de naissance</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                  <input type="date" value={form.dateNaissance} onChange={e => setForm(f => ({ ...f, dateNaissance: e.target.value }))}
                    className={`${inputCls} pl-9 text-gray-300`} />
                </div>
              </div>

              <button onClick={handleSave} disabled={saving}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 active:scale-[0.98] text-black font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 mt-1">
                {saving ? <><Loader2 size={15} className="animate-spin" />Enregistrement…</>
                  : saved ? <><CheckCircle size={15} />Enregistré !</>
                  : <><Save size={15} />Enregistrer les modifications</>}
              </button>
            </div>
          </div>

          {/* ── Zone dangereuse ──────────────────────────── */}
          <div className="bg-[#111] rounded-2xl border border-red-500/10 p-5">
            <h2 className="text-red-400 font-semibold text-sm mb-1 flex items-center gap-2">
              <AlertTriangle size={15} />Zone dangereuse
            </h2>
            <p className="text-gray-600 text-xs mb-4">La suppression de votre compte est irréversible.</p>

            {!showDel ? (
              <button onClick={() => setShowDel(true)}
                className="w-full border border-red-500/20 hover:border-red-500/50 text-red-400 hover:text-red-300 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                <Trash2 size={15} />Supprimer mon compte
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-red-400 text-sm font-medium text-center">⚠️ Êtes-vous certain ?</p>
                <p className="text-gray-500 text-xs text-center">Toutes vos données seront supprimées définitivement.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setShowDel(false)}
                    className="border border-[#2a2a2a] text-gray-400 hover:text-white py-2.5 rounded-xl text-sm transition-colors">
                    Annuler
                  </button>
                  <button onClick={handleDeleteAccount} disabled={deleting}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Confirmer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
