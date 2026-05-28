import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const type = (formData.get('type') as string) ?? 'logo'  // 'logo' | 'hero'

  if (!file || file.size === 0) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  if (!allowed.includes(file.type)) return NextResponse.json({ error: 'Format non supporté' }, { status: 415 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const ext    = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'

  let filePath: string
  let publicUrl: string

  if (type === 'hero') {
    filePath  = join(process.cwd(), 'public', 'hero-bg.jpg')
    publicUrl = '/hero-bg.jpg'
  } else {
    await mkdir(join(process.cwd(), 'public', 'uploads'), { recursive: true })
    filePath  = join(process.cwd(), 'public', 'uploads', `logo.${ext}`)
    publicUrl = `/uploads/logo.${ext}`
  }

  await writeFile(filePath, buffer)

  // Save logo URL in DB settings
  if (type === 'logo') {
    await prisma.siteSettings.upsert({
      where: { id: 'main' },
      update: { logoUrl: publicUrl },
      create: { id: 'main', logoUrl: publicUrl },
    })
  }

  return NextResponse.json({ url: publicUrl })
}
