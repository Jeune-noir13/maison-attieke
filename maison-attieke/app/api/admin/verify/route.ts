import { NextResponse } from 'next/server'
import { getAdminFromCookie } from '@/lib/admin-auth'

export async function GET() {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  return NextResponse.json({ admin })
}

export async function DELETE() {
  const { cookies } = await import('next/headers')
  cookies().delete('admin_token')
  return NextResponse.json({ success: true })
}
