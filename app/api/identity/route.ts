import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ArtistIdentity, CreateIdentityInput } from '@/lib/api/types'

// Helper to convert Prisma ArtistDNA to API ArtistIdentity
function toArtistIdentity(artistDNA: {
  id: string
  name: string
  bio: string
  musicGenres: string
  visualThemes: string
  createdAt: Date
  updatedAt: Date
}): ArtistIdentity {
  return {
    id: artistDNA.id,
    artistName: artistDNA.name,
    genre: JSON.parse(artistDNA.musicGenres || '[]')[0] || '',
    biography: artistDNA.bio,
    influences: [],
    musicalFeatures: JSON.parse(artistDNA.visualThemes || '[]'),
    createdAt: artistDNA.createdAt,
    updatedAt: artistDNA.updatedAt
  }
}

export async function GET() {
  try {
    // Get first artist (in real app, would filter by user)
    const artistDNA = await prisma.artistDNA.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!artistDNA) {
      return NextResponse.json(
        { success: false, error: 'Identity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: toArtistIdentity(artistDNA)
    })
  } catch (error) {
    console.error('GET /api/identity error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateIdentityInput = await request.json()

    // Validate input
    if (!body.artistName || !body.genre) {
      return NextResponse.json(
        { success: false, error: 'Artist name and genre are required' },
        { status: 400 }
      )
    }

    // Create new artist DNA
    const artistDNA = await prisma.artistDNA.create({
      data: {
        name: body.artistName,
        bio: body.biography || '',
        musicGenres: JSON.stringify([body.genre]),
        visualThemes: JSON.stringify(body.musicalFeatures || []),
        writingStyle: '',
        colorPalette: JSON.stringify([]),
        tone: 'friendly',
        emojiUsage: 'moderate',
        responseLength: 'medium',
        languagePreferences: JSON.stringify(['ja']),
        coreValues: JSON.stringify([]),
        artisticVision: '',
        fanRelationshipPhilosophy: ''
      }
    })

    return NextResponse.json({
      success: true,
      data: toArtistIdentity(artistDNA)
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/identity error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Partial<CreateIdentityInput> = await request.json()

    // Get first artist
    const existingArtist = await prisma.artistDNA.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!existingArtist) {
      return NextResponse.json(
        { success: false, error: 'Identity not found' },
        { status: 404 }
      )
    }

    // Update artist DNA
    const updatedArtist = await prisma.artistDNA.update({
      where: { id: existingArtist.id },
      data: {
        ...(body.artistName && { name: body.artistName }),
        ...(body.biography && { bio: body.biography }),
        ...(body.genre && { musicGenres: JSON.stringify([body.genre]) }),
        ...(body.musicalFeatures && { visualThemes: JSON.stringify(body.musicalFeatures) })
      }
    })

    return NextResponse.json({
      success: true,
      data: toArtistIdentity(updatedArtist)
    })
  } catch (error) {
    console.error('PUT /api/identity error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
