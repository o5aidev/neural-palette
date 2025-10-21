import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { personalizedAI } from '@/src/services/personalized-ai.service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id

    // Get message
    const message = await prisma.fanMessage.findUnique({
      where: { id: messageId },
      include: {
        artist: true
      }
    })

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      )
    }

    // Check if response already exists
    if (message.aiResponse) {
      return NextResponse.json({
        success: true,
        data: {
          id: message.id,
          response: message.aiResponse,
          generatedAt: message.responseGeneratedAt
        }
      })
    }

    // Convert Prisma artist to ArtistDNA format
    const artistDNA = {
      id: message.artist.id,
      name: message.artist.name,
      bio: message.artist.bio,
      creativeStyle: {
        visualThemes: JSON.parse(message.artist.visualThemes || '[]') as string[],
        musicGenres: JSON.parse(message.artist.musicGenres || '[]') as string[],
        writingStyle: message.artist.writingStyle,
        colorPalette: JSON.parse(message.artist.colorPalette || '[]') as string[],
      },
      communicationStyle: {
        tone: message.artist.tone,
        emojiUsage: message.artist.emojiUsage,
        responseLength: message.artist.responseLength,
        languagePreferences: JSON.parse(message.artist.languagePreferences || '["ja"]') as string[],
      },
      values: {
        coreValues: JSON.parse(message.artist.coreValues || '[]') as string[],
        artisticVision: message.artist.artisticVision,
        fanRelationshipPhilosophy: message.artist.fanRelationshipPhilosophy,
      },
      milestones: [],
      createdAt: message.artist.createdAt,
      updatedAt: message.artist.updatedAt,
      version: message.artist.version
    }

    // Generate AI response
    const aiResponse = await personalizedAI.generateFanResponse(
      artistDNA,
      message.content,
      [],
      message.sentiment as any
    )

    // Update message with response
    const updatedMessage = await prisma.fanMessage.update({
      where: { id: messageId },
      data: {
        aiResponse: aiResponse.content,
        responseGeneratedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedMessage.id,
        response: updatedMessage.aiResponse,
        generatedAt: updatedMessage.responseGeneratedAt,
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        confidence: aiResponse.confidence
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
