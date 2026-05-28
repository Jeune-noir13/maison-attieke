'use client'
import { motion } from 'framer-motion'

const steps = [
  { icon: '🛵', title: 'Livraison rapide', desc: '30 – 45 minutes', detail: 'Suivi GPS en direct de votre livreur' },
  { icon: '💳', title: 'Paiement sécurisé', desc: 'Orange Money, Wave, MTN, Moov', detail: 'Ou paiement à la livraison' },
  { icon: '🎯', title: 'Suivi en direct', desc: 'Statut en temps réel', detail: 'Préparation → En route → Livré' },
  { icon: '⭐', title: 'Programme fidélité', desc: 'Gagnez des points', detail: 'Réductions et avantages exclusifs' },
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="tag-orange mb-3 inline-block">Nos engagements</span>
          <h2 className="section-title">Pourquoi choisir <span className="gradient-text">La Maison</span> ?</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map(({ icon, title, desc, detail }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, borderColor: 'rgba(249,115,22,0.4)' }}
              className="card-dark p-5 text-center transition-all duration-200"
            >
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="text-white font-bold mb-1 text-sm">{title}</h3>
              <p className="text-orange-400 text-xs font-medium mb-2">{desc}</p>
              <p className="text-gray-500 text-xs">{detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
