'use client'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'

const METHODS = [
  {
    icon: '🟠', name: 'Orange Money', desc: 'Paiement via Orange Money CI',
    steps: ['Composez le *144#', 'Entrez votre code secret', 'Validez le paiement'],
    color: 'border-orange-500/20 bg-orange-500/5'
  },
  {
    icon: '🟡', name: 'MTN Mobile Money', desc: 'Paiement via MoMo',
    steps: ['Composez le *133#', 'Choisissez "Paiement"', 'Validez le code'],
    color: 'border-yellow-500/20 bg-yellow-500/5'
  },
  {
    icon: '🔵', name: 'Wave', desc: 'Paiement rapide via Wave',
    steps: ["Ouvrez l'app Wave", 'Scannez le QR code', 'Confirmez le paiement'],
    color: 'border-blue-500/20 bg-blue-500/5'
  },
  {
    icon: '💵', name: 'Espèces', desc: 'Paiement à la livraison',
    steps: ['Préparez la somme exacte', 'Remettez au livreur', 'Signez le reçu'],
    color: 'border-green-500/20 bg-green-500/5'
  },
]

export default function PaiementPage() {
  return (
    <div className="min-h-screen pt-20 bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 py-5">
          <Link href="/compte" className="text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-white font-black text-lg">Moyens de paiement</h1>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <CheckCircle size={18} className="text-orange-400 shrink-0 mt-0.5" />
          <p className="text-orange-200 text-sm">Tous les paiements sont sécurisés. Choisissez votre méthode préférée lors de votre prochaine commande.</p>
        </div>

        <div className="space-y-3">
          {METHODS.map(m => (
            <div key={m.name} className={`border rounded-2xl p-4 ${m.color}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{m.name}</p>
                  <p className="text-gray-500 text-xs">{m.desc}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {m.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#1a1a1a] rounded-full text-xs flex items-center justify-center text-gray-400 shrink-0 font-bold">{i + 1}</span>
                    <p className="text-gray-400 text-xs">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
