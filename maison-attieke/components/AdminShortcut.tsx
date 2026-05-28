'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Type 'a' then 'z' then 'd' quickly (outside of any input) to open admin panel
export default function AdminShortcut() {
  const router = useRouter()

  useEffect(() => {
    let sequence = ''
    let timeout: ReturnType<typeof setTimeout>

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const key = e.key.toLowerCase()
      if (!/^[a-z]$/.test(key)) return

      clearTimeout(timeout)
      sequence += key
      if (sequence.length > 5) sequence = sequence.slice(-5)

      if (sequence.endsWith('azd')) {
        sequence = ''
        router.push('/portail-admin')
        return
      }

      timeout = setTimeout(() => { sequence = '' }, 1500)
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      clearTimeout(timeout)
    }
  }, [router])

  return null
}
