# 🌸 Neural Palette

**自己進化型ファン共創プラットフォーム**

アーティストとファンが共に成長する、AI駆動の次世代音楽プラットフォーム

---

## 📖 概要

Neural Paletteは、アーティストの「魂」を定義し、ファンとの深い絆を育む革新的なプラットフォームです。

### コアコンセプト

1. **Neural Identity** - アーティストDNA定義システム
2. **Neural Palette** - 制作支援・コンテンツ管理
3. **Neural Publisher** - 配信管理（予定）
4. **Neural Connector** - SNS連携（予定）
5. **Neural Sentinel** - 権利保護（予定）

---

## 🎯 Phase 1 完了状況

### ✅ 実装済み機能

#### Neural Identity（DNA定義システム）
- ✅ アーティストプロフィール管理
- ✅ 創作スタイル定義
- ✅ コミュニケーションスタイル
- ✅ 価値観・哲学
- ✅ マイルストーン（活動履歴）管理

#### Neural Palette（制作支援システム）
- ✅ コンテンツ管理（楽曲、アルバム、動画、アート等）
- ✅ メディアファイル管理
- ✅ コラボレーター管理
- ✅ タグ・カテゴリ分類
- ✅ フィルター検索機能

#### 技術スタック
- ✅ TypeScript（strict mode）
- ✅ 型安全なAPI設計
- ✅ 包括的バリデーション
- ✅ インメモリストレージ（Phase 1）
- ✅ 単体テスト（45 tests, 70%+ coverage）
- ✅ Vitest テスティングフレームワーク

---

## 🚀 Phase 2 準備中

### データベース統合
- ✅ Prisma ORM セットアップ
- ✅ SQLite（開発用）スキーマ設計
- ✅ マイグレーション生成
- ⏳ ストレージ層のデータベース移行
- ⏳ トランザクション対応

### 追加機能（予定）
- ⏳ Neural Publisher（配信管理）
- ⏳ Neural Connector（SNS連携）
- ⏳ Neural Sentinel（権利保護）
- ⏳ ファイルアップロード（クラウドストレージ）
- ⏳ リアルタイム通知
- ⏳ 分析・レポート機能

---

## 🛠️ 開発環境セットアップ

### 必要環境
- Node.js 18+
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/o5aidev/neural-palette.git
cd neural-palette

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env
# .env ファイルを編集（必要に応じて）

# データベースのマイグレーション（Phase 2）
npx prisma migrate dev

# Prisma Clientを生成
npx prisma generate
```

### 開発コマンド

```bash
# デモアプリを実行
npm run dev

# テストを実行
npm test                    # ウォッチモード
npm run test:run            # 1回実行
npm run test:coverage       # カバレッジ付き
npm run test:ui             # UIモード

# ビルド
npm run build

# 型チェック
npm run typecheck

# リント
npm run lint
```

---

## 📁 プロジェクト構造

```
neural-palette/
├── prisma/
│   ├── schema.prisma          # データベーススキーマ
│   └── migrations/            # マイグレーション履歴
│
├── src/
│   ├── types/                 # 型定義
│   │   ├── neural-identity.ts
│   │   └── neural-palette.ts
│   │
│   ├── validation/            # バリデーション
│   │   ├── neural-identity.validator.ts
│   │   ├── neural-palette.validator.ts
│   │   └── __tests__/
│   │
│   ├── storage/               # データ永続化層
│   │   ├── neural-identity.storage.ts
│   │   ├── neural-palette.storage.ts
│   │   └── __tests__/
│   │
│   ├── api/                   # API層
│   │   ├── neural-identity.api.ts
│   │   ├── neural-palette.api.ts
│   │   └── __tests__/
│   │
│   ├── generated/             # 自動生成ファイル
│   │   └── prisma/            # Prisma Client
│   │
│   └── index.ts               # デモアプリケーション
│
├── tests/                     # 統合テスト（将来用）
├── .env.example               # 環境変数テンプレート
├── vitest.config.ts           # Vitest設定
├── tsconfig.json              # TypeScript設定
└── package.json
```

---

## 🧪 テスト

### テスト構成

- **Validator テスト**: 16 tests
- **Storage テスト**: 16 tests
- **API テスト**: 13 tests

**合計**: 45 tests, 70%+ coverage

### テスト実行

```bash
# 全テスト実行
npm test

# カバレッジ確認
npm run test:coverage

# UIでテスト
npm run test:ui
```

---

## 🎨 デモアプリケーション

統合デモが用意されています：

```bash
npm run dev
```

### デモ内容

**Part 1: Neural Identity**
1. アーティスト作成
2. プロフィール取得
3. 情報更新
4. 名前検索
5. 全アーティスト取得
6. 削除
7. 削除確認

**Part 2: Neural Palette**
1. 新規アーティスト作成
2. コンテンツ作成（楽曲）
3. コンテンツ取得
4. コンテンツ更新
5. アーティスト別検索
6. フィルター検索（タグ）
7. コンテンツ削除
8. クリーンアップ

---

## 📚 API ドキュメント

### Neural Identity API

```typescript
// アーティスト作成
await createArtistDNA(input: CreateArtistDNAInput): Promise<ApiResponse<ArtistDNA>>

// アーティスト取得
await getArtistDNAById(id: string): Promise<ApiResponse<ArtistDNA | null>>
await getAllArtistDNA(): Promise<ApiResponse<ArtistDNA[]>>
await searchArtistDNAByName(name: string): Promise<ApiResponse<ArtistDNA[]>>

// アーティスト更新・削除
await updateArtistDNA(id: string, input: UpdateArtistDNAInput): Promise<ApiResponse<ArtistDNA>>
await deleteArtistDNA(id: string): Promise<ApiResponse<{ deleted: boolean }>>
```

### Neural Palette API

```typescript
// コンテンツ作成
await createContent(input: CreateContentInput): Promise<ApiResponse<Content>>

// コンテンツ取得
await getContentById(id: string): Promise<ApiResponse<Content | null>>
await getAllContent(): Promise<ApiResponse<Content[]>>
await getContentByArtistId(artistId: string): Promise<ApiResponse<Content[]>>
await searchContent(filter: ContentFilter): Promise<ApiResponse<Content[]>>

// コンテンツ更新・削除
await updateContent(id: string, input: UpdateContentInput): Promise<ApiResponse<Content>>
await deleteContent(id: string): Promise<ApiResponse<{ deleted: boolean }>>
await deleteContentByArtistId(artistId: string): Promise<ApiResponse<{ deletedCount: number }>>
```

---

## 🔒 データモデル

### ArtistDNA

```typescript
interface ArtistDNA {
  id: string
  name: string
  bio: string
  creativeStyle: CreativeStyle
  communicationStyle: CommunicationStyle
  values: Values
  milestones: Milestone[]
  createdAt: Date
  updatedAt: Date
  version: number
}
```

### Content

```typescript
interface Content {
  id: string
  artistId: string
  title: string
  description: string
  type: ContentType  // 'song' | 'album' | 'video' | 'artwork' | 'post' | 'other'
  status: ContentStatus  // 'draft' | 'in_progress' | 'review' | 'published' | 'archived'
  tags: Tag[]
  mediaFiles: MediaFile[]
  collaborators: Collaborator[]
  metadata: ContentMetadata
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  version: number
}
```

---

## 🤝 コントリビューション

現在Phase 1完了、Phase 2準備中です。

### 開発ワークフロー

1. Issueを作成
2. ブランチを作成（`feature/your-feature`）
3. 実装 + テスト
4. PRを作成
5. レビュー
6. マージ

---

## 📝 ライセンス

MIT License

---

## 🌟 開発者

**Miyabi Framework × Claude Code**

自律型AI開発フレームワークによって構築されました。

---

## 🔗 リンク

- [GitHub Repository](https://github.com/o5aidev/neural-palette)
- [Issue Tracker](https://github.com/o5aidev/neural-palette/issues)
- [Pull Requests](https://github.com/o5aidev/neural-palette/pulls)

---

**🎉 Phase 1 Complete! Phase 2 Coming Soon...**
