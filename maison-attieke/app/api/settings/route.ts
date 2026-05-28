import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public endpoint — no auth needed
export async function GET() {
  const s = await prisma.siteSettings.findUnique({ where: { id: 'main' } })
  return NextResponse.json({
    siteName:         s?.siteName         ?? "Maison de l'Attiéké",
    logoText:         s?.logoText         ?? 'M',
    logoUrl:          s?.logoUrl          ?? null,
    slogan:           s?.slogan           ?? '',
    telephone:        s?.telephone        ?? '',
    adresse:          s?.adresse          ?? '',
    email:            s?.email            ?? '',
    ouvertureHeure:   s?.ouvertureHeure   ?? '10:00',
    fermetureHeure:   s?.fermetureHeure   ?? '23:00',
    facebook:         s?.facebook         ?? '',
    instagram:        s?.instagram        ?? '',
    whatsapp:         s?.whatsapp         ?? '',
    supportTelephone: s?.supportTelephone ?? '',
    supportWhatsapp:  s?.supportWhatsapp  ?? '',
    chatActif:        s?.chatActif        ?? true,
    fraisLivraison:   s?.fraisLivraison   ?? 500,
  })
}
