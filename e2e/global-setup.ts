import { PrismaClient } from '../src/generated/prisma/index.js'

/**
 * Global setup for E2E tests
 * Runs before all tests to prepare the database
 */
async function globalSetup() {
  console.log('🔧 E2E Global Setup: Starting database preparation...')

  const prisma = new PrismaClient()

  try {
    // Clean existing data
    console.log('🧹 Cleaning existing test data...')
    await prisma.message.deleteMany({})
    await prisma.conversationThread.deleteMany({})
    await prisma.fanProfile.deleteMany({})
    await prisma.content.deleteMany({})
    await prisma.artistDNA.deleteMany({})
    console.log('✅ Database cleaned')

    // Seed database
    console.log('🌱 Seeding test data...')

    // Create test artist
    const artist = await prisma.artistDNA.create({
      data: {
        name: 'Test Artist',
        bio: 'A test artist for E2E testing',
        visualThemes: JSON.stringify(['minimalist', 'colorful']),
        musicGenres: JSON.stringify(['electronic', 'ambient']),
        writingStyle: 'poetic and introspective',
        colorPalette: JSON.stringify(['#FF6B6B', '#4ECDC4', '#45B7D1']),
        tone: 'friendly',
        emojiUsage: 'medium',
        responseLength: 'moderate',
        languagePreferences: JSON.stringify(['en', 'ja']),
        coreValues: JSON.stringify(['authenticity', 'creativity', 'connection']),
        artisticVision: 'To create meaningful experiences through art',
        fanRelationshipPhilosophy: 'Fans are collaborators, not consumers',
        version: 1,
      },
    })

    console.log(`✅ Created test artist: ${artist.id}`)

    // Create test fan profile
    await prisma.fanProfile.create({
      data: {
        id: 'anonymous',
        artistId: artist.id,
        displayName: 'Anonymous User',
        email: 'anonymous@test.com',
        sentimentHistory: JSON.stringify([]),
        avgSentiment: 'neutral',
        topics: JSON.stringify([]),
        tags: JSON.stringify([]),
        engagementScore: 50,
      },
    })

    console.log('✅ Created test fan profile')

    // Create test content
    await prisma.content.create({
      data: {
        artistId: artist.id,
        title: 'Test Song',
        description: 'A test song for E2E testing',
        type: 'song',
        status: 'published',
        metadata: JSON.stringify({ duration: 180 }),
        version: 1,
      },
    })

    console.log('✅ Database seeded successfully')
  } catch (error) {
    console.error('❌ Failed to seed database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }

  console.log('✨ E2E Global Setup: Complete')
}

export default globalSetup
