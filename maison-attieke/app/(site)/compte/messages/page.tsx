'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Send, Clock } from 'lucide-react'

export default function MessagesPage() {
  const { status } = useSession()
  const router     = useRouter()
  const [messages, setMessages] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/auth/connexion'); return }
    if (status !== 'authenticated') return
    fetch('/api/contact/mes-messages')
      .then(async r => {
        if (!r.ok) return []
        const text = await r.text()
        if (!text) return []
        try { return JSON.parse(text) } catch { return [] }
      })
      .then(d => { setMessages(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [status, router])

  if (status === 'loading' || loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 py-5">
          <Link href="/compte" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-white font-black text-lg">Mes messages</h1>
        </div>

        {messages.length === 0 ? (
          <div className="bg-[#111] rounded-2xl border border-[#1f1f1f] p-12 text-center">
            <MessageSquare size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Aucun message</p>
            <p className="text-gray-700 text-sm mt-1">Vos messages envoyés depuis la page À propos apparaîtront ici</p>
            <Link href="/about" className="mt-4 inline-block text-orange-400 text-sm hover:underline">
              Envoyer un message →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className="bg-[#111] rounded-2xl border border-[#1f1f1f] overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                      <Send size={14} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">Votre message</p>
                      <p className="text-gray-600 text-xs flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm bg-[#1a1a1a] rounded-xl px-4 py-3">{msg.message}</p>
                </div>

                {msg.reponse && (
                  <div className="px-4 pb-4">
                    <div className="border-t border-[#1a1a1a] pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-black font-black text-xs">M</div>
                        <p className="text-orange-400 text-sm font-medium">Réponse de l'équipe</p>
                      </div>
                      <p className="text-gray-200 text-sm bg-orange-500/5 border border-orange-500/20 rounded-xl px-4 py-3 leading-relaxed">
                        {msg.reponse}
                      </p>
                    </div>
                  </div>
                )}

                {!msg.reponse && (
                  <div className="px-4 pb-3">
                    <span className="text-xs text-gray-600 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                      En attente de réponse
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
