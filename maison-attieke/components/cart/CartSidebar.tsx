'use client'
import { useCart } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartSidebar() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total, count } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/70 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#111] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#1f1f1f]">
              <div>
                <h2 className="text-white font-bold text-lg">Mon panier</h2>
                <p className="text-gray-400 text-sm">{count()} article{count() > 1 ? 's' : ''}</p>
              </div>
              <button onClick={toggleCart} className="p-2 text-gray-400 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-5 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag size={48} className="text-gray-600" />
                  <div>
                    <p className="text-gray-400">Votre panier est vide</p>
                    <p className="text-gray-600 text-sm mt-1">Ajoutez des plats depuis notre menu</p>
                  </div>
                  <button onClick={toggleCart} className="btn-outline text-sm">Voir le menu</button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 bg-[#1a1a1a] rounded-xl p-3"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#2a2a2a] shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.nom} width={64} height={64} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-orange-500/10 flex items-center justify-center text-2xl">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.nom}</p>
                      <p className="text-orange-400 font-bold text-sm">{(item.prix * item.quantite).toLocaleString()} FCFA</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQuantity(item.id, item.quantite - 1)}
                          className="w-6 h-6 bg-[#2a2a2a] hover:bg-orange-500/20 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{item.quantite}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantite + 1)}
                          className="w-6 h-6 bg-[#2a2a2a] hover:bg-orange-500/20 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-400 transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[#1f1f1f] space-y-3">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Tag size={14} className="text-orange-500" />
                  <span>Négocier le prix total ?</span>
                  <Link href="/panier" onClick={toggleCart} className="text-orange-400 hover:underline ml-auto">Faire une offre</Link>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Sous-total</span><span className="text-white">{total().toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Livraison</span><span className="text-white">500 FCFA</span>
                </div>
                <div className="flex justify-between font-bold text-white">
                  <span>Total</span><span className="text-orange-400">{(total() + 500).toLocaleString()} FCFA</span>
                </div>
                <Link href="/panier" onClick={toggleCart} className="btn-primary w-full text-center block">
                  Passer la commande
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
