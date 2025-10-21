import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting simple database seed...')

  // Create demo artist
  const artist = await prisma.artistDNA.create({
    data: {
      name: 'Demo Artist',
      bio: 'A passionate digital artist',
      visualThemes: JSON.stringify(['abstract', 'minimalism']),
      musicGenres: JSON.stringify(['electronic', 'ambient']),
      writingStyle: 'poetic',
      colorPalette: JSON.stringify(['#FF6B6B', '#4ECDC4']),
      tone: 'friendly',
      emojiUsage: 'moderate',
      responseLength: 'medium',
      languagePreferences: JSON.stringify(['ja', 'en']),
      coreValues: JSON.stringify(['authenticity', 'innovation']),
      artisticVision: 'Create art that bridges human emotion and AI',
      fanRelationshipPhilosophy: 'Building genuine connections',
    },
  })

  console.log(`✅ Created artist: ${artist.name}`)

  // Create content
  const content = await prisma.content.create({
    data: {
      artistId: artist.id,
      title: 'Digital Dreams',
      description: 'AI-generated abstract art',
      type: 'artwork',
      status: 'published',
      publishedAt: new Date(),
      metadata: JSON.stringify({ tags: ['abstract', 'AI'] }),
    },
  })

  console.log(`✅ Created content: ${content.title}`)

  // Create distribution
  await prisma.distribution.create({
    data: {
      artistId: artist.id,
      contentId: content.id,
      title: 'Digital Dreams Release',
      description: 'Launch',
      platforms: JSON.stringify(['instagram', 'twitter']),
      tags: JSON.stringify(['artwork']),
      status: 'published',
      scheduledDate: new Date(),
      publishedDate: new Date(),
    },
  })

  console.log('✅ Created distribution')
  console.log('🎉 Simple seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
