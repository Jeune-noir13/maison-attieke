'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag, Truck,
  Users, Settings, LogOut, Menu, X, ChevronRight, Bell,
  Navigation, MessageSquare, Tag
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, badge: null },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag, badge: 'live' },
  { href: '/admin/menu', label: 'Menu & Produits', icon: UtensilsCrossed, badge: null },
  { href: '/admin/livreurs', label: 'Livreurs', icon: Truck, badge: null },
  { href: '/admin/livraisons', label: 'Livraisons actives', icon: Navigation, badge: 'live' },
  { href: '/admin/messages',   label: 'Messages clients',   icon: MessageSquare, badge: null },
  { href: '/admin/promotions', label: 'Promotions',          icon: Tag,           badge: null },
  { href: '/admin/clients', label: 'Clients', icon: Users, badge: null },
  { href: '/admin/site', label: 'Paramètres site', icon: Settings, badge: null },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [siteName, setSiteName] = useState("Maison de l'Attiéké")

  useEffect(() => {
    fetch('/api/admin/verify')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setAdmin(d.admin); setLoading(false) })
      .catch(() => router.replace('/portail-admin'))
    // Charger le logo dynamique
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.logoUrl) setLogoUrl(d.logoUrl)
      if (d.siteName) setSiteName(d.siteName)
    }).catch(() => {})
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/admin/verify', { method: 'DELETE' })
    router.replace('/portail-admin')
  }

  if (loading) return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Vérification des accès...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#070707] flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/70 z-30 lg:hidden" />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:relative top-0 left-0 h-full z-40 w-64 bg-[#0a0a0a] border-r border-[#151515] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-[#151515]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center font-black text-black text-base overflow-hidden shrink-0">
              {logoUrl
                ? <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
                : <span>{siteName?.charAt(0) ?? 'M'}</span>
              }
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">{siteName?.split("'")[0] || 'Maison'}</div>
              <div className="text-orange-500/60 text-xs">Administration</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-gray-600"><X size={18} /></button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-gray-700 text-[10px] uppercase tracking-widest font-bold px-3 mb-3">Navigation</p>
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 relative ${active ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-gray-500 hover:text-gray-200 hover:bg-white/4'}`}>
                <Icon size={16} className={active ? 'text-orange-400' : 'text-gray-600 group-hover:text-gray-300'} />
                <span className="flex-1 font-medium">{label}</span>
                {badge === 'live' && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                {active && <ChevronRight size={14} className="text-orange-400/50" />}
              </Link>
            )
          })}
        </nav>

        {/* Admin profile */}
        <div className="p-4 border-t border-[#151515]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-black font-bold text-sm">
              {admin?.nom?.charAt(0) ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{admin?.nom}</div>
              <div className="text-gray-600 text-xs truncate">{admin?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-colors text-sm">
            <LogOut size={14} /><span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-[#111] bg-[#080808] flex items-center px-4 gap-4 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-white"><Menu size={20} /></button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span>Système actif</span>
          </div>
          <button className="w-8 h-8 rounded-lg bg-[#111] border border-[#1a1a1a] flex items-center justify-center text-gray-500 hover:text-white transition-colors">
            <Bell size={15} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
