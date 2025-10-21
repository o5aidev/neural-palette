// Artist Identity Types
export interface ArtistIdentity {
  id: string
  artistName: string
  genre: string
  biography: string
  influences: string[]
  musicalFeatures: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateIdentityInput {
  artistName: string
  genre: string
  biography?: string
  influences?: string[]
  musicalFeatures?: string[]
}

export interface UpdateIdentityInput extends Partial<CreateIdentityInput> {
  id: string
}

// Content Types
export interface Content {
  id: string
  title: string
  type: 'audio' | 'video' | 'image' | 'text'
  status: 'draft' | 'published' | 'archived'
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

export interface ContentVersion {
  id: string
  contentId: string
  version: string
  description: string
  createdAt: Date
}

// AI Generation Types
export interface GenerationRequest {
  prompt: string
  type: 'melody' | 'lyrics' | 'chord' | 'artwork'
  mood?: string
  style?: string
}

export interface GenerationResult {
  id: string
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: any
  createdAt: Date
  completedAt?: Date
}

// Fan Interaction Types
export interface Conversation {
  id: string
  userId: string
  userName: string
  message: string
  reply?: string
  status: 'pending' | 'replied'
  createdAt: Date
  repliedAt?: Date
}

export interface EngagementStats {
  totalMessages: number
  activeUsers: number
  averageResponseTime: number
  responseRate: number
}

// Common API Response
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
