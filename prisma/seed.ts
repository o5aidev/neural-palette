import { PrismaClient } from '../src/generated/prisma/index.js'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo artist
  const artist = await prisma.artistDNA.create({
    data: {
      name: 'Demo Artist',
      bio: 'A passionate digital artist exploring the intersection of AI and creativity',
      visualThemes: JSON.stringify(['abstract', 'minimalism', 'futurism']),
      musicGenres: JSON.stringify(['electronic', 'ambient', 'experimental']),
      writingStyle: 'poetic and introspective',
      colorPalette: JSON.stringify(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']),
      tone: 'friendly',
      emojiUsage: 'moderate',
      responseLength: 'medium',
      languagePreferences: JSON.stringify(['ja', 'en']),
      coreValues: JSON.stringify(['authenticity', 'innovation', 'connection']),
      artisticVision: 'To create art that bridges human emotion and artificial intelligence',
      fanRelationshipPhilosophy: 'Building genuine connections through shared creative experiences',
    },
  })

  console.log(`✅ Created artist: ${artist.name} (${artist.id})`)

  // Create milestones
  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        artistId: artist.id,
        date: new Date('2024-01-15'),
        title: 'First Digital Exhibition',
        description: 'Launched first virtual art gallery',
        type: 'achievement',
        significance: 8,
      },
    }),
    prisma.milestone.create({
      data: {
        artistId: artist.id,
        date: new Date('2024-06-20'),
        title: '10K Followers Milestone',
        description: 'Reached 10,000 followers across platforms',
        type: 'milestone',
        significance: 7,
      },
    }),
  ])

  console.log(`✅ Created ${milestones.length} milestones`)

  // Create content
  const contents = await Promise.all([
    prisma.content.create({
      data: {
        artistId: artist.id,
        title: 'Digital Dreams Collection',
        description: 'An exploration of AI-generated abstract art',
        type: 'artwork',
        status: 'published',
        publishedAt: new Date('2024-03-15'),
        metadata: JSON.stringify({
          tags: ['abstract', 'AI', 'digital'],
          format: 'image/png',
          dimensions: { width: 1920, height: 1080 },
        }),
      },
    }),
    prisma.content.create({
      data: {
        artistId: artist.id,
        title: 'Behind the Pixels - Episode 1',
        description: 'A video series about my creative process',
        type: 'video',
        status: 'published',
        publishedAt: new Date('2024-04-20'),
        metadata: JSON.stringify({
          tags: ['tutorial', 'process', 'video'],
          duration: 1200,
          format: 'video/mp4',
        }),
      },
    }),
    prisma.content.create({
      data: {
        artistId: artist.id,
        title: 'Upcoming Exhibition Teaser',
        description: 'Sneak peek of next collection',
        type: 'artwork',
        status: 'draft',
        metadata: JSON.stringify({
          tags: ['teaser', 'preview'],
          format: 'image/jpeg',
        }),
      },
    }),
  ])

  console.log(`✅ Created ${contents.length} content items`)

  // Create fan profiles
  const fanProfiles = await Promise.all([
    prisma.fanProfile.create({
      data: {
        artistId: artist.id,
        displayName: 'ArtLover123',
        platform: 'instagram',
        email: 'artlover@example.com',
        totalInteractions: 15,
        sentimentHistory: JSON.stringify(['positive', 'positive', 'neutral']),
        avgSentiment: 'positive',
        topics: JSON.stringify(['artwork', 'colors', 'techniques']),
        isVIP: true,
        engagementScore: 85,
        tags: JSON.stringify(['engaged', 'supportive']),
      },
    }),
    prisma.fanProfile.create({
      data: {
        artistId: artist.id,
        displayName: 'DigitalArtFan',
        platform: 'twitter',
        totalInteractions: 8,
        sentimentHistory: JSON.stringify(['neutral', 'positive']),
        avgSentiment: 'positive',
        topics: JSON.stringify(['exhibitions', 'releases']),
        engagementScore: 65,
        tags: JSON.stringify(['curious']),
      },
    }),
  ])

  console.log(`✅ Created ${fanProfiles.length} fan profiles`)

  // Create conversation threads
  const conversations = await Promise.all([
    prisma.conversationThread.create({
      data: {
        artistId: artist.id,
        fanId: fanProfiles[0].id,
        channel: 'instagram',
        subject: 'Artwork inquiry',
        status: 'resolved',
        priority: 'normal',
        sentiment: 'positive',
        topics: JSON.stringify(['artwork', 'purchase']),
        messageCount: 4,
      },
    }),
  ])

  console.log(`✅ Created ${conversations.length} conversation threads`)

  // Create distributions
  const distributions = await Promise.all([
    prisma.distribution.create({
      data: {
        artistId: artist.id,
        contentId: contents[0].id,
        title: 'Digital Dreams - Multi-platform Release',
        description: 'Launching the Digital Dreams collection across all major platforms',
        platforms: JSON.stringify(['instagram', 'twitter', 'facebook']),
        tags: JSON.stringify(['artwork', 'release', 'digital-dreams']),
        status: 'published',
        scheduledDate: new Date('2024-03-15T10:00:00Z'),
        publishedDate: new Date('2024-03-15T10:00:05Z'),
      },
    }),
    prisma.distribution.create({
      data: {
        artistId: artist.id,
        contentId: contents[1].id,
        title: 'Behind the Pixels - Episode 1 Release',
        description: 'First episode of the creative process series',
        platforms: JSON.stringify(['youtube', 'twitter']),
        tags: JSON.stringify(['video', 'tutorial', 'behind-the-scenes']),
        status: 'published',
        scheduledDate: new Date('2024-04-20T14:00:00Z'),
        publishedDate: new Date('2024-04-20T14:00:08Z'),
      },
    }),
    prisma.distribution.create({
      data: {
        artistId: artist.id,
        contentId: contents[2].id,
        title: 'Exhibition Teaser Preview',
        description: 'Upcoming exhibition sneak peek',
        platforms: JSON.stringify(['instagram', 'twitter']),
        tags: JSON.stringify(['teaser', 'upcoming', 'preview']),
        status: 'scheduled',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
  ])

  console.log(`✅ Created ${distributions.length} distributions`)

  // Create social connections
  const connections = await Promise.all([
    prisma.socialConnection.create({
      data: {
        artistId: artist.id,
        platform: 'instagram',
        accountId: 'ig_12345',
        accountName: '@demo_artist',
        accessToken: 'demo_instagram_token',
        refreshToken: 'demo_instagram_refresh',
        tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        followerCount: 12500,
        isActive: true,
      },
    }),
    prisma.socialConnection.create({
      data: {
        artistId: artist.id,
        platform: 'twitter',
        accountId: 'tw_67890',
        accountName: '@DemoArtist',
        accessToken: 'demo_twitter_token',
        refreshToken: 'demo_twitter_refresh',
        tokenExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        followerCount: 8300,
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${connections.length} social connections`)

  // Create social posts
  const posts = await Promise.all([
    prisma.socialPost.create({
      data: {
        artistId: artist.id,
        contentId: contents[0].id,
        type: 'image',
        content: 'Excited to share my latest work from the Digital Dreams collection! 🎨✨',
        mediaUrls: JSON.stringify([]),
        platforms: JSON.stringify(['instagram', 'twitter']),
        status: 'published',
        postedAt: new Date('2024-03-15T10:05:00Z'),
        platformPosts: JSON.stringify([]),
        engagementStats: JSON.stringify({
          likes: 2543,
          comments: 187,
          shares: 92,
          views: 15234,
        }),
      },
    }),
    prisma.socialPost.create({
      data: {
        artistId: artist.id,
        contentId: contents[1].id,
        type: 'video',
        content: 'New video: Behind the Pixels - Episode 1! Join me as I break down my creative process.',
        mediaUrls: JSON.stringify([]),
        platforms: JSON.stringify(['youtube']),
        status: 'published',
        postedAt: new Date('2024-04-20T14:10:00Z'),
        platformPosts: JSON.stringify([]),
        engagementStats: JSON.stringify({
          likes: 1823,
          comments: 234,
          views: 12456,
        }),
      },
    }),
  ])

  console.log(`✅ Created ${posts.length} social posts`)

  // Create rights
  const rights = await Promise.all([
    prisma.right.create({
      data: {
        artistId: artist.id,
        contentId: contents[0].id,
        rightType: 'copyright',
        rightHolder: 'Demo Artist',
        rightHolderContact: 'demo@artist.com',
        licenseType: 'all-rights-reserved',
        startDate: new Date('2024-03-15'),
        territories: JSON.stringify(['JP', 'US', 'EU']),
        registrationNumber: 'CR-2024-0315-001',
      },
    }),
  ])

  console.log(`✅ Created ${rights.length} rights`)

  // Create infringements
  const infringements = await Promise.all([
    prisma.infringement.create({
      data: {
        artistId: artist.id,
        rightId: rights[0].id,
        contentId: contents[0].id,
        detectedUrl: 'https://example.com/unauthorized-use',
        detectedPlatform: 'unknown-site',
        description: 'Unauthorized use of artwork in commercial context',
        detectionMethod: 'manual',
        confidence: 80,
        recommendedAction: 'takedown',
        status: 'detected',
      },
    }),
  ])

  console.log(`✅ Created ${infringements.length} infringements`)

  // Create monitoring rules
  const monitoringRules = await Promise.all([
    prisma.monitoringRule.create({
      data: {
        artistId: artist.id,
        name: 'Artwork Copyright Monitor',
        contentIds: JSON.stringify([contents[0].id]),
        keywords: JSON.stringify(['Demo Artist', 'Digital Dreams']),
        platforms: JSON.stringify(['google', 'pinterest', 'instagram']),
        isActive: true,
      },
    }),
  ])

  console.log(`✅ Created ${monitoringRules.length} monitoring rules`)

  // Create creative sessions
  const sessions = await Promise.all([
    prisma.creativeSession.create({
      data: {
        artistId: artist.id,
        title: 'Abstract Minimalism',
        type: 'artwork',
        status: 'completed',
        defaultParams: JSON.stringify({
          style: 'minimalist',
          mood: 'focused',
        }),
        completedAt: new Date('2024-05-10T12:30:00Z'),
      },
    }),
  ])

  console.log(`✅ Created ${sessions.length} creative sessions`)

  // Create inspirations
  const inspirations = await Promise.all([
    prisma.inspiration.create({
      data: {
        artistId: artist.id,
        title: 'Kandinsky Color Theory',
        content: 'Exploring Kandinsky\'s approach to color and emotion. Great insights on how colors evoke specific emotions',
        type: 'concept',
        source: 'book',
        tags: JSON.stringify(['color-theory', 'abstract', 'inspiration']),
      },
    }),
  ])

  console.log(`✅ Created ${inspirations.length} inspirations`)

  console.log('🎉 Database seed completed successfully!')
  console.log(`
📊 Summary:
- 1 Artist
- ${milestones.length} Milestones
- ${contents.length} Content Items
- ${fanProfiles.length} Fan Profiles
- ${conversations.length} Conversation Threads
- ${distributions.length} Distributions
- ${connections.length} Social Connections
- ${posts.length} Social Posts
- ${rights.length} Rights
- ${infringements.length} Infringements
- ${monitoringRules.length} Monitoring Rules
- ${sessions.length} Creative Sessions
- ${inspirations.length} Inspirations
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
