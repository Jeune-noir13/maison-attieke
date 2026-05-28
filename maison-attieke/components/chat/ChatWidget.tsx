'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Phone, Headphones, Loader2, Bot, User } from 'lucide-react'

/* ─── FAQ moteur ──────────────────────────────────────────────── */
const FAQ: { keywords: string[]; answer: string; links?: { label: string; href: string }[] }[] = [
  {
    keywords: ['livraison', 'délai', 'temps', 'attente', 'longtemps', 'combien de temps', 'rapide'],
    answer: '🛵 Nos livraisons prennent **30 à 45 minutes** selon votre zone. Suivez votre commande en temps réel depuis votre espace client.',
    links: [{ label: 'Voir mes commandes', href: '/compte/commandes' }],
  },
  {
    keywords: ['menu', 'plat', 'manger', 'commander', 'attiéké', 'nourriture', 'carte', 'boisson', 'sucrerie'],
    answer: '🍽️ Retrouvez tous nos plats, boissons et sucreries sur notre menu. Vous pouvez aussi **composer votre propre plat** !',
    links: [{ label: 'Voir le menu', href: '/menu' }, { label: 'Composer mon plat', href: '/composer' }],
  },
  {
    keywords: ['horaire', 'ouvert', 'fermé', 'heure', 'ouverture', 'fermeture', 'quand'],
    answer: '⏰ Nous sommes ouverts **tous les jours** de 10h à 23h. Commandez avant 22h30 pour être sûr d\'être servi.',
  },
  {
    keywords: ['paiement', 'payer', 'momo', 'wave', 'espèces', 'cash', 'carte', 'orange money', 'mtn'],
    answer: '💳 Nous acceptons :\n• **Mobile Money** (Orange, MTN, Wave)\n• **Espèces** à la livraison\n• **Carte bancaire**',
    links: [{ label: 'Voir les méthodes', href: '/compte/paiement' }],
  },
  {
    keywords: ['annuler', 'annulation', 'modifier', 'changer', 'erreur'],
    answer: '❌ Pour annuler ou modifier une commande, contactez-nous **le plus vite possible** après la commande. Après la mise en préparation, les modifications ne sont plus possibles.',
  },
  {
    keywords: ['adresse', 'livrer', 'zone', 'quartier', 'secteur', 'abidjan', 'quartier'],
    answer: '📍 Nous livrons dans **toute la zone d\'Abidjan**. Entrez votre adresse lors de la commande pour vérifier la couverture.',
  },
  {
    keywords: ['prix', 'tarif', 'combien', 'coût', 'frais', 'gratuit'],
    answer: '💰 Consultez nos prix sur la page Menu. Les **frais de livraison sont de 500 FCFA**. Livraison gratuite pour les commandes > 5 000 F.',
    links: [{ label: 'Voir les prix', href: '/menu' }],
  },
  {
    keywords: ['allergie', 'allergène', 'intolérance', 'régime', 'végétarien', 'sans', 'halal'],
    answer: '⚠️ Pour toute **allergie ou régime alimentaire** particulier, contactez-nous avant de commander afin que nous puissions adapter votre plat.',
  },
  {
    keywords: ['commande', 'suivi', 'statut', 'état', 'livraison', 'où en est', 'livreur'],
    answer: '📦 Suivez votre commande en temps réel depuis **Mes commandes** : carte interactive avec la position du livreur.',
    links: [{ label: 'Suivre ma commande', href: '/compte/commandes' }],
  },
  {
    keywords: ['compte', 'inscription', 'connexion', 'profil', 'créer', 's\'inscrire', 'se connecter'],
    answer: '👤 Créez votre compte gratuitement pour suivre vos commandes, accumuler des points et gérer vos adresses.',
    links: [{ label: 'S\'inscrire', href: '/auth/inscription' }, { label: 'Se connecter', href: '/auth/connexion' }],
  },
  {
    keywords: ['points', 'fidélité', 'réduction', 'bonus', 'avantage', 'programme'],
    answer: '⭐ Notre **programme fidélité** vous donne des points à chaque commande. Bronze, Silver, Gold, Platine — des avantages à chaque niveau !',
    links: [{ label: 'Mon programme fidélité', href: '/compte/fidelite' }],
  },
  {
    keywords: ['propos', 'restaurant', 'histoire', 'qui', 'contact', 'nous'],
    answer: '🏠 Maison de l\'Attiéké est un restaurant ivoirien passionné par les saveurs authentiques. Retrouvez notre histoire et nos coordonnées sur la page À propos.',
    links: [{ label: 'À propos', href: '/about' }],
  },
]

function getBotResponse(text: string) {
  const lower = text.toLowerCase()
  for (const faq of FAQ) {
    if (faq.keywords.some(k => lower.includes(k))) {
      return faq
    }
  }
  return null
}

function renderText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

/* ─── Session ID persistant ───────────────────────────────────── */
function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr'
  let id = localStorage.getItem('chat_sid')
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('chat_sid', id)
  }
  return id
}

interface Msg {
  role: 'user' | 'bot' | 'admin'
  content: string
  links?: { label: string; href: string }[]
  id: number
}

let _msgId = 0
const nextId = () => ++_msgId

/* ─── Composant principal ─────────────────────────────────────── */
export default function ChatWidget() {
  const [settings,   setSettings]   = useState<any>(null)
  const [open,       setOpen]       = useState(false)
  const [msgs,       setMsgs]       = useState<Msg[]>([])
  const [input,      setInput]      = useState('')
  const [typing,     setTyping]     = useState(false)
  const [escalated,  setEscalated]  = useState(false)
  const [convId,     setConvId]     = useState<string | null>(null)
  const [unread,     setUnread]     = useState(0)
  const [noAnswer,   setNoAnswer]   = useState(false) // bot n'a pas pu répondre
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  // Charger les settings depuis l'API publique
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(setSettings)
      .catch(() => {})
  }, [])

  // Message d'accueil
  useEffect(() => {
    setMsgs([{
      role: 'bot',
      content: '👋 Bonjour ! Je suis l\'assistant de **Maison de l\'Attiéké**.\nComment puis-je vous aider ?',
      id: nextId(),
    }])
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing, open])

  // Focus input quand le chat s'ouvre
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  // Poll réponses admin après escalade
  useEffect(() => {
    if (!escalated || !convId) return
    const sid = getSessionId()
    const poll = async () => {
      try {
        const r = await fetch(`/api/chat?sessionId=${sid}`)
        if (!r.ok) return
        const data = await r.json()
        const adminMsgs = (data.messages ?? []).filter((m: any) => m.expediteur === 'admin')
        if (!adminMsgs.length) return
        const last = adminMsgs[adminMsgs.length - 1]
        setMsgs(prev => {
          const exists = prev.some(m => m.role === 'admin' && m.content === last.contenu)
          if (exists) return prev
          if (!open) setUnread(u => u + 1)
          return [...prev, { role: 'admin', content: last.contenu, id: nextId() }]
        })
      } catch {}
    }
    pollRef.current = setInterval(poll, 5000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [escalated, convId, open])

  /* ── Envoyer un message ─────────────────────────────────────── */
  const send = useCallback(async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || typing) return
    setInput('')
    setNoAnswer(false)

    // Afficher le message utilisateur
    setMsgs(prev => [...prev, { role: 'user', content, id: nextId() }])

    // Sauvegarder en DB
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: getSessionId(), contenu: content }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.conversationId) setConvId(data.conversationId)
    } catch {}

    if (escalated) return // en mode humain, pas de réponse bot

    // Réponse bot avec délai naturel
    setTyping(true)
    await new Promise(r => setTimeout(r, 700 + Math.random() * 400))
    setTyping(false)

    const faq = getBotResponse(content)
    if (faq) {
      setMsgs(prev => [...prev, { role: 'bot', content: faq.answer, links: faq.links, id: nextId() }])
    } else {
      setNoAnswer(true)
      setMsgs(prev => [...prev, {
        role: 'bot',
        content: 'Je ne trouve pas de réponse précise à votre question 🤔\nVoulez-vous parler à un conseiller ou nous contacter directement ?',
        id: nextId(),
      }])
    }
  }, [input, typing, escalated])

  /* ── Escalade vers humain ───────────────────────────────────── */
  const escalade = async () => {
    setEscalated(true)
    setNoAnswer(false)
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: getSessionId(), action: 'escalade' }),
      })
    } catch {}
    setMsgs(prev => [...prev, {
      role: 'bot',
      content: '🔔 Votre demande a été transmise à notre équipe.\nUn conseiller va vous répondre sous peu. Vous pouvez aussi nous contacter directement ci-dessous.',
      id: nextId(),
    }])
  }

  if (settings && settings.chatActif === false) return null

  const waNumber = (settings?.supportWhatsapp || settings?.whatsapp || '').replace(/[\s+]/g, '')
  const tel      = settings?.supportTelephone || settings?.telephone || ''

  const quickReplies = ['Délai livraison', 'Voir le menu', 'Horaires', 'Paiement', 'Suivre commande']

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-3 pointer-events-none">

      {/* ── Fenêtre chat ─────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-auto w-[330px] sm:w-[370px] bg-[#0f0f0f] border border-[#252525] rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-3 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 bg-black/20 rounded-full flex items-center justify-center shrink-0">
                {escalated
                  ? <User size={17} className="text-white" />
                  : <Bot  size={17} className="text-white" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">Assistant Maison Attiéké</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${escalated ? 'bg-green-300 animate-pulse' : 'bg-white/60'}`} />
                  <p className="text-orange-100 text-xs">{escalated ? 'Conseiller disponible' : 'Bot · répond instantanément'}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors p-1">
                <X size={17} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0" style={{ maxHeight: 300 }}>
              {msgs.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role !== 'user' && (
                    <div className="w-7 h-7 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0">
                      {msg.role === 'admin'
                        ? <User size={13} className="text-orange-400" />
                        : <Bot  size={13} className="text-orange-400" />
                      }
                    </div>
                  )}
                  <div className="max-w-[78%] space-y-1.5">
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-orange-500 text-white rounded-br-sm'
                          : msg.role === 'admin'
                          ? 'bg-blue-500/15 border border-blue-500/25 text-blue-100 rounded-bl-sm'
                          : 'bg-[#1c1c1c] border border-[#2a2a2a] text-gray-200 rounded-bl-sm'
                      }`}
                      dangerouslySetInnerHTML={{ __html: renderText(msg.content) }}
                    />
                    {/* Liens de navigation du bot */}
                    {msg.links && msg.links.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pl-1">
                        {msg.links.map(link => (
                          <a key={link.href} href={link.href}
                            className="text-xs bg-orange-500/15 border border-orange-500/30 hover:bg-orange-500/25 text-orange-400 px-2.5 py-1 rounded-full transition-colors">
                            {link.label} →
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0">
                    <Bot size={13} className="text-orange-400" />
                  </div>
                  <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 bg-gray-500 rounded-full block"
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions rapides (premier message seulement) */}
            {!escalated && msgs.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0 bg-[#0f0f0f]">
                {quickReplies.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-xs bg-[#1c1c1c] border border-[#2a2a2a] hover:border-orange-500/40 text-gray-400 hover:text-white px-3 py-1.5 rounded-full transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Bouton escalade (après une non-réponse ou 4 messages) */}
            {!escalated && (noAnswer || msgs.filter(m => m.role === 'user').length >= 4) && (
              <div className="px-3 pb-2 shrink-0 bg-[#0f0f0f]">
                <button onClick={escalade}
                  className="w-full text-xs bg-[#1c1c1c] border border-orange-500/20 hover:border-orange-500/50 text-orange-400 hover:text-orange-300 px-3 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Headphones size={13} />Parler à un conseiller humain
                </button>
              </div>
            )}

            {/* Contacts directs */}
            {(waNumber || tel) && (
              <div className="px-3 pb-2 flex gap-2 shrink-0 bg-[#0f0f0f]">
                {waNumber && (
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-[#25d366]/10 border border-[#25d366]/25 hover:bg-[#25d366]/20 text-[#25d366] py-2 rounded-xl transition-colors font-medium">
                    💬 WhatsApp
                  </a>
                )}
                {tel && (
                  <a href={`tel:${tel.replace(/\s/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 text-blue-400 py-2 rounded-xl transition-colors font-medium">
                    <Phone size={11} />Appeler
                  </a>
                )}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-[#1a1a1a] bg-[#0f0f0f] flex gap-2 shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder={escalated ? 'Votre message au conseiller…' : 'Posez votre question…'}
                className="flex-1 bg-[#1c1c1c] border border-[#2a2a2a] focus:border-orange-500/50 rounded-xl px-3 py-2.5 text-white placeholder-gray-600 outline-none text-xs transition-colors"
              />
              <button
                onClick={() => send()}
                disabled={typing || !input.trim()}
                className="w-9 h-9 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors shrink-0"
              >
                {typing
                  ? <Loader2 size={14} className="text-black animate-spin" />
                  : <Send size={14} className="text-black" />
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bouton flottant ──────────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => { setOpen(v => !v); setUnread(0) }}
        className="pointer-events-auto relative w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-xl shadow-orange-500/30 flex items-center justify-center transition-colors"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.15 }}><X             size={22} className="text-black" /></motion.div>
            : <motion.div key="msg"  initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MessageCircle size={22} className="text-black" /></motion.div>
          }
        </AnimatePresence>
        {unread > 0 && !open && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-black flex items-center justify-center border-2 border-[#0a0a0a]"
          >
            {unread}
          </motion.span>
        )}
      </motion.button>
    </div>
  )
}
