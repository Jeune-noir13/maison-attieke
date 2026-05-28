import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartSidebar from '@/components/cart/CartSidebar'
import dynamic from 'next/dynamic'

// ChatWidget chargé côté client uniquement (utilise localStorage)
const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), { ssr: false })

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartSidebar />
      <main>{children}</main>
      <Footer />
      {/* settings est null ici — ChatWidget les fetch lui-même via /api/settings */}
      <ChatWidget />
    </>
  )
}
