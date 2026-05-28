'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Fallback food photo if no local hero-bg.jpg is uploaded yet
const FALLBACK = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=85'

export default function Hero() {
  const [bgReady, setBgReady] = useState(false)
  const [bgUrl,   setBgUrl]   = useState(FALLBACK)

  useEffect(() => {
    // Try local file first — if it 404s, keep the Unsplash fallback
    const img = new window.Image()
    img.onload  = () => { setBgUrl('/hero-bg.jpg'); setBgReady(true) }
    img.onerror = () => { setBgUrl(FALLBACK);       setBgReady(true) }
    img.src = '/hero-bg.jpg'
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background photo */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${bgReady ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: `url('${bgUrl}')` }}
      />

      {/* Dark gradient: solid black left → transparent right */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10" />
      {/* Slight overall dim so text stays readable */}
      <div className="absolute inset-0 bg-black/30" />
      {/* Bottom fade into page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none mb-1 tracking-tight drop-shadow-lg"
          >
            L'ATTIÉKÉ
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none mb-1 tracking-tight drop-shadow-lg"
          >
            COMME VOUS NE L'AVEZ
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-orange-500 leading-none mb-8 tracking-tight drop-shadow-lg"
          >
            JAMAIS GOÛTÉ.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-gray-200 text-base sm:text-lg mb-8 max-w-md leading-relaxed drop-shadow"
          >
            Composez votre plat comme vous voulez,<br />
            selon votre budget, vos envies et votre faim.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/composer"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full text-sm sm:text-base tracking-wide transition-all duration-200 active:scale-95 shadow-lg shadow-orange-500/40"
            >
              COMPOSER MA COMMANDE
            </Link>
            <Link
              href="/menu"
              className="border border-white/50 hover:border-white text-white font-bold px-8 py-3.5 rounded-full text-sm sm:text-base tracking-wide transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
            >
              VOIR LE MENU
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
