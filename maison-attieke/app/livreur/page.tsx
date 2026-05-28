'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Truck, Lock, Eye, EyeOff, Loader2, Shield } from 'lucide-react'

export default function LivreurLoginPage() {
  const router = useRouter()
  const idRef = useRef<HTMLInputElement>(null)
  const pwdRef = useRef<HTMLInputElement>(null)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/livreur/verify').then(r => {
      if (r.ok) router.replace('/livreur/dashboard')
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Read directly from DOM refs — trim to avoid invisible spaces
    const livreurId = idRef.current?.value?.trim().toUpperCase() ?? ''
    const motDePasse = pwdRef.current?.value?.trim() ?? ''

    if (!livreurId || !motDePasse) {
      setLoading(false)
      setError('Veuillez remplir tous les champs')
      return
    }

    const res = await fetch('/api/livreur/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ livreurId, motDePasse }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) setError(data.error || 'Identifiants incorrects')
    else router.push('/livreur/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060606] p-4">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute w-px bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" style={{ left: `${15 + i * 15}%`, height: '100%' }} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mb-4">
            <Truck size={28} className="text-orange-400" />
          </div>
          <h1 className="text-white font-black text-2xl">Espace Livreur</h1>
          <p className="text-gray-600 text-sm mt-1">La Maison de l'Attiéké · Abidjan</p>
        </div>

        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-0.5 bg-gradient-to-r from-orange-600 to-orange-400" />
          <div className="p-6">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/8 border border-red-500/20 rounded-xl p-3 mb-4 text-red-400 text-sm text-center">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div>
                <label className="text-gray-600 text-xs uppercase tracking-wider block mb-1.5">Votre ID Livreur</label>
                <div className="relative">
                  <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    ref={idRef}
                    defaultValue=""
                    className="w-full bg-[#111] border border-[#222] focus:border-orange-500/40 rounded-xl pl-8 pr-4 py-3 text-white text-sm outline-none transition-colors font-mono tracking-widest uppercase"
                    placeholder="LIV-001"
                    autoComplete="off"
                    spellCheck={false}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-600 text-xs uppercase tracking-wider block mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    ref={pwdRef}
                    type={showPwd ? 'text' : 'password'}
                    defaultValue=""
                    className="w-full bg-[#111] border border-[#222] focus:border-orange-500/40 rounded-xl pl-8 pr-9 py-3 text-white text-sm outline-none transition-colors"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
                {loading ? <><Loader2 size={16} className="animate-spin" />Connexion...</> : 'SE CONNECTER'}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-2 text-gray-700 text-xs">
              <Shield size={11} />
              <span>Identifiants fournis par l'administration</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
