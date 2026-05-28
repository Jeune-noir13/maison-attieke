import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/admin-auth'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { livreurId, motDePasse } = await req.json()
  if (!livreurId || !motDePasse) return NextResponse.json({ error: 'Champs requis' }, { status: 400 })

  const livreur = await prisma.livreur.findUnique({ where: { livreurId } })
  if (!livreur) return NextResponse.json({ error: 'ID livreur inconnu' }, { status: 401 })

  const valid = await bcrypt.compare(motDePasse, livreur.motDePasse)
  if (!valid) return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })

  const token = await signToken({ id: livreur.id, livreurId: livreur.livreurId, nom: livreur.nom, prenom: livreur.prenom, role: 'LIVREUR' })

  cookies().set('livreur_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 16,
    path: '/',
  })

  // Set livreur online
  await prisma.livreur.update({ where: { id: livreur.id }, data: { enLigne: true } })

  return NextResponse.json({ success: true, livreurId: livreur.livreurId, nom: livreur.nom })
}
