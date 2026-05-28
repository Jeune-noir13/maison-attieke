import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const menuItems = [
  // Braisés
  { nom: 'Attiéké + Poulet braisé', description: 'Poulet braisé mariné aux épices locales, servi avec attiéké, allocos, crudités et sauce maison.', prix: 4500, categorie: 'BRAISES', populaire: true, note: 4.8, nombreAvis: 120, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80' },
  { nom: 'Attiéké + Poisson braisé', description: 'Poisson frais braisé à la perfection, servi avec attiéké, allocos et sauce maison.', prix: 4500, categorie: 'BRAISES', populaire: true, note: 4.7, nombreAvis: 98, image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400&q=80' },
  { nom: 'Attiéké + Porc braisé', description: 'Porc tendre braisé aux épices, servi avec attiéké et sauce maison.', prix: 4500, categorie: 'BRAISES', populaire: false, note: 4.6, nombreAvis: 76, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
  { nom: 'Attiéké + Escargots grillés', description: 'Escargots grillés aux épices, servi avec attiéké et sauce spéciale.', prix: 5000, categorie: 'BRAISES', populaire: false, note: 4.5, nombreAvis: 45, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  // Grillades
  { nom: 'Poulet grillé', description: 'Poulet entier grillé sur braises, mariné 24h aux herbes africaines.', prix: 5000, categorie: 'GRILLADES', populaire: true, note: 4.9, nombreAvis: 150, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80' },
  { nom: 'Poisson grillé', description: 'Poisson du jour grillé entier, assaisonné aux épices ivoiriennes.', prix: 4500, categorie: 'GRILLADES', populaire: false, note: 4.7, nombreAvis: 88, image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400&q=80' },
  { nom: 'Porc grillé', description: 'Côtes de porc grillées, sauce pimentée maison.', prix: 4500, categorie: 'GRILLADES', populaire: false, note: 4.5, nombreAvis: 62, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80' },
  { nom: 'Escargots grillés', description: 'Escargots géants grillés, sauce ail et piment.', prix: 5500, categorie: 'GRILLADES', populaire: false, note: 4.6, nombreAvis: 40, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  // Kedjenou
  { nom: 'Kedjenou Poulet', description: 'Le fameux kedjenou ivoirien au poulet fermier, cuit à l\'étouffée avec légumes et épices.', prix: 5500, categorie: 'KEDJENOU', populaire: true, note: 4.9, nombreAvis: 200, image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80' },
  { nom: 'Kedjenou Poisson', description: 'Kedjenou au poisson frais, parfumé aux aromates locaux.', prix: 5000, categorie: 'KEDJENOU', populaire: false, note: 4.7, nombreAvis: 85, image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400&q=80' },
  { nom: 'Kedjenou Lapin', description: 'Kedjenou au lapin, une spécialité rare et savoureuse.', prix: 6000, categorie: 'KEDJENOU', populaire: false, note: 4.8, nombreAvis: 55, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  // Soupes
  { nom: 'Soupe de poisson', description: 'Bouillon de poisson riche, épices locales, légumes frais.', prix: 3000, categorie: 'SOUPES', populaire: false, note: 4.6, nombreAvis: 70, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  { nom: 'Soupe de poulet', description: 'Soupe de poulet maison, servie avec pain ou attiéké.', prix: 3000, categorie: 'SOUPES', populaire: false, note: 4.5, nombreAvis: 60, image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80' },
  // Accompagnements
  { nom: 'Attiéké', description: 'Semoule de manioc fraîche, la base ivoirienne par excellence.', prix: 300, categorie: 'ACCOMPAGNEMENTS', populaire: true, note: 4.8, nombreAvis: 500, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  { nom: 'Alloco', description: 'Bananes plantains frites, croustillantes et dorées.', prix: 500, categorie: 'ACCOMPAGNEMENTS', populaire: true, note: 4.7, nombreAvis: 350, image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80' },
  { nom: 'Frites', description: 'Frites de pomme de terre maison, assaisonnées.', prix: 500, categorie: 'ACCOMPAGNEMENTS', populaire: false, note: 4.4, nombreAvis: 180, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80' },
  { nom: 'Crudités', description: 'Salade de légumes frais, vinaigrette maison.', prix: 200, categorie: 'ACCOMPAGNEMENTS', populaire: false, note: 4.3, nombreAvis: 90, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { nom: 'Sauce maison', description: 'Notre sauce secrète, un mélange d\'épices ivoiriennes.', prix: 200, categorie: 'ACCOMPAGNEMENTS', populaire: true, note: 4.9, nombreAvis: 420, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80' },
  // Boissons
  { nom: 'Coca-Cola 33cl', description: 'Coca-Cola bien frais.', prix: 500, categorie: 'BOISSONS', populaire: true, note: 4.5, nombreAvis: 300, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80' },
  { nom: 'Fanta 33cl', description: 'Fanta orange bien frais.', prix: 500, categorie: 'BOISSONS', populaire: false, note: 4.4, nombreAvis: 200, image: 'https://images.unsplash.com/photo-1624552184280-9e48f4e26bec?w=400&q=80' },
  { nom: 'Sprite 33cl', description: 'Sprite bien frais.', prix: 500, categorie: 'BOISSONS', populaire: false, note: 4.3, nombreAvis: 180, image: 'https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=400&q=80' },
  { nom: 'Malta Guinness 33cl', description: 'Malta Guinness, boisson maltée non alcoolisée.', prix: 500, categorie: 'BOISSONS', populaire: true, note: 4.6, nombreAvis: 250, image: 'https://images.unsplash.com/photo-1561077854-748ad3a29734?w=400&q=80' },
  { nom: 'Eau minérale 50cl', description: 'Eau minérale fraîche.', prix: 300, categorie: 'BOISSONS', populaire: false, note: 4.5, nombreAvis: 400, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80' },
  { nom: 'Jus naturel bissap', description: 'Jus de bissap fait maison, sucré et parfumé.', prix: 500, categorie: 'BOISSONS', populaire: true, note: 4.8, nombreAvis: 160, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80' },
  // Sucreries
  { nom: 'Chips Africa (grand)', description: 'Chips croustillantes au goût épicé africain.', prix: 500, categorie: 'SUCRERIES', populaire: true, note: 4.5, nombreAvis: 120, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80' },
  { nom: 'Snickers', description: 'Barre chocolatée Snickers.', prix: 500, categorie: 'SUCRERIES', populaire: false, note: 4.4, nombreAvis: 80, image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80' },
  { nom: 'KitKat', description: 'Barre KitKat au chocolat au lait.', prix: 500, categorie: 'SUCRERIES', populaire: false, note: 4.3, nombreAvis: 75, image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80' },
  { nom: 'Bounty', description: 'Barre Bounty noix de coco et chocolat.', prix: 500, categorie: 'SUCRERIES', populaire: false, note: 4.2, nombreAvis: 65, image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80' },
  { nom: 'Glace Cornetto', description: 'Glace Cornetto vanille avec topping chocolat.', prix: 500, categorie: 'SUCRERIES', populaire: true, note: 4.7, nombreAvis: 110, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&q=80' },
]

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.ligneOffre.deleteMany()
  await prisma.offre.deleteMany()
  await prisma.ligneCommande.deleteMany()
  await prisma.commande.deleteMany()
  await prisma.livreurPosition.deleteMany()
  await prisma.livreur.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.adresse.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.siteSettings.deleteMany()

  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item })
  }

  const hashedPassword = await bcrypt.hash('Demo1234!', 12)
  await prisma.user.create({
    data: {
      nom: 'Yao',
      prenoms: 'Konan',
      email: 'demo@maison-attieke.ci',
      telephone: '07 07 07 07 07',
      lieuHabitation: 'Cocody, Abidjan',
      motDePasse: hashedPassword,
      points: 230,
      role: 'CLIENT',
      adresses: {
        create: [{
          label: 'Domicile',
          adresse: 'Riviera Palmeraie, Rue K124',
          commune: 'Cocody',
          defaut: true,
        }]
      }
    },
  })

  // Admin account
  const adminHash = await bcrypt.hash('Admin2024!', 12)
  await prisma.admin.create({
    data: { nom: 'Administrateur', email: 'admin@maison-attieke.ci', motDePasse: adminHash },
  })

  // Demo livreur
  const livHash = await bcrypt.hash('Livreur2024!', 12)
  await prisma.livreur.create({
    data: { livreurId: 'LIV-001', nom: 'Koné', prenom: 'Madou', telephone: '+225 07 00 00 00 01', motDePasse: livHash, statut: 'DISPONIBLE' },
  })

  // Site settings
  await prisma.siteSettings.create({ data: { id: 'main' } })

  console.log(`✅ ${menuItems.length} menu items created`)
  console.log('✅ Demo user: demo@maison-attieke.ci / Demo1234!')
  console.log('✅ Admin: admin@maison-attieke.ci / Admin2024!')
  console.log('✅ Livreur démo: LIV-001 / Livreur2024!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
