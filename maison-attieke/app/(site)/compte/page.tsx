'use client'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShoppingBag, MapPin, Heart, Star, CreditCard,
  Settings, LogOut, ChevronRight, Award, User, MessageSquare, HandCoins,
} from 'lucide-react'

const MENU_ITEMS = [
  { icon: ShoppingBag,    label: 'Mes commandes',        href: '/compte/commandes' },
  { icon: MapPin,         label: 'Mes adresses',          href: '/compte/adresses'  },
  { icon: Heart,          label: 'Mes favoris',           href: '/compte/favoris'   },
  { icon: Award,          label: 'Programme fidélité',    href: '/compte/fidelite'  },
  { icon: HandCoins,      label: 'Mes offres',            href: '/compte/offres'    },
  { icon: MessageSquare,  label: 'Mes messages',          href: '/compte/messages'  },
  { icon: CreditCard,     label: 'Moyens de paiement',    href: '/compte/paiement'  },
  { icon: Settings,       label: 'Paramètres',             href: '/compte/parametres'},
]

export default function ComptePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/connexion'); return }
    if (status === 'authenticated') {
      fetch('/api/utilisateur').then(r => r.json()).then(setUserData)
    }
  }, [status, router])

  if (status === 'loading' || !session) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const user = session.user as any
  const points     = userData?.points ?? user?.points ?? 0
  const commandes  = userData?.commandes?.length ?? 0
  const adresses   = userData?.adresses?.length ?? 0
  const initials   = user?.name ? user.name.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase() : 'U'

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      <div className="max-w-md mx-auto px-4 pb-12">

        {/* ── Avatar + infos ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center pt-10 pb-6"
        >
          <div className="relative mb-4">
            {/* Priorité : image depuis l'API (toujours à jour) puis session */}
            {(userData?.image || user?.image) ? (
              <img
                src={(userData?.image || user?.image) + '?t=' + Math.floor(Date.now() / 60000)}
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-orange-500/30"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-black font-black text-2xl ring-4 ring-orange-500/20">
                {initials}
              </div>
            )}
            <Link href="/compte/parametres" className="absolute bottom-0 right-0 w-6 h-6 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center border-2 border-[#0a0a0a] transition-colors">
              <User size={11} className="text-black" />
            </Link>
          </div>
          <h1 className="text-white font-black text-xl">{userData ? `${userData.prenoms} ${userData.nom}` : user?.name}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{userData?.telephone ?? '—'}</p>
          <p className="text-gray-600 text-xs mt-0.5">{userData?.email ?? user?.email}</p>
        </motion.div>

        {/* ── Stats ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="grid grid-cols-3 rounded-2xl overflow-hidden border border-[#1f1f1f] mb-4"
        >
          {[
            { value: commandes, label: 'Commandes' },
            { value: points,    label: 'Points fidélité', orange: true },
            { value: adresses,  label: 'Adresses' },
          ].map(({ value, label, orange }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center py-4 px-2 bg-[#111]
                ${i < 2 ? 'border-r border-[#1f1f1f]' : ''}`}
            >
              <span className={`text-2xl font-black ${orange ? 'text-orange-400' : 'text-white'}`}>
                {value}
              </span>
              <span className="text-gray-500 text-[11px] text-center leading-tight mt-0.5">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Menu list ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="bg-[#111] rounded-2xl border border-[#1f1f1f] overflow-hidden"
        >
          {MENU_ITEMS.map(({ icon: Icon, label, href }, i) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3.5 px-5 py-4 hover:bg-[#1a1a1a] active:bg-[#222] transition-colors
                ${i < MENU_ITEMS.length - 1 ? 'border-b border-[#1a1a1a]' : ''}`}
            >
              <div className="w-9 h-9 bg-[#1e1e1e] rounded-xl flex items-center justify-center shrink-0">
                <Icon size={17} className="text-gray-400" />
              </div>
              <span className="flex-1 text-white text-sm font-medium">{label}</span>
              <ChevronRight size={16} className="text-gray-600" />
            </Link>
          ))}

          {/* Déconnexion — dans la liste */}
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3.5 px-5 py-4 hover:bg-red-500/5 active:bg-red-500/10 transition-colors border-t border-[#1a1a1a]"
          >
            <div className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
              <LogOut size={17} className="text-red-400" />
            </div>
            <span className="flex-1 text-red-400 text-sm font-medium text-left">Déconnexion</span>
            <ChevronRight size={16} className="text-red-600/50" />
          </button>
        </motion.div>

      </div>
    </div>
  )
}
