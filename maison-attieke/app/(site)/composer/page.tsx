'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useCart } from '@/lib/store'
import { PenLine, Wallet, Mic, Loader2, Plus, CheckCircle, ArrowRight } from 'lucide-react'

const SUGGESTIONS = ['Attiéké 300f', 'Poulet 2000f', 'Alloco 500f', 'Poisson 1500f', 'Coca 500f', 'Sauce 200f', 'Eau 300f', 'Escargots 5000f']

interface ParsedItem { nom: string; prix: number }
interface BudgetResult { items: any[]; total: number; budget: number; reste: number }

export default function ComposerPage() {
  const [mode, setMode] = useState<'libre' | 'budget'>('libre')
  const [text, setText] = useState('')
  const [budget, setBudget] = useState('')
  const [loading, setLoading] = useState(false)
  const [parsed, setParsed] = useState<ParsedItem[] | null>(null)
  const [budgetResult, setBudgetResult] = useState<BudgetResult | null>(null)
  const { addItem, toggleCart } = useCart()

  // Simple text parser – matches "Produit Xf" or "Produit X FCFA"
  const parseText = (input: string): ParsedItem[] => {
    const lines = input.split('\n').filter(Boolean)
    return lines.map((line) => {
      const match = line.match(/(.+?)\s+(\d+)\s*f?(?:cfa)?/i)
      if (match) return { nom: match[1].trim(), prix: parseInt(match[2]) }
      return { nom: line.trim(), prix: 0 }
    }).filter((i) => i.nom)
  }

  const handleAnalyze = () => {
    setLoading(true)
    setTimeout(() => {
      const items = parseText(text)
      setParsed(items)
      setLoading(false)
    }, 800)
  }

  const handleBudget = async () => {
    if (!budget || isNaN(Number(budget))) return
    setLoading(true)
    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ budget: Number(budget) }),
    })
    const data = await res.json()
    setBudgetResult(data)
    setLoading(false)
  }

  const addParsedToCart = () => {
    parsed?.forEach((item, i) => {
      if (item.prix > 0) {
        addItem({ id: `composed-${i}`, nom: item.nom, prix: item.prix, categorie: 'COMPOSE' })
      }
    })
    toggleCart()
  }

  const addBudgetToCart = () => {
    budgetResult?.items.forEach((item) => {
      addItem({ id: item.id, nom: item.nom, prix: item.prix, image: item.image, categorie: item.categorie })
    })
    toggleCart()
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Composer ma <span className="gradient-text">commande</span></h1>
          <p className="text-gray-400 mb-8">Écrivez votre commande comme vous le désirez !</p>
        </motion.div>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-6 bg-[#141414] p-1 rounded-full w-fit">
          {[
            { value: 'libre', label: 'Commande libre', icon: PenLine },
            { value: 'budget', label: "J'ai un budget", icon: Wallet },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setMode(value as any)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${mode === value ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <Icon size={14} />{label}
            </button>
          ))}
          <span className="flex items-center gap-1 px-3 py-2 text-xs text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20">
            <Mic size={12} />Commande vocale <span className="text-purple-300 font-bold">BIENTÔT</span>
          </span>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'libre' ? (
            <motion.div key="libre" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-dark p-6">
                  <h2 className="text-white font-bold mb-1">Écrivez votre commande</h2>
                  <p className="text-gray-500 text-sm mb-4">Exemples : "Attiéké 300f", "Poulet 2000f"</p>
                  <textarea
                    value={text}
                    onChange={(e) => { setText(e.target.value); setParsed(null) }}
                    placeholder={"Attiéké 300f\nPoulet braisé 2000f\nAlloco 500f\nPoisson 1500f"}
                    rows={6}
                    maxLength={500}
                    className="input-dark resize-none w-full mb-2 font-mono text-sm"
                  />
                  <div className="flex justify-between items-center text-xs text-gray-600 mb-4">
                    <span>{text.length}/500</span>
                    <button onClick={() => setText('')} className="text-gray-500 hover:text-white">Effacer</button>
                  </div>

                  <p className="text-gray-500 text-xs mb-2">Suggestions rapides :</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => setText((t) => t ? t + '\n' + s : s)} className="text-xs bg-[#2a2a2a] hover:bg-orange-500/20 hover:text-orange-300 text-gray-400 px-2 py-1 rounded-full transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>

                  <button onClick={handleAnalyze} disabled={!text.trim() || loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <><Loader2 size={16} className="animate-spin" />Analyse...</> : '🔍 ANALYSER MA COMMANDE'}
                  </button>
                </div>

                {/* Result */}
                <div className="card-dark p-6">
                  <h2 className="text-white font-bold mb-4">Votre commande</h2>
                  {!parsed ? (
                    <div className="text-center text-gray-500 py-12">
                      <div className="text-4xl mb-3">🍽️</div>
                      <p className="text-sm">Écrivez votre commande et cliquez sur Analyser</p>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                        <CheckCircle size={16} />Commande analysée avec succès
                      </div>
                      <div className="space-y-2 mb-4">
                        {parsed.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle size={14} className="text-green-400" />
                              <span className="text-white">{item.nom}</span>
                            </div>
                            {item.prix > 0 && <span className="text-orange-400 font-bold">{item.prix.toLocaleString()} FCFA</span>}
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[#2a2a2a] pt-3 mb-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>Sous-total</span>
                          <span className="text-white">{parsed.reduce((s, i) => s + i.prix, 0).toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>Livraison</span><span className="text-white">1 000 FCFA</span>
                        </div>
                        <div className="flex justify-between font-bold text-white">
                          <span>Total</span>
                          <span className="text-orange-400">{(parsed.reduce((s, i) => s + i.prix, 0) + 1000).toLocaleString()} FCFA</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">Les portions sont adaptées aux montants indiqués</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={addParsedToCart} className="btn-primary flex-1 flex items-center justify-center gap-1 text-sm">
                          <Plus size={14} />Ajouter au panier
                        </button>
                        <button className="btn-outline text-sm px-4">Modifier</button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="budget" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-dark p-6">
                  <h2 className="text-white font-bold mb-1">J'ai un budget, aidez-moi</h2>
                  <p className="text-gray-500 text-sm mb-6">Dites-nous combien vous avez, on vous propose le meilleur repas possible.</p>
                  <div className="relative mb-4">
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => { setBudget(e.target.value); setBudgetResult(null) }}
                      placeholder="Entrez votre budget"
                      className="input-dark pr-16 text-2xl font-bold"
                      min={500}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 font-bold">FCFA</span>
                  </div>
                  <div className="flex gap-2 mb-6">
                    {[2000, 3500, 5000, 7500].map((b) => (
                      <button key={b} onClick={() => { setBudget(String(b)); setBudgetResult(null) }} className={`flex-1 py-2 text-sm rounded-xl transition-all ${budget === String(b) ? 'bg-orange-500 text-white' : 'bg-[#2a2a2a] text-gray-400 hover:text-white'}`}>
                        {(b / 1000).toFixed(1)}k
                      </button>
                    ))}
                  </div>
                  <button onClick={handleBudget} disabled={!budget || loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <><Loader2 size={16} className="animate-spin" />Recherche...</> : '🎯 TROUVER LE MEILLEUR REPAS'}
                  </button>
                  <button className="btn-outline w-full mt-3 text-sm">Définir mon budget</button>
                </div>

                <div className="card-dark p-6">
                  <h2 className="text-white font-bold mb-4">Voici ce que nous proposons</h2>
                  {!budgetResult ? (
                    <div className="text-center text-gray-500 py-12">
                      <div className="text-4xl mb-3">🎯</div>
                      <p className="text-sm">Entrez votre budget et on trouve le meilleur repas</p>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="space-y-3 mb-4">
                        {budgetResult.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl p-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#2a2a2a] shrink-0">
                              {item.image && <Image src={item.image} alt={item.nom} width={48} height={48} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium">{item.nom}</p>
                              <p className="text-orange-400 font-bold text-sm">{item.prix.toLocaleString()} FCFA</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[#2a2a2a] pt-3 mb-4 text-sm space-y-1">
                        <div className="flex justify-between text-gray-400"><span>Total repas</span><span className="text-white">{budgetResult.total.toLocaleString()} FCFA</span></div>
                        {budgetResult.reste > 0 && <div className="flex justify-between text-gray-400"><span>Reste</span><span className="text-green-400">{budgetResult.reste.toLocaleString()} FCFA</span></div>}
                      </div>
                      <button onClick={addBudgetToCart} className="btn-primary w-full flex items-center justify-center gap-2">
                        <Plus size={16} />Choisir ce repas
                      </button>
                      <button onClick={handleBudget} className="btn-outline w-full mt-2 text-sm">Voir d'autres options</button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
