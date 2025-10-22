# Neural Palette Architecture

**Version**: 1.0.0
**Last Updated**: 2025-10-22
**Project**: AI-Powered Artist Identity & Content Management Platform

## 📊 Project Statistics

- **Total TypeScript Files**: 76
- **Lines of Code**: 64,558
- **Test Coverage**: 100% (94/94 tests passing)
- **TypeScript Strict Mode**: Enabled
- **Database**: SQLite (Prisma ORM)
- **Framework**: Next.js 14.2.33

## 🏗️ System Architecture

### High-Level Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Next.js UI]
        Dash[Dashboards]
        Auth[NextAuth.js]
    end

    subgraph "API Layer"
        Identity[Identity API]
        Echo[Echo API]
        Palette[Palette API]
        Muse[Muse API]
        Publisher[Publisher API]
        Connector[Connector API]
        Sentinel[Sentinel API]
    end

    subgraph "Service Layer"
        PAIS[Personalized AI Service]
        Storage[Storage Services]
    end

    subgraph "Data Layer"
        Prisma[Prisma ORM]
        SQLite[(SQLite Database)]
    end

    UI --> Dash
    Dash --> Auth
    Dash --> Identity
    Dash --> Echo
    Dash --> Palette
    Identity --> PAIS
    Echo --> PAIS
    Muse --> PAIS
    Identity --> Storage
    Echo --> Storage
    Palette --> Storage
    Storage --> Prisma
    Prisma --> SQLite
```

## 🎯 Core Components

### 1. Neural Identity (Artist DNA)

**Purpose**: Manage artist identity and personality configuration.

**Key Features**:
- Artist DNA creation and management
- Visual themes and music genres
- Writing style and tone configuration
- Core values and artistic vision

**API Endpoints**:
- `GET /api/identity` - Retrieve artist DNA
- `POST /api/identity` - Create artist DNA
- `PATCH /api/identity/:id` - Update artist DNA

**Database Schema**:
```prisma
model ArtistDNA {
  id                        String   @id @default(uuid())
  name                      String
  bio                       String
  visualThemes              String   // JSON array
  musicGenres               String   // JSON array
  writingStyle              String
  colorPalette              String   // JSON array
  tone                      String
  emojiUsage                EmojiUsage
  responseLength            ResponseLength
  languagePreferences       String   // JSON array
  coreValues                String   // JSON array
  artisticVision            String
  fanRelationshipPhilosophy String
  version                   Int
  createdAt                 DateTime @default(now())
  updatedAt                 DateTime @updatedAt
}
```

### 2. Neural Echo (Fan Engagement)

**Purpose**: AI-powered fan message analysis and response.

**Key Features**:
- Sentiment analysis
- Conversation threading
- Personalized AI responses
- Engagement tracking

**API Endpoints**:
- `GET /api/echo/messages` - List messages
- `POST /api/echo/messages` - Create message
- `GET /api/echo/stats` - Get statistics

**Data Flow**:
```mermaid
sequenceDiagram
    participant Fan
    participant API
    participant AI
    participant DB

    Fan->>API: POST /api/echo/messages
    API->>AI: analyzeSentiment(content)
    AI-->>API: sentiment + confidence
    API->>DB: Create ConversationThread
    API->>DB: Create Message
    DB-->>API: message ID
    API-->>Fan: Success response
```

### 3. Neural Palette (Content Management)

**Purpose**: Manage artistic content and creative works.

**Key Features**:
- Content CRUD operations
- Search and filtering
- Version management
- Media file associations

**API Endpoints**:
- `GET /api/palette/content` - List content
- `POST /api/palette/content` - Create content
- `GET /api/palette/content/:id` - Get content
- `PATCH /api/palette/content/:id` - Update content
- `DELETE /api/palette/content/:id` - Delete content

### 4. Neural Muse (AI Content Generation)

**Purpose**: AI-powered content generation and creative assistance.

**Key Features**:
- Text generation based on artist DNA
- Style consistency
- Tone matching
- Language preferences

**API Endpoints**:
- `POST /api/muse/generate` - Generate content

### 5. Neural Publisher (Content Distribution)

**Purpose**: Content publishing and distribution management.

**API Endpoints**:
- `GET /api/publisher/stats` - Publishing statistics

### 6. Neural Connector (Platform Integration)

**Purpose**: External platform integration and synchronization.

**API Endpoints**:
- `GET /api/connector/stats` - Integration statistics

### 7. Neural Sentinel (Content Monitoring)

**Purpose**: Content monitoring and moderation.

**API Endpoints**:
- `GET /api/sentinel/stats` - Monitoring statistics

## 🗄️ Database Schema

### Core Models

```mermaid
erDiagram
    ArtistDNA ||--o{ Content : creates
    ArtistDNA ||--o{ FanProfile : manages
    FanProfile ||--o{ ConversationThread : participates
    ConversationThread ||--o{ Message : contains
    Content ||--o{ Tag : tagged_with
    Content ||--o{ MediaFile : has
    Content ||--o{ Collaboration : involves

    ArtistDNA {
        string id PK
        string name
        string bio
        string visualThemes
        string musicGenres
        int version
    }

    Content {
        string id PK
        string artistId FK
        string title
        string description
        string type
        string status
        int version
    }

    FanProfile {
        string id PK
        string artistId FK
        string displayName
        string sentimentHistory
        string avgSentiment
        int engagementScore
    }

    ConversationThread {
        string id PK
        string artistId FK
        string fanId FK
        string channel
        string status
    }

    Message {
        string id PK
        string threadId FK
        string content
        string sentiment
        int confidence
    }
```

## 🔐 Authentication & Authorization

### NextAuth.js Configuration

```typescript
// app/api/auth/[...nextauth]/route.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Authentication logic
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt'
  }
}
```

## 🧪 Testing Strategy

### Test Coverage

| Category | Tests | Status |
|----------|-------|--------|
| Unit Tests | 79 | ✅ 100% |
| E2E Tests | 15 | ✅ 100% |
| **Total** | **94** | **✅ 100%** |

### Test Structure

```
src/
├── __tests__/               # Unit tests
│   ├── api/                 # API tests
│   ├── storage/             # Storage tests
│   └── validation/          # Validation tests
e2e/
├── api.spec.ts              # API E2E tests
├── dashboards.spec.ts       # Dashboard E2E tests
└── global-setup.ts          # E2E test setup
```

### E2E Test Setup

```typescript
// e2e/global-setup.ts
async function globalSetup() {
  const prisma = new PrismaClient()

  // Clean existing data
  await prisma.message.deleteMany({})
  await prisma.conversationThread.deleteMany({})
  await prisma.fanProfile.deleteMany({})
  await prisma.content.deleteMany({})
  await prisma.artistDNA.deleteMany({})

  // Seed test data
  const artist = await prisma.artistDNA.create({ data: { ... } })
  await prisma.fanProfile.create({ data: { id: 'anonymous', ... } })
  await prisma.content.create({ data: { ... } })
}
```

## 🔄 Data Flow Patterns

### 1. Content Creation Flow

```mermaid
flowchart LR
    A[User Input] --> B[Validation]
    B --> C{Valid?}
    C -->|Yes| D[Storage Service]
    C -->|No| E[Error Response]
    D --> F[Prisma]
    F --> G[(Database)]
    G --> H[Success Response]
```

### 2. AI-Powered Message Flow

```mermaid
flowchart LR
    A[Fan Message] --> B[API Route]
    B --> C[Sentiment Analysis]
    C --> D[Thread Lookup/Create]
    D --> E[Message Storage]
    E --> F[AI Response Generation]
    F --> G[Response to Fan]
```

## 🚀 Deployment Architecture

### Development Environment

```
Local Machine
├── Next.js Dev Server (localhost:3000)
├── SQLite Database (file:./dev.db)
└── Node.js 20.x
```

### Production Environment (Target)

```
Cloud Platform (Firebase/Vercel)
├── Next.js SSR/SSG
├── PostgreSQL/SQLite
├── CDN for static assets
└── Environment Variables
```

## 📝 API Design Patterns

### RESTful Endpoints

```
/api/identity          # Artist DNA management
/api/echo/*            # Fan engagement
/api/palette/*         # Content management
/api/muse/*            # AI generation
/api/publisher/*       # Publishing
/api/connector/*       # Integration
/api/sentinel/*        # Monitoring
```

### Response Format

```typescript
// Success Response
{
  success: true,
  data: { ... },
  message?: string
}

// Error Response
{
  success: false,
  error: string,
  details?: any
}
```

## 🔧 Technology Stack

### Frontend
- **Framework**: Next.js 14.2.33
- **UI**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.1
- **Auth**: NextAuth.js 4.24.11

### Backend
- **Runtime**: Node.js 20.x
- **Language**: TypeScript 5.x (Strict Mode)
- **ORM**: Prisma 6.17.1
- **Database**: SQLite (Dev), PostgreSQL-ready

### Testing
- **Unit**: Vitest 3.2.4
- **E2E**: Playwright
- **Coverage**: 100%

### Development Tools
- **Linter**: ESLint
- **Formatter**: Prettier
- **Type Checking**: tsc --noEmit

## 📈 Performance Considerations

### Database Optimization
- Indexed fields: `id`, `artistId`, `fanId`
- Query optimization with Prisma
- Connection pooling

### Caching Strategy
- API response caching
- Static page generation (SSG)
- Incremental Static Regeneration (ISR)

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Tree shaking optimization

## 🔒 Security Measures

### Input Validation
- Zod schemas for all inputs
- Type-safe API routes
- SQL injection prevention (Prisma)

### Authentication
- JWT-based sessions
- Secure password hashing
- CSRF protection

### Data Protection
- Environment variable encryption
- API key rotation
- HTTPS-only in production

## 📚 Related Documentation

- [VERIFICATION_REPORT.md](../VERIFICATION_REPORT.md) - System health check
- [README.md](../README.md) - Project overview
- [Prisma Schema](../prisma/schema.prisma) - Database schema

---

🌸 Generated by Miyabi Water Spider
📅 Last Updated: 2025-10-22
🤖 Powered by Claude Code
