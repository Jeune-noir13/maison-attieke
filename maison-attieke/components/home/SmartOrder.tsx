'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { PenLine, Wallet, ArrowRight } from 'lucide-react'

export default function SmartOrder() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span className="tag-orange mb-3 inline-block">✨ Nouveau</span>
        <h2 className="section-title mb-3">Commandez à votre façon</h2>
        <p className="text-gray-400 max-w-lg mx-auto">Écrivez ce que vous voulez, on s'occupe du reste. Selon votre budget, vos envies et votre faim.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free text order */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card-dark p-6 hover:border-orange-500/30 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
              <PenLine size={22} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Commande libre</h3>
              <p className="text-gray-500 text-sm">Écrivez votre commande comme vous voulez</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4 border border-[#2a2a2a] font-mono text-sm">
            <p className="text-gray-300">Attiéké 300f</p>
            <p className="text-gray-300">Poulet braisé 2000f</p>
            <p className="text-gray-300">Alloco 500f</p>
            <p className="text-gray-300">Poisson 1500f</p>
            <p className="text-orange-400 mt-2 font-bold">→ Total : 4 300 FCFA ✓</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Attiéké 300f', 'Poulet 2000f', 'Alloco 500f', 'Coca 500f'].map(s => (
              <span key={s} className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 px-2 py-1 rounded-full">{s}</span>
            ))}
          </div>
          <Link href="/composer" className="btn-primary flex items-center justify-center gap-2 w-full">
            Composer ma commande <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Budget order */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="card-dark p-6 hover:border-orange-500/30 transition-colors group"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
              <Wallet size={22} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">J'ai un budget</h3>
              <p className="text-gray-500 text-sm">Dites-nous combien vous avez</p>
            </div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-4 border border-[#2a2a2a]">
            <p className="text-gray-500 text-sm mb-2">Votre budget :</p>
            <p className="text-3xl font-black text-white">3 500 <span className="text-orange-400 text-xl">FCFA</span></p>
            <div className="mt-3 border-t border-[#2a2a2a] pt-3 space-y-1">
              <p className="text-gray-300 text-sm">✓ Attiéké moyen</p>
              <p className="text-gray-300 text-sm">✓ Poulet braisé 1 morceau</p>
              <p className="text-gray-300 text-sm">✓ Alloco</p>
              <p className="text-gray-300 text-sm">✓ Eau minérale</p>
              <p className="text-orange-400 font-bold text-sm mt-2">= 3 500 FCFA exactement 🎯</p>
            </div>
          </div>
          <Link href="/composer?mode=budget" className="btn-outline flex items-center justify-center gap-2 w-full">
            Définir mon budget <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 card-dark p-6"
      >
        <h3 className="text-white font-bold mb-4 text-center">Comment ça marche ?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: '1', icon: '✍️', text: 'Écrivez votre commande' },
            { step: '2', icon: '🤖', text: 'Nous analysons et calculons le total' },
            { step: '3', icon: '👨‍🍳', text: 'Nous préparons votre plat' },
            { step: '4', icon: '🛵', text: 'Votre livreur vous l\'apporte' },
          ].map(({ step, icon, text }) => (
            <div key={step} className="text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-orange-500 font-bold text-xs mb-1">Étape {step}</div>
              <div className="text-gray-400 text-xs">{text}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
