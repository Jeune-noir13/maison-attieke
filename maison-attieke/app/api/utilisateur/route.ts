import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      id: true, nom: true, prenoms: true, sexe: true, email: true, telephone: true,
      lieuHabitation: true, dateNaissance: true, points: true, image: true, role: true, createdAt: true,
      adresses: true,
      commandes: { orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, numero: true, statut: true, total: true, createdAt: true } },
    },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const body = await req.json()
  const { nom, prenoms, sexe, telephone, lieuHabitation, dateNaissance, email } = body
  const data: any = {}
  if (nom !== undefined) data.nom = nom
  if (prenoms !== undefined) data.prenoms = prenoms
  if (sexe !== undefined) data.sexe = sexe
  if (telephone !== undefined) data.telephone = telephone
  if (lieuHabitation !== undefined) data.lieuHabitation = lieuHabitation
  if (dateNaissance !== undefined) data.dateNaissance = dateNaissance ? new Date(dateNaissance) : null
  if (email !== undefined) data.email = email
  await prisma.user.update({ where: { id: (session.user as any).id }, data })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  await prisma.user.delete({ where: { id: (session.user as any).id } })
  return NextResponse.json({ success: true })
}
