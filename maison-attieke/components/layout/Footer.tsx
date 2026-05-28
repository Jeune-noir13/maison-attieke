'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Clock, MessageCircle } from 'lucide-react'

export default function Footer() {
  const [s, setS] = useState<any>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setS)
      .catch(() => {})
  }, [])

  const siteName  = s?.siteName  ?? "Maison de l'Attiéké"
  const slogan    = s?.slogan    ?? 'Le vrai goût ivoirien'
  const telephone = s?.telephone ?? '+225 07 07 07 07 07'
  const adresse   = s?.adresse   ?? "Cocody, Abidjan – Côte d'Ivoire"
  const email     = s?.email     ?? 'contact@maison-attieke.ci'
  const ouv       = s?.ouvertureHeure ?? '10:00'
  const ferm      = s?.fermetureHeure ?? '23:00'
  const waNumber  = (s?.whatsapp ?? '').replace(/\s+/g, '').replace('+', '')

  return (
    <footer className="bg-[#0D0D0D] border-t border-[#1f1f1f] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* ── Brand ──────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                {s?.logoUrl
                  ? <img src={s.logoUrl} alt="logo" className="w-full h-full object-cover" />
                  : <span className="font-black text-black text-lg">{siteName.charAt(0)}</span>
                }
              </div>
              <div>
                <div className="text-white font-bold leading-tight">{siteName}</div>
                <div className="text-orange-500 text-xs leading-tight">{slogan}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Des recettes authentiques, des ingrédients frais, et une passion pour le vrai goût ivoirien.
            </p>
            <div className="flex gap-3 mt-4">
              {s?.facebook && (
                <a href={s.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#1f1f1f] hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors text-gray-400 hover:text-black">
                  <Facebook size={14} />
                </a>
              )}
              {s?.instagram && (
                <a href={s.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#1f1f1f] hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors text-gray-400 hover:text-black">
                  <Instagram size={14} />
                </a>
              )}
              {waNumber && (
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-[#1f1f1f] hover:bg-[#25d366] rounded-full flex items-center justify-center transition-colors text-gray-400 hover:text-white">
                  <MessageCircle size={14} />
                </a>
              )}
              {/* Fallback si pas de réseaux configurés */}
              {!s?.facebook && !s?.instagram && !waNumber && (
                <>
                  <div className="w-8 h-8 bg-[#1f1f1f] rounded-full flex items-center justify-center text-gray-700"><Facebook size={14} /></div>
                  <div className="w-8 h-8 bg-[#1f1f1f] rounded-full flex items-center justify-center text-gray-700"><Instagram size={14} /></div>
                </>
              )}
            </div>
          </div>

          {/* ── Navigation ──────────────────────────────── */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {[
                ['/', 'Accueil'],
                ['/menu', 'Notre Menu'],
                ['/composer', 'Composer ma commande'],
                ['/boissons', 'Boissons'],
                ['/sucreries', 'Sucreries'],
                ['/about', 'À propos'],
              ].map(([href, label]) => (
                <li key={label}>
                  <Link href={href} className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Horaires ────────────────────────────────── */}
          <div>
            <h3 className="text-white font-semibold mb-4">Horaires</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={14} className="text-orange-500 shrink-0" />
                <span>Lun – Dim : {ouv} – {ferm}</span>
              </div>
              <div className="mt-3 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                <span className="text-green-400 text-xs font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Ouvert tous les jours – Livraison active
                </span>
              </div>
            </div>
          </div>

          {/* ── Contact ─────────────────────────────────── */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin size={14} className="text-orange-500 mt-0.5 shrink-0" />
                <span>{adresse}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={14} className="text-orange-500 shrink-0" />
                <a href={`tel:${telephone.replace(/\s/g, '')}`} className="hover:text-orange-400 transition-colors">{telephone}</a>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} className="text-orange-500 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-orange-400 transition-colors truncate">{email}</a>
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Paiement :</span>
              {['Wave', 'Orange', 'MTN', 'Cash'].map(p => (
                <span key={p} className="text-xs text-gray-400 bg-[#1f1f1f] px-2 py-0.5 rounded">{p}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#1f1f1f] pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} {siteName}. Tous droits réservés.</p>
          <p className="text-gray-500 text-xs">Fait avec ❤️ en Côte d'Ivoire</p>
        </div>
      </div>
    </footer>
  )
}
