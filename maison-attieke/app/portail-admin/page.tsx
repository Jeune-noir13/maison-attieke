'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, Shield, Loader2, AlertTriangle } from 'lucide-react'

export default function PortailAdminPage() {
  const router = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)
  const pwdRef = useRef<HTMLInputElement>(null)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const locked = attempts >= 5

  useEffect(() => {
    fetch('/api/admin/verify').then(r => {
      if (r.ok) router.replace('/admin')
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (locked) return

    // Read values directly from DOM refs — bypasses all autofill/state issues
    const email = emailRef.current?.value?.trim() ?? ''
    const motDePasse = pwdRef.current?.value?.trim() ?? ''

    if (!email || !motDePasse) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, motDePasse }),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/admin')
    } else {
      const next = attempts + 1
      setAttempts(next)
      setError(next >= 5 ? 'Trop de tentatives. Actualisez la page.' : 'Identifiants incorrects')
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        <div className="flex items-center justify-center mb-8 gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-orange-500/40" />
          <div className="flex items-center gap-2 text-orange-500/60 text-xs tracking-widest uppercase font-bold">
            <Shield size={12} />
            Accès restreint
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-orange-500/40" />
        </div>

        <div className="border border-[#1f1f1f] bg-[#0d0d0d] rounded-2xl overflow-hidden shadow-2xl shadow-black">
          <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400" />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
                <Lock size={18} className="text-orange-400" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">Portail Administration</h1>
                <p className="text-gray-600 text-xs">La Maison de l'Attiéké</p>
              </div>
            </div>

            {locked && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5 text-red-400 text-sm">
                <AlertTriangle size={14} />
                <span>Trop de tentatives. Actualisez la page pour réessayer.</span>
              </motion.div>
            )}

            {error && !locked && (
              <motion.div key={attempts} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/8 border border-red-500/20 rounded-xl p-3 mb-5 text-red-400 text-sm">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-2 block">Identifiant</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    ref={emailRef}
                    type="email"
                    defaultValue=""
                    className="w-full bg-[#111] border border-[#2a2a2a] focus:border-orange-500/50 rounded-xl pl-9 pr-4 py-3 text-white text-sm outline-none transition-colors placeholder-gray-700"
                    placeholder="admin@maison-attieke.ci"
                    autoComplete="off"
                    spellCheck={false}
                    required
                    disabled={locked}
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-2 block">Mot de passe</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    ref={pwdRef}
                    type={showPwd ? 'text' : 'password'}
                    defaultValue=""
                    className="w-full bg-[#111] border border-[#2a2a2a] focus:border-orange-500/50 rounded-xl pl-9 pr-10 py-3 text-white text-sm outline-none transition-colors placeholder-gray-700"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    disabled={locked}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {attempts > 0 && !locked && (
                <p className="text-orange-500/60 text-xs text-right">{5 - attempts} tentative(s) restante(s)</p>
              )}

              <button
                type="submit"
                disabled={loading || locked}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" />Vérification...</> : 'CONNEXION SÉCURISÉE'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#1a1a1a] flex items-center justify-between">
              <span className="text-gray-700 text-xs">Session chiffrée · JWT 12h</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600 text-xs">Connexion sécurisée</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-800 text-xs mt-6">
          Accès réservé au personnel autorisé · Toute tentative d'intrusion sera journalisée
        </p>
      </motion.div>
    </div>
  )
}
