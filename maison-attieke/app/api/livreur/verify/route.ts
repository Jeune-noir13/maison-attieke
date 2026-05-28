import { NextResponse } from 'next/server'
import { getLivreurFromCookie } from '@/lib/admin-auth'

export async function GET() {
  const livreur = await getLivreurFromCookie()
  if (!livreur) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  return NextResponse.json({ livreur })
}

export async function DELETE() {
  const { cookies } = await import('next/headers')
  cookies().delete('livreur_token')
  return NextResponse.json({ success: true })
}
