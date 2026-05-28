import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { budget } = await req.json()

  if (!budget || budget < 300) {
    return NextResponse.json({ error: 'Budget trop faible' }, { status: 400 })
  }

  const items = await prisma.menuItem.findMany({
    where: { disponible: true, prix: { lte: budget } },
    orderBy: { note: 'desc' },
  })

  let remaining = budget
  const selected: typeof items = []

  // 1. Try main dish (BRAISES, GRILLADES, KEDJENOU, SOUPES)
  const mainCats = ['BRAISES', 'GRILLADES', 'KEDJENOU', 'SOUPES']
  for (const cat of mainCats) {
    const candidates = items.filter((i) => i.categorie === cat && i.prix <= remaining)
    if (candidates.length > 0) {
      selected.push(candidates[0])
      remaining -= candidates[0].prix
      break
    }
  }

  // 2. If no main dish fits, stack from ACCOMPAGNEMENTS
  if (selected.length === 0) {
    const accomps = items.filter((i) => i.categorie === 'ACCOMPAGNEMENTS' && i.prix <= remaining)
    for (const a of accomps) {
      if (remaining - a.prix >= 0 && !selected.find((s) => s.id === a.id)) {
        selected.push(a)
        remaining -= a.prix
        if (selected.length >= 2) break
      }
    }
  } else {
    // 3. Add accompaniment
    const accomp = items.find((i) => i.categorie === 'ACCOMPAGNEMENTS' && i.prix <= remaining && !selected.find((s) => s.id === i.id))
    if (accomp) { selected.push(accomp); remaining -= accomp.prix }
  }

  // 4. Add drink
  const drink = items.find((i) => i.categorie === 'BOISSONS' && i.prix <= remaining && !selected.find((s) => s.id === i.id))
  if (drink) { selected.push(drink); remaining -= drink.prix }

  // 5. Add sauce if budget allows
  const sauce = items.find((i) => i.nom.toLowerCase().includes('sauce') && i.prix <= remaining && !selected.find((s) => s.id === i.id))
  if (sauce) { selected.push(sauce); remaining -= sauce.prix }

  const total = selected.reduce((sum, i) => sum + i.prix, 0)

  return NextResponse.json({
    items: selected,
    total,
    budget,
    reste: budget - total,
  })
}
