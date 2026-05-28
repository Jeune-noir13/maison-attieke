import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import AdminShortcut from '@/components/AdminShortcut'

export const metadata: Metadata = {
  title: "La Maison de l'Attiéké – L'attiéké comme vous ne l'avez jamais goûté",
  description: "Commandez vos plats ivoiriens préférés en ligne. Braisés, grillades, kedjenou, attiéké. Livraison rapide à Abidjan.",
  keywords: "attiéké, restaurant ivoirien, livraison, abidjan, braisé, kedjenou",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <AdminShortcut />
          {children}
        </Providers>
      </body>
    </html>
  )
}
