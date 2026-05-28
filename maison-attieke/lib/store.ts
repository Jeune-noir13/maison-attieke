'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  nom: string
  prix: number
  quantite: number
  image?: string
  categorie: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantite'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantite: number) => void
  clearCart: () => void
  toggleCart: () => void
  total: () => number
  count: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const items = get().items
        const existing = items.find((i) => i.id === item.id)
        if (existing) {
          set({ items: items.map((i) => i.id === item.id ? { ...i, quantite: i.quantite + 1 } : i) })
        } else {
          set({ items: [...items, { ...item, quantite: 1 }] })
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantite) => {
        if (quantite <= 0) {
          get().removeItem(id)
          return
        }
        set({ items: get().items.map((i) => i.id === id ? { ...i, quantite } : i) })
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      total: () => get().items.reduce((sum, i) => sum + i.prix * i.quantite, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantite, 0),
    }),
    { name: 'maison-attieke-cart' }
  )
)
