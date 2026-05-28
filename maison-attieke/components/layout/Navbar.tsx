'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/lib/store'
import { ShoppingCart, Menu, X, User, LogOut, ChevronDown, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/menu', label: 'Menu' },
  { href: '/composer', label: 'Composer ma commande' },
  { href: '/boissons', label: 'Boissons' },
  { href: '/sucreries', label: 'Sucreries' },
  { href: '/about', label: 'À propos' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const { count, toggleCart } = useCart()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [userOpen,    setUserOpen]    = useState(false)
  const [siteLogoUrl, setSiteLogoUrl] = useState<string | null>(null)
  const [siteName,    setSiteName]    = useState("Maison de l'Attiéké")
  const [userImage,   setUserImage]   = useState<string | null>(null)
  const [mounted,     setMounted]     = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)

    // Load dynamic logo from settings
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.logoUrl) setSiteLogoUrl(d.logoUrl)
      if (d.siteName) setSiteName(d.siteName)
    }).catch(() => {})
    // Load user profile image
    fetch('/api/utilisateur').then(async r => {
      if (!r.ok) return
      const t = await r.text()
      try { const d = JSON.parse(t); if (d.image) setUserImage(d.image) } catch {}
    }).catch(() => {})

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg shadow-black/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-black text-lg overflow-hidden shrink-0">
              {siteLogoUrl
                ? <img src={siteLogoUrl} alt="logo" className="w-full h-full object-cover" />
                : <span>{siteName?.charAt(0) ?? 'M'}</span>
              }
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-tight">{siteName?.split(' ')[0] ?? 'Maison'}</div>
              <div className="text-orange-500 font-bold text-sm leading-tight">{siteName?.split(' ').slice(1).join(' ') || 'Attiéké'}</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-gray-300 hover:text-orange-400 text-sm font-medium transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link href="/menu" className="p-2 text-gray-300 hover:text-white transition-colors hidden sm:block">
              <Search size={20} />
            </Link>

            <button onClick={toggleCart} className="relative p-2 text-gray-300 hover:text-orange-400 transition-colors">
              <ShoppingCart size={22} />
              {mounted && count() > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-orange-500 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {count()}
                </motion.span>
              )}
            </button>

            {mounted && session ? (
              <div className="relative">
                <button onClick={() => setUserOpen(!userOpen)} className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-full px-3 py-1.5 text-sm text-white hover:border-orange-500/50 transition-colors">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-orange-500 shrink-0">
                    {userImage
                      ? <img src={userImage + '?t=' + Math.floor(Date.now() / 60000)} alt="" className="w-full h-full object-cover" />
                      : <span className="text-black font-bold text-xs">{session.user?.name?.charAt(0)}</span>
                    }
                  </div>
                  <span className="hidden sm:block max-w-[100px] truncate">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-[#141414] border border-[#2a2a2a] rounded-xl shadow-xl overflow-hidden"
                    >
                      <Link href="/compte" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-[#1f1f1f] hover:text-white transition-colors">
                        <User size={15} /> Mon compte
                      </Link>
                      <Link href="/compte/commandes" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-[#1f1f1f] hover:text-white transition-colors">
                        <ShoppingCart size={15} /> Mes commandes
                      </Link>
                      <div className="border-t border-[#2a2a2a]" />
                      <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                        <LogOut size={15} /> Déconnexion
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : mounted ? (
              <Link href="/auth/connexion" className="btn-primary text-sm py-2 px-5 hidden sm:inline-flex">
                Se connecter
              </Link>
            ) : null}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-300">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/98 border-t border-[#1f1f1f]"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                  className="text-gray-300 hover:text-orange-400 py-3 px-2 text-base font-medium border-b border-[#1f1f1f] last:border-0 transition-colors">
                  {link.label}
                </Link>
              ))}
              {!session && (
                <Link href="/auth/connexion" onClick={() => setMobileOpen(false)} className="btn-primary mt-3 text-center">
                  Se connecter
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
