import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { personalizedAI } from '@/src/services/personalized-ai.service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id

    // Get message with thread and artist
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        thread: {
          include: {
            artist: true
          }
        }
      }
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    // Check if AI response already exists in the thread
    const existingResponse = await prisma.message.findFirst({
      where: {
        threadId: message.threadId,
        role: 'ai'
      },
      orderBy: {
        timestamp: 'desc'
      }
    })

    if (existingResponse) {
      return NextResponse.json({
        success: true,
        data: {
          id: existingResponse.id,
          response: existingResponse.content,
          generatedAt: existingResponse.timestamp,
          model: existingResponse.model,
          tokensUsed: existingResponse.tokensUsed
        }
      })
    }

    // Convert Prisma artist to ArtistDNA format
    const artist = message.thread.artist
    const artistDNA = {
      id: artist.id,
      name: artist.name,
      bio: artist.bio,
      creativeStyle: {
        visualThemes: JSON.parse(artist.visualThemes || '[]') as string[],
        musicGenres: JSON.parse(artist.musicGenres || '[]') as string[],
        writingStyle: artist.writingStyle,
        colorPalette: JSON.parse(artist.colorPalette || '[]') as string[],
      },
      communicationStyle: {
        tone: artist.tone as 'friendly' | 'professional' | 'casual' | 'inspiring',
        emojiUsage: artist.emojiUsage as 'high' | 'medium' | 'low',
        responseLength: artist.responseLength as 'brief' | 'moderate' | 'detailed',
        languagePreferences: JSON.parse(artist.languagePreferences || '["ja"]') as string[],
      },
      values: {
        coreValues: JSON.parse(artist.coreValues || '[]') as string[],
        artisticVision: artist.artisticVision,
        fanRelationshipPhilosophy: artist.fanRelationshipPhilosophy,
      },
      milestones: [],
      createdAt: artist.createdAt,
      updatedAt: artist.updatedAt,
      version: artist.version
    }

    // Generate AI response
    const aiResponse = await personalizedAI.generateFanResponse(
      artistDNA,
      message.content,
      [],
      message.sentiment as any
    )

    // Create AI response message
    const responseMessage = await prisma.message.create({
      data: {
        threadId: message.threadId,
        role: 'ai',
        content: aiResponse.content,
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        confidence: aiResponse.confidence
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: responseMessage.id,
        response: responseMessage.content,
        generatedAt: responseMessage.timestamp,
        model: responseMessage.model,
        tokensUsed: responseMessage.tokensUsed,
        confidence: responseMessage.confidence
      }
    })
  } catch (error) {
    console.error('POST /api/echo/messages/[id]/response error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
