import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { email, motDePasse } = await req.json()
  if (!email || !motDePasse) return NextResponse.json({ error: 'Champs requis' }, { status: 400 })

  const admin = await prisma.admin.findUnique({ where: { email } })
  if (!admin) return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })

  const valid = await bcrypt.compare(motDePasse, admin.motDePasse)
  if (!valid) return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 })

  const token = await signToken({ id: admin.id, email: admin.email, nom: admin.nom, role: 'ADMIN' })

  cookies().set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12, // 12h
    path: '/',
  })

  return NextResponse.json({ success: true })
}
