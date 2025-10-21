import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface GenerateRequest {
  prompt: string
  type: 'melody' | 'lyrics' | 'chord' | 'artwork'
  mood?: string
  style?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    // Validate input
    if (!body.prompt || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Prompt and type are required' },
        { status: 400 }
      )
    }

    // Get first artist
    const artist = await prisma.artistDNA.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!artist) {
      return NextResponse.json(
        { success: false, error: 'Artist not found. Create an identity first.' },
        { status: 404 }
      )
    }

    // Create or get active session
    let session = await prisma.creativeSession.findFirst({
      where: {
        artistId: artist.id,
        status: 'active'
      },
      orderBy: { lastActiveAt: 'desc' }
    })

    if (!session) {
      session = await prisma.creativeSession.create({
        data: {
          artistId: artist.id,
          title: `${body.type} Generation`,
          type: body.type,
          status: 'active',
          defaultParams: JSON.stringify({
            mood: body.mood,
            style: body.style
          })
        }
      })
    }

    // Simulate AI generation (replace with real AI service)
    const simulatedResult = generateMockResult(body.type, body.prompt, body.mood)

    // Save generation result
    const result = await prisma.generationResult.create({
      data: {
        sessionId: session.id,
        type: body.type,
        prompt: body.prompt,
        result: simulatedResult,
        params: JSON.stringify({
          mood: body.mood,
          style: body.style
        }),
        tokensUsed: Math.floor(Math.random() * 500) + 100,
        model: 'gpt-4',
        confidence: Math.floor(Math.random() * 30) + 70
      }
    })

    // Update session stats
    await prisma.creativeSession.update({
      where: { id: session.id },
      data: {
        totalGenerations: { increment: 1 },
        lastActiveAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        sessionId: result.sessionId,
        type: result.type,
        prompt: result.prompt,
        result: result.result,
        tokensUsed: result.tokensUsed,
        model: result.model,
        confidence: result.confidence,
        generatedAt: result.generatedAt
      }
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/muse/generate error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock result generator (replace with real AI)
function generateMockResult(type: string, prompt: string, mood?: string): string {
  const moodText = mood ? ` (${mood}な雰囲気で)` : ''

  switch (type) {
    case 'lyrics':
      return `[AI生成歌詞]\n\n${prompt}をテーマに${moodText}：\n\n静かな夜に　君を想う\n遠い記憶が　蘇る\n二人で歩いた　あの道を\n今はひとりで　辿ってる\n\n※サンプル生成結果です`

    case 'melody':
      return `[メロディアイデア]\n\nキー: C Major\nテンポ: 80 BPM\nコード進行: C - Am - F - G\n\nメロディライン:\nC-E-G-E-C-D-E-F-E-D-C\n\n${moodText}な雰囲気に合わせた構成\n※サンプル生成結果です`

    case 'chord':
      return `[コード進行]\n\nKey: G Major\nProgression: G - Em - C - D\n\nVariation 1: G - Em7 - Cadd9 - D7\nVariation 2: G - Em - Am7 - D\n\n${moodText}※サンプル生成結果です`

    case 'artwork':
      return `[アートワークコンセプト]\n\n${prompt}${moodText}\n\nカラーパレット:\n- メイン: #4A90E2 (青)\n- サブ: #F5A623 (オレンジ)\n- アクセント: #BD10E0 (紫)\n\nコンセプト: 夏の夕暮れをイメージした抽象的なグラデーション\n※サンプル生成結果です`

    default:
      return `[AI生成結果]\n\n${prompt}${moodText}\n\n※サンプル生成結果です`
  }
}
