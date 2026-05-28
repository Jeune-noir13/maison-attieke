'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, User, Mail, MapPin, Calendar, Lock, Loader2, CheckCircle } from 'lucide-react'

const Field = ({ icon: Icon, children }: { icon?: any; children: React.ReactNode }) => (
  <div className="relative">
    {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />}
    {children}
  </div>
)

const inputCls = (pl = false) =>
  `w-full bg-[#1e1e1e] border border-[#2a2a2a] focus:border-orange-500 rounded-xl ${pl ? 'pl-10' : 'pl-4'} pr-4 py-3.5 text-white placeholder-gray-500 outline-none transition-colors text-sm`

export default function InscriptionPage() {
  const router  = useRouter()
  const [form, setForm] = useState({
    nom: '', prenoms: '', sexe: '', email: '', telephone: '',
    lieuHabitation: '', dateNaissance: '', motDePasse: '',
  })
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [accepted, setAccepted] = useState(false)
  const [success,  setSuccess]  = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accepted) { setError('Veuillez accepter les conditions générales'); return }
    setLoading(true); setError('')

    const res  = await fetch('/api/auth/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) { setLoading(false); setError(data.error || "Erreur lors de l'inscription"); return }

    const login = await signIn('credentials', { email: form.email, motDePasse: form.motDePasse, redirect: false })
    setLoading(false)
    setSuccess(true)
    setTimeout(() => router.push(login?.ok ? '/' : '/auth/connexion'), 1400)
  }

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: 'radial-gradient(ellipse at top, #1a0f00 0%, #0a0a0a 60%)' }}>
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
        <CheckCircle size={72} className="text-green-400 mx-auto mb-4" />
        <h2 className="text-white text-2xl font-black">Compte créé !</h2>
        <p className="text-gray-400 mt-2">Bienvenue dans la famille 🎉</p>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24"
         style={{ background: 'radial-gradient(ellipse at top, #1a0f00 0%, #0a0a0a 60%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-[#141414] border border-[#222] rounded-3xl px-8 py-10 shadow-2xl">
          <h1 className="text-white font-black text-2xl text-center mb-1">Créer un compte</h1>
          <p className="text-gray-400 text-xs text-center mb-8 leading-relaxed">
            Rejoignez la famille de<br />
            <span className="text-orange-400 font-semibold">La Maison de l'Attiéké</span>
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Field icon={User}>
              <input value={form.nom} onChange={e => set('nom', e.target.value)}
                placeholder="Nom" required className={inputCls(true)} />
            </Field>

            <Field icon={User}>
              <input value={form.prenoms} onChange={e => set('prenoms', e.target.value)}
                placeholder="Prénom" required className={inputCls(true)} />
            </Field>

            {/* Sexe */}
            <div className="grid grid-cols-3 gap-2">
              {[{ v: 'HOMME', label: '👨 Homme' }, { v: 'FEMME', label: '👩 Femme' }, { v: 'AUTRE', label: '⚧ Autre' }].map(({ v, label }) => (
                <button key={v} type="button" onClick={() => set('sexe', v)}
                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${form.sexe === v ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-[#2a2a2a] bg-[#1e1e1e] text-gray-500 hover:border-[#3a3a3a]'}`}>
                  {label}
                </button>
              ))}
            </div>

            <Field icon={Calendar}>
              <input type="date" value={form.dateNaissance} onChange={e => set('dateNaissance', e.target.value)}
                className={`${inputCls(true)} text-gray-400`} />
            </Field>

            <Field icon={MapPin}>
              <input value={form.lieuHabitation} onChange={e => set('lieuHabitation', e.target.value)}
                placeholder="Lieu d'habitation" className={inputCls(true)} />
            </Field>

            {/* Phone with flag prefix */}
            <div className="flex gap-0">
              <div className="flex items-center gap-1.5 bg-[#1e1e1e] border border-r-0 border-[#2a2a2a] rounded-l-xl px-3 shrink-0">
                <span className="text-base">🇨🇮</span>
                <span className="text-gray-400 text-sm font-medium">+225</span>
              </div>
              <input type="tel" value={form.telephone} onChange={e => set('telephone', e.target.value)}
                placeholder="Numéro de téléphone"
                className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] focus:border-orange-500 rounded-r-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-colors text-sm" />
            </div>

            <Field icon={Mail}>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="Email" required className={inputCls(true)} />
            </Field>

            <Field icon={Lock}>
              <input type={showPwd ? 'text' : 'password'} value={form.motDePasse} onChange={e => set('motDePasse', e.target.value)}
                placeholder="Mot de passe" required minLength={6}
                className={`${inputCls(true)} pr-12`} />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </Field>

            {/* CGU checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <div className="relative mt-0.5 shrink-0">
                <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
                  className="sr-only" />
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
                  ${accepted ? 'bg-orange-500 border-orange-500' : 'bg-[#1e1e1e] border-[#3a3a3a]'}`}>
                  {accepted && <svg viewBox="0 0 12 10" className="w-3 h-3"><path d="M1 5l3 3 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
                </div>
              </div>
              <span className="text-gray-400 text-xs leading-relaxed">
                J'accepte les{' '}
                <a href="#" className="text-orange-400 hover:underline">Conditions Générales</a>
                {' '}et la{' '}
                <a href="#" className="text-orange-400 hover:underline">Politique de confidentialité</a>
              </span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-4 rounded-xl text-sm tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 mt-1">
              {loading ? <><Loader2 size={16} className="animate-spin" />Création…</> : "S'INSCRIRE"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500 text-sm">
            Déjà un compte ?{' '}
            <Link href="/auth/connexion" className="text-orange-400 font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
