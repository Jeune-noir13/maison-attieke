'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Award, Gift, TrendingUp, ShoppingBag } from 'lucide-react'

const LEVELS = [
  { name: 'Bronze',   min: 0,    max: 199,  color: 'from-orange-800 to-orange-600', icon: '🥉' },
  { name: 'Silver',   min: 200,  max: 499,  color: 'from-gray-500 to-gray-400',     icon: '🥈' },
  { name: 'Gold',     min: 500,  max: 999,  color: 'from-yellow-600 to-yellow-400', icon: '🥇' },
  { name: 'Platine',  min: 1000, max: 9999, color: 'from-cyan-600 to-cyan-400',     icon: '💎' },
]

export default function FidelitePage() {
  const { status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/connexion'); return }
    if (status !== 'authenticated') return
    fetch('/api/utilisateur')
      .then(async r => { if (!r.ok) return null; const t = await r.text(); try { return t ? JSON.parse(t) : null } catch { return null } })
      .then(d => { if (d) setUserData(d) })
      .catch(() => {})
  }, [status])

  if (!userData) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const points = userData.points || 0
  const level  = LEVELS.find(l => points >= l.min && points <= l.max) || LEVELS[0]
  const next   = LEVELS.find(l => l.min > points)
  const pctToNext = next ? Math.min(100, Math.round(((points - level.min) / (next.min - level.min)) * 100)) : 100

  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 py-5">
          <Link href="/compte" className="text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-white font-black text-lg">Programme fidélité</h1>
        </div>

        {/* Points card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${level.color} rounded-2xl p-6 mb-4 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 text-8xl opacity-10 leading-none">{level.icon}</div>
          <p className="text-white/80 text-sm font-medium">Niveau actuel</p>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-white font-black text-5xl">{points}</span>
            <span className="text-white/70 text-sm mb-2">points</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white font-bold text-xl">{level.icon} {level.name}</span>
          </div>
          {next && (
            <div className="mt-4">
              <div className="flex justify-between text-white/70 text-xs mb-1">
                <span>{points} pts</span>
                <span>{next.min} pts pour {next.icon} {next.name}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pctToNext}%` }} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Comment gagner des points */}
        <div className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-5 mb-4">
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2"><TrendingUp size={15} className="text-orange-400" />Comment gagner des points</h2>
          <div className="space-y-3">
            {[
              { icon: ShoppingBag, label: 'Par commande',         val: '+10 pts / commande' },
              { icon: Star,        label: 'Laisser un avis',       val: '+5 pts / avis'      },
              { icon: Gift,        label: 'Parrainage ami',        val: '+20 pts / parrainage'},
              { icon: Award,       label: 'Commande > 5 000 F',   val: '+15 pts bonus'      },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{label}</p>
                </div>
                <span className="text-orange-400 text-xs font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Niveaux */}
        <div className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-5">
          <h2 className="text-white font-semibold text-sm mb-3">Niveaux &amp; avantages</h2>
          <div className="space-y-2">
            {LEVELS.map(l => (
              <div key={l.name} className={`flex items-center gap-3 p-3 rounded-xl ${l.name === level.name ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-[#1a1a1a]'}`}>
                <span className="text-2xl">{l.icon}</span>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${l.name === level.name ? 'text-orange-400' : 'text-white'}`}>{l.name}</p>
                  <p className="text-gray-600 text-xs">{l.min} – {l.max === 9999 ? '∞' : l.max} pts</p>
                </div>
                {l.name === level.name && <span className="text-orange-400 text-xs font-bold">Actuel</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
