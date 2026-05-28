'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MailOpen, Send, Clock, User, ChevronRight, MessageSquare, Loader2, CheckCircle } from 'lucide-react'

export default function AdminMessagesPage() {
  const [messages, setMessages]   = useState<any[]>([])
  const [selected, setSelected]   = useState<any>(null)
  const [reponse,  setReponse]    = useState('')
  const [sending,  setSending]    = useState(false)
  const [saved,    setSaved]      = useState(false)
  const [loading,  setLoading]    = useState(true)

  const load = () => {
    fetch('/api/contact')
      .then(async r => {
        if (!r.ok) return []
        const text = await r.text()
        if (!text) return []
        try { return JSON.parse(text) } catch { return [] }
      })
      .then(d => { setMessages(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleReply = async () => {
    if (!reponse.trim() || !selected) return
    setSending(true)
    await fetch('/api/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, reponse: reponse.trim() })
    })
    setSending(false)
    setSaved(true)
    setSelected((s: any) => ({ ...s, reponse: reponse.trim(), lu: true }))
    setMessages(msgs => msgs.map(m => m.id === selected.id ? { ...m, reponse: reponse.trim(), lu: true } : m))
    setTimeout(() => setSaved(false), 2500)
  }

  const nonLus = messages.filter(m => !m.lu).length

  return (
    <div className="space-y-4 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-orange-400" />
            Messages clients
            {nonLus > 0 && (
              <span className="bg-orange-500 text-black text-xs font-black px-2 py-0.5 rounded-full">{nonLus}</span>
            )}
          </h1>
          <p className="text-gray-600 text-sm">Répondez aux messages envoyés via la page À propos</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-4 h-[calc(100vh-180px)]">
        {/* Liste des messages */}
        <div className="lg:col-span-2 bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-[#141414] bg-[#0a0a0a]">
            <p className="text-gray-400 text-xs">{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
          </div>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-700">
              <Mail size={32} />
              <p className="text-sm">Aucun message</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-[#111]">
              {messages.map(msg => (
                <button key={msg.id} onClick={() => { setSelected(msg); setReponse(msg.reponse || '') }}
                  className={`w-full text-left px-4 py-3 hover:bg-[#111] transition-colors ${selected?.id === msg.id ? 'bg-[#111] border-l-2 border-orange-500' : ''}`}>
                  <div className="flex items-start gap-2.5">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!msg.lu ? 'bg-orange-500' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${!msg.lu ? 'text-white' : 'text-gray-400'}`}>{msg.nom}</p>
                        <span className="text-gray-700 text-xs shrink-0 ml-1">
                          {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs truncate mt-0.5">{msg.message}</p>
                      {msg.reponse && (
                        <span className="text-green-500 text-xs">✓ Répondu</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détail + réponse */}
        <div className="lg:col-span-3 bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-700">
              <MailOpen size={40} />
              <p className="text-sm">Sélectionnez un message</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[#141414] bg-[#0a0a0a]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center shrink-0">
                    <User size={18} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{selected.nom}</p>
                    <p className="text-gray-500 text-xs">{selected.email}</p>
                    <p className="text-gray-700 text-xs mt-0.5 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(selected.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fil de messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Message client */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-white text-sm leading-relaxed">{selected.message}</p>
                  </div>
                </div>

                {/* Réponse existante */}
                {selected.reponse && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-orange-500/10 border border-orange-500/20 rounded-2xl rounded-tr-sm px-4 py-3">
                      <p className="text-orange-100 text-sm leading-relaxed">{selected.reponse}</p>
                      <p className="text-orange-500/60 text-xs mt-1">Vous</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Zone de réponse */}
              <div className="p-4 border-t border-[#141414] bg-[#0a0a0a]">
                <div className="flex gap-2">
                  <textarea
                    value={reponse}
                    onChange={e => setReponse(e.target.value)}
                    placeholder="Écrivez votre réponse…"
                    rows={2}
                    className="flex-1 bg-[#141414] border border-[#2a2a2a] focus:border-orange-500/40 rounded-xl px-4 py-2.5 text-white placeholder-gray-700 outline-none text-sm resize-none transition-colors"
                  />
                  <button onClick={handleReply} disabled={sending || !reponse.trim()}
                    className="self-end w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 rounded-xl flex items-center justify-center transition-colors shrink-0">
                    {sending ? <Loader2 size={16} className="text-black animate-spin" />
                      : saved ? <CheckCircle size={16} className="text-black" />
                      : <Send size={16} className="text-black" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
