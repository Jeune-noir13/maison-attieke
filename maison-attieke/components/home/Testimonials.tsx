'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function Testimonials() {
  const [avis, setAvis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/avis')
      .then(r => r.json())
      .then(d => { setAvis(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 bg-[#111] rounded-2xl animate-pulse border border-[#1a1a1a]" />
        ))}
      </div>
    </section>
  )

  if (avis.length === 0) return null   // hide section if no real reviews yet

  const avg = (avis.reduce((s, a) => s + a.noteCommande, 0) / avis.length).toFixed(1)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-center mb-10">
        <span className="tag-orange mb-3 inline-block">Ils nous font confiance</span>
        <h2 className="section-title">Ce que disent nos <span className="gradient-text">clients</span></h2>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}</div>
          <span className="text-white font-bold">{avg}/5</span>
          <span className="text-gray-400 text-sm">• {avis.length} avis vérifiés</span>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {avis.slice(0, 6).map((a, i) => {
          const name = `${a.user?.prenoms ?? ''} ${a.user?.nom ?? ''}`.trim() || 'Client'
          const initiale = name.charAt(0).toUpperCase()
          return (
            <motion.div key={a.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="card-dark p-5 hover:border-orange-500/20 transition-colors">
              <div className="flex mb-2">
                {[...Array(a.noteCommande)].map((_, j) => <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              {a.commentaire ? (
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{a.commentaire}"</p>
              ) : (
                <p className="text-gray-600 text-sm italic mb-4">Commande appréciée ✓</p>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {initiale}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">{name}</div>
                  {a.user?.lieuHabitation && <div className="text-gray-500 text-xs">{a.user.lieuHabitation}</div>}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
