import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const livreurs = await prisma.livreur.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      position: true,
      commandes: { where: { statut: 'EN_ROUTE' }, select: { id: true, numero: true } },
    },
  })
  return NextResponse.json(livreurs)
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { nom, prenom, telephone, motDePasse } = await req.json()
  if (!nom || !prenom || !telephone || !motDePasse) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 })
  }

  // Generate unique livreur ID
  const count = await prisma.livreur.count()
  const livreurId = `LIV-${String(count + 1).padStart(3, '0')}`
  const hashed = await bcrypt.hash(motDePasse, 12)

  const livreur = await prisma.livreur.create({
    data: { livreurId, nom, prenom, telephone, motDePasse: hashed },
  })

  return NextResponse.json({ ...livreur, motDePasse: undefined, livreurIdClair: livreurId, mdpClair: motDePasse }, { status: 201 })
}
