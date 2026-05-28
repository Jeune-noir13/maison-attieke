import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const promos = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(promos)
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { code, description, type, valeur, minCommande, maxUses, expiresAt } = await req.json()
  if (!code || !description) return NextResponse.json({ error: 'Champs requis' }, { status: 400 })
  try {
    const promo = await prisma.promotion.create({
      data: {
        code: code.toUpperCase().trim(),
        description,
        type: type || 'PERCENT',
        valeur: Number(valeur) || 10,
        minCommande: Number(minCommande) || 0,
        maxUses: Number(maxUses) || 100,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })
    return NextResponse.json(promo, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Code déjà existant' }, { status: 409 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { id, ...data } = await req.json()
  const promo = await prisma.promotion.update({ where: { id }, data })
  return NextResponse.json(promo)
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const { id } = await req.json()
  await prisma.promotion.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
