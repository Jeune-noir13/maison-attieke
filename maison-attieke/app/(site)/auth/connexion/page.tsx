'use client'
import { useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function ConnexionPage() {
  const router    = useRouter()
  const emailRef  = useRef<HTMLInputElement>(null)
  const pwdRef    = useRef<HTMLInputElement>(null)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')

    const identifier = emailRef.current?.value?.trim() ?? ''
    const motDePasse = pwdRef.current?.value?.trim() ?? ''

    if (!identifier || !motDePasse) {
      setLoading(false); setError('Veuillez remplir tous les champs'); return
    }

    // Livreur flow
    if (/^LIV-/i.test(identifier)) {
      const res = await fetch('/api/livreur/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ livreurId: identifier.toUpperCase(), motDePasse }),
      })
      setLoading(false)
      if (res.ok) router.push('/livreur/dashboard')
      else setError((await res.json()).error || 'Identifiants incorrects')
      return
    }

    // Client flow
    const res = await signIn('credentials', { email: identifier, motDePasse, redirect: false })
    setLoading(false)
    if (res?.error) setError('Email ou mot de passe incorrect')
    else { router.push('/'); router.refresh() }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24"
         style={{ background: 'radial-gradient(ellipse at top, #1a0f00 0%, #0a0a0a 60%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-[#141414] border border-[#222] rounded-3xl px-8 py-10 shadow-2xl">
          <h1 className="text-white font-black text-2xl text-center mb-1">Bienvenue&nbsp;!</h1>
          <p className="text-gray-400 text-sm text-center mb-8">Connectez-vous pour continuer</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-5 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={emailRef}
              type="text"
              placeholder="Email ou numéro de téléphone"
              defaultValue=""
              autoComplete="username"
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] focus:border-orange-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-colors text-sm"
            />

            <div className="relative">
              <input
                ref={pwdRef}
                type={showPwd ? 'text' : 'password'}
                placeholder="Mot de passe"
                defaultValue=""
                autoComplete="current-password"
                className="w-full bg-[#1e1e1e] border border-[#2a2a2a] focus:border-orange-500 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-colors text-sm pr-12"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <div className="text-right">
              <Link href="#" className="text-orange-400 text-xs hover:underline">Mot de passe oublié ?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-4 rounded-xl text-sm tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
              {loading ? <><Loader2 size={16} className="animate-spin" />Connexion…</> : 'SE CONNECTER'}
            </button>
          </form>

          {/* Social */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-gray-600 text-xs">Ou continuer avec</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          <div className="flex justify-center gap-4">
            {[
              { bg: 'bg-white', label: 'Google', icon: '🇬' },
              { bg: 'bg-[#128C7E]', label: 'Téléphone', icon: '📱' },
            ].map(({ bg, label, icon }) => (
              <button key={label} title={label}
                className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center text-lg font-black text-black shadow-md hover:scale-105 active:scale-95 transition-transform`}>
                {icon}
              </button>
            ))}
          </div>

          <p className="text-center mt-7 text-gray-500 text-sm">
            Pas encore de compte ?{' '}
            <Link href="/auth/inscription" className="text-orange-400 font-semibold hover:underline">S'inscrire</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
