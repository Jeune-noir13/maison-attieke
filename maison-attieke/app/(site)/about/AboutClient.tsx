'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  MapPin, Phone, Mail, Clock, Instagram, Facebook,
  MessageCircle, Send, ChevronRight, Star, Utensils, Heart,
} from 'lucide-react'

interface Settings {
  siteName?: string; slogan?: string; telephone?: string
  adresse?: string; email?: string; ouvertureHeure?: string
  fermetureHeure?: string; logoUrl?: string | null; logoText?: string
  aboutDescription?: string; aboutHistoire?: string
  facebook?: string; instagram?: string; whatsapp?: string
  googleMapsUrl?: string
}

export default function AboutClient({ settings: s }: { settings: Settings | null }) {
  const [formData, setFormData] = useState({ nom: '', email: '', message: '' })
  const [sent,     setSent]     = useState(false)

  const siteName  = s?.siteName  ?? "La Maison de l'Attiéké"
  const tel       = s?.telephone ?? '+225 07 07 07 07 07'
  const adresse   = s?.adresse   ?? 'Cocody, Abidjan – Côte d\'Ivoire'
  const email     = s?.email     ?? 'contact@maison-attieke.ci'
  const ouv       = s?.ouvertureHeure ?? '10:00'
  const ferm      = s?.fermetureHeure ?? '23:00'
  const desc      = s?.aboutDescription ?? "La Maison de l'Attiéké est un restaurant ivoirien passionné par les saveurs authentiques."
  const histoire  = s?.aboutHistoire   ?? "Fondée à Cocody, notre cuisine s'inspire des recettes traditionnelles transmises de génération en génération."
  const waNumber  = (s?.whatsapp ?? tel).replace(/\s+/g, '')
  const waUrl     = `https://wa.me/${waNumber.startsWith('+') ? waNumber.slice(1) : waNumber}`
  const mapsUrl   = s?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresse)}`

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
    } catch {}
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {s?.logoUrl ? (
              <img src={s.logoUrl} alt="logo" className="w-20 h-20 mx-auto rounded-2xl object-cover mb-6 shadow-xl" />
            ) : (
              <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center text-black font-black text-3xl mx-auto mb-6 shadow-xl shadow-orange-500/30">
                {s?.logoText ?? 'M'}
              </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">{siteName}</h1>
            <p className="text-orange-400 text-lg font-medium mb-6 italic">{s?.slogan ?? ''}</p>
            <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">{desc}</p>
          </motion.div>
        </div>
      </section>

      {/* ── NOTRE HISTOIRE ────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Notre histoire</span>
              <h2 className="text-white font-black text-3xl mt-2 mb-5">Une cuisine qui<br /><span className="text-orange-400">vient du cœur</span></h2>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{histoire}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Utensils, val: '30+', label: 'Plats au menu'         },
                { icon: Star,     val: '4.8', label: 'Note moyenne'          },
                { icon: Heart,    val: '7j/7', label: 'Ouvert toute la semaine' },
                { icon: MapPin,   val: '45min', label: 'Livraison rapide'    },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-5 text-center">
                  <Icon size={22} className="text-orange-500 mx-auto mb-2" />
                  <div className="text-white font-black text-2xl">{val}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT INFO + FORMULAIRE ─────────────────────────── */}
      <section className="py-16 px-4 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Nous contacter</span>
            <h2 className="text-white font-black text-3xl mt-2">Prenez contact avec nous</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Infos */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="space-y-4">
              {[
                { icon: Phone,   label: 'Téléphone', val: tel,     href: `tel:${tel.replace(/\s/g,'')}` },
                { icon: Mail,    label: 'Email',     val: email,   href: `mailto:${email}` },
                { icon: MapPin,  label: 'Adresse',   val: adresse, href: mapsUrl },
                { icon: Clock,   label: 'Horaires',  val: `Lun–Dim  ${ouv} – ${ferm}`, href: null },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-orange-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 text-xs">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="text-white font-medium text-sm hover:text-orange-400 transition-colors truncate block">
                        {val}
                      </a>
                    ) : (
                      <p className="text-white font-medium text-sm">{val}</p>
                    )}
                  </div>
                  {href && <ChevronRight size={14} className="text-gray-700 shrink-0" />}
                </div>
              ))}

              {/* Réseaux sociaux */}
              <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-4">
                <p className="text-gray-500 text-xs mb-3">Réseaux sociaux</p>
                <div className="flex gap-3">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25d366]/10 border border-[#25d366]/30 hover:bg-[#25d366]/20 text-[#25d366] py-2.5 rounded-xl text-sm font-semibold transition-colors">
                    <MessageCircle size={16} />WhatsApp
                  </a>
                  {s?.instagram && (
                    <a href={s.instagram} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 text-pink-400 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                      <Instagram size={16} />Instagram
                    </a>
                  )}
                  {s?.facebook && (
                    <a href={s.facebook} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                      <Facebook size={16} />Facebook
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Formulaire */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6">
              {sent ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-8">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Send size={28} className="text-green-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg">Message envoyé !</h3>
                  <p className="text-gray-400 text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-white font-bold text-lg mb-5">Envoyer un message</h3>
                  <form onSubmit={handleContact} className="space-y-4">
                    <input
                      value={formData.nom}
                      onChange={e => setFormData(f => ({ ...f, nom: e.target.value }))}
                      placeholder="Votre nom"
                      required
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-orange-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors"
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                      placeholder="Votre email"
                      required
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-orange-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors"
                    />
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                      placeholder="Votre message…"
                      required
                      rows={4}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] focus:border-orange-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none text-sm transition-colors resize-none"
                    />
                    <button type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-all flex items-center justify-center gap-2">
                      <Send size={15} />Envoyer le message
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CARTE GOOGLE MAPS ─────────────────────────────────── */}
      {mapsUrl && (
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-[#1f1f1f]">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-orange-500" />
                  <span className="text-white font-semibold text-sm">Nous trouver</span>
                </div>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="text-orange-400 text-xs hover:underline flex items-center gap-1">
                  Ouvrir dans Maps <ChevronRight size={12} />
                </a>
              </div>
              <div className="h-64 bg-[#0d0d0d] flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={40} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">{adresse}</p>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-full text-sm transition-colors">
                    Voir sur Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA COMMANDER ────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-4xl mb-4">🍽️</p>
            <h2 className="text-white font-black text-2xl mb-3">Prêt à commander ?</h2>
            <p className="text-gray-400 text-sm mb-6">Découvrez nos plats ivoiriens authentiques et faites-vous livrer en moins de 45 min.</p>
            <Link href="/menu"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-full text-base tracking-wide transition-all shadow-lg shadow-orange-500/30 active:scale-95">
              Voir le menu
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
