import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const userId = (session.user as any).id

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Format non supporté' }, { status: 415 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Fichier trop lourd (max 5 Mo)' }, { status: 413 })

  const ext    = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const buffer = Buffer.from(await file.arrayBuffer())
  const dir    = join(process.cwd(), 'public', 'uploads', 'profiles')
  await mkdir(dir, { recursive: true })
  const filename  = `${userId}.${ext}`
  await writeFile(join(dir, filename), buffer)
  const publicUrl = `/uploads/profiles/${filename}`

  await prisma.user.update({ where: { id: userId }, data: { image: publicUrl } })
  return NextResponse.json({ url: publicUrl })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const userId = (session.user as any).id
  await prisma.user.update({ where: { id: userId }, data: { image: null } })
  return NextResponse.json({ success: true })
}
