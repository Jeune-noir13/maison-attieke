import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nom, prenoms, email, telephone, motDePasse, lieuHabitation, dateNaissance, sexe } = body

    if (!nom || !prenoms || !email || !motDePasse) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(motDePasse, 12)

    const user = await prisma.user.create({
      data: {
        nom,
        prenoms,
        email,
        telephone,
        lieuHabitation,
        dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
        sexe: sexe || '',
        motDePasse: hashed,
      },
    })

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
