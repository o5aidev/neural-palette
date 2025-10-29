# Neural Palette - Design System v1.0

**最終更新**: 2025-10-22
**バージョン**: v1.0.0

---

## 📐 Design Philosophy

### Core Principles

1. **柔らかさと親しみやすさ** - 丸み(rounded-2xl)、柔らかい影、温かみのある絵文字アイコン
2. **一貫性** - 7つのダッシュボード全体で統一されたレイアウト原則
3. **情報階層の明確化** - グラデーション、影、余白による視覚的重み付け
4. **行動の最短化** - hover時のクイックアクション、ワンクリック操作
5. **ダークモード前提** - すべてのコンポーネントでdark mode対応

---

## 🎨 Design Tokens

### Color Palette

#### Primary (Blue)
```javascript
primary: {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',  // Main Primary
  600: '#0284c7',  // Primary-600 (gradient start)
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
}
```

#### Secondary (Purple)
```javascript
secondary: {
  50: '#fdf4ff',
  100: '#fae8ff',
  200: '#f5d0fe',
  300: '#f0abfc',
  400: '#e879f9',
  500: '#d946ef',  // Main Secondary
  600: '#c026d3',  // Secondary-600 (gradient end)
  700: '#a21caf',
  800: '#86198f',
  900: '#701a75',
}
```

#### Semantic Colors

**Success (Green)**
- `text-green-600 dark:text-green-400`
- Used for: Positive changes, published status

**Warning (Orange)**
- `text-orange-600 dark:text-orange-400`
- Used for: Warnings, critical items

**Error (Red)**
- `text-red-600 dark:text-red-400`
- Used for: Errors, negative changes

**Info (Blue)**
- `text-blue-600 dark:text-blue-400`
- Used for: Informational badges

---

## 🔤 Typography

### Font Family
- **Default**: System font stack (Inter, Segoe UI, Roboto, etc.)
- **Monospace**: For code/technical content

### Text Sizes & Weights

**Page Title**
```html
<h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
  Neural Palette
</h1>
```

**Section Title**
```html
<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
  最近のアクティビティ
</h2>
```

**Body Text**
```html
<p className="text-gray-600 dark:text-gray-400">
  Description text
</p>
```

**Small Text**
```html
<span className="text-sm text-gray-600 dark:text-gray-400">
  Metadata
</span>
```

---

## 📦 Component Patterns

### 1. KPI Card

**Purpose**: 主要指標の可視化

**Structure**:
```jsx
<div className="relative group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50">
  {/* Gradient Accent */}
  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity" />

  <div className="relative">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl">📦</span>
      <span className="text-sm font-medium text-green-600 dark:text-green-400">
        +12%
      </span>
    </div>
    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
      247
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400">
      総コンテンツ
    </div>
  </div>
</div>
```

**Grid Layout**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`

**Gradient Accent Colors**:
- Blue-Cyan: `from-blue-500 to-cyan-500`
- Purple-Pink: `from-purple-500 to-pink-500`
- Green-Emerald: `from-green-500 to-emerald-500`
- Orange-Amber: `from-orange-500 to-amber-500`

---

### 2. Section Card

**Purpose**: コンテンツセクションのグループ化

**Structure**:
```jsx
<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
  {/* Header */}
  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Section Title
      </h2>
      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
        すべて表示 →
      </button>
    </div>
  </div>

  {/* Content */}
  <div className="p-6">
    {/* ... */}
  </div>
</div>
```

---

### 3. List Item (Hover Actions)

**Purpose**: リストアイテムwith隠しアクション

**Structure**:
```jsx
<div className="group p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-700 transition-all">
  {/* Main Content */}
  <div className="flex-1">
    <h3 className="font-medium text-gray-900 dark:text-white">
      Item Title
    </h3>
    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
      Metadata
    </div>
  </div>

  {/* Hidden Actions */}
  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
      {/* Icon */}
    </button>
  </div>
</div>
```

---

### 4. Primary Button

**Purpose**: 主要アクション

**Structure**:
```jsx
<button className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex items-center gap-2">
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  新規作成
</button>
```

**Key Properties**:
- Gradient: `from-primary-600 to-primary-700`
- Shadow: `shadow-lg shadow-primary-500/30`
- Rounded: `rounded-xl`
- Hover: Scale or shadow increase

---

### 5. Badge

**Purpose**: ステータス、タグ表示

**Variants**:

**Primary Badge**
```jsx
<span className="px-3 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
  Label
</span>
```

**Success Badge**
```jsx
<span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
  公開中
</span>
```

**Neutral Badge**
```jsx
<span className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
  Tag
</span>
```

---

### 6. Empty State

**Purpose**: データなし時の表示

**Structure**:
```jsx
<div className="text-center py-16">
  <div className="text-6xl mb-4">🎨</div>
  <div className="text-gray-500 dark:text-gray-400 mb-2">
    まだ生成履歴がありません
  </div>
  <div className="text-sm text-gray-400 dark:text-gray-500">
    上のフォームから最初のAI生成を始めましょう!
  </div>
</div>
```

**Key Elements**:
- 大きな絵文字アイコン (text-6xl)
- 2段階メッセージ (title + description)
- 中央配置、余白広め(py-16)

---

## 📏 Spacing System

### Padding

- **Card**: `p-6` (24px)
- **Section**: `p-6` (24px)
- **List Item**: `p-5` (20px)
- **Button**: `px-6 py-2.5` (24px horizontal, 10px vertical)
- **Badge**: `px-3 py-1` (12px horizontal, 4px vertical)

### Gap

- **Grid (Cards)**: `gap-6` (24px)
- **Grid (Buttons)**: `gap-3` or `gap-4` (12-16px)
- **Flex (Inline)**: `gap-2` or `gap-3` (8-12px)

### Space-Y (Vertical Stacking)

- **Page Sections**: `space-y-6` (24px between sections)
- **List Items**: `space-y-3` or `space-y-4` (12-16px)

---

## 🔘 Border Radius

- **2xl (Extra Large)**: `rounded-2xl` (16px) - **デフォルト for cards**
- **xl (Large)**: `rounded-xl` (12px) - Buttons, list items
- **lg (Medium)**: `rounded-lg` (8px) - Small components
- **full (Circle)**: `rounded-full` - Badges, avatars

---

## 🌈 Gradient Usage

### Title Gradient
```css
.gradient-title {
  background: linear-gradient(to right, #0284c7, #c026d3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```
HTML: `bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent`

### Button Gradient
```css
.gradient-button {
  background: linear-gradient(to right, #0284c7, #0369a1);
}
.gradient-button:hover {
  background: linear-gradient(to-right, #0369a1, #075985);
}
```
HTML: `bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800`

### Accent Gradient
```css
.gradient-accent {
  background: linear-gradient(to bottom right, #3b82f6, #06b6d4);
  opacity: 0.1;
}
```
HTML: `bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10`

---

## 🎭 Hover & Interaction States

### Card Hover
```jsx
hover:border-gray-300 dark:hover:border-gray-700
hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50
```

### Button Hover
```jsx
hover:from-primary-700 hover:to-primary-800
hover:shadow-xl hover:shadow-primary-500/40
```

### List Item Hover
```jsx
hover:bg-gray-50 dark:hover:bg-gray-800
hover:border-primary-300 dark:hover:border-primary-700
```

### Hidden Actions (Group Hover)
```jsx
<div className="group">
  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
    {/* Actions */}
  </div>
</div>
```

### Scale Transform
```jsx
hover:scale-105 transition-all
```

---

## 🌓 Dark Mode

### Background Colors
- **Page**: `bg-gray-50 dark:bg-gray-950`
- **Card**: `bg-white dark:bg-gray-900`
- **Hover**: `hover:bg-gray-50 dark:hover:bg-gray-800`

### Border Colors
- **Default**: `border-gray-200 dark:border-gray-800`
- **Hover**: `hover:border-gray-300 dark:hover:border-gray-700`
- **Accent**: `border-primary-200 dark:border-primary-800`

### Text Colors
- **Primary**: `text-gray-900 dark:text-white`
- **Secondary**: `text-gray-600 dark:text-gray-400`
- **Tertiary**: `text-gray-500 dark:text-gray-500`

---

## 🎯 Layout Patterns

### Page Structure

```jsx
<DashboardLayout title="Page Title" description="Description">
  <div className="space-y-6">
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Neural Palette
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Description
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Actions */}
      </div>
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 4 KPI cards */}
    </div>

    {/* Main Content */}
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Section header + content */}
    </div>
  </div>
</DashboardLayout>
```

### Responsive Grid

**4-Column Grid**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* KPI cards */}
</div>
```

**2-Column Grid**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Content sections */}
</div>
```

**7-Column Grid (Sentiment)**
```jsx
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
  {/* Sentiment cards */}
</div>
```

---

## 🎨 Emoji Icon System

### Usage Guidelines

- **Size**: `text-2xl` (24px) for KPIs, `text-3xl` (30px) for section icons, `text-6xl` (60px) for empty states
- **Positioning**: Left-aligned in cards, centered in empty states
- **Context**: Use meaningful emojis that clearly represent the content

### Common Emojis

**Content Types**
- 📦 General Content
- 🎵 Music/Melody
- 📝 Text/Lyrics
- 🎹 Chords/Piano
- 🎨 Artwork/Design
- 🎧 Audio/Listening
- 🎚️ Mixing/Production
- 📊 Statistics/Charts

**Sentiment**
- 🎉 Excited
- 😊 Positive
- 😐 Neutral
- 😔 Negative
- 😠 Critical
- 🤔 Curious
- 💪 Supportive

**Actions**
- ✨ Generate/Create
- 🚀 Launch/Start
- 🤖 AI/Bot
- 🎯 Target/Accuracy
- ⚡ Speed/Energy
- 💬 Message/Chat
- 📊 Analytics

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind default breakpoints
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

### Common Responsive Patterns

**Flex Direction**
```jsx
<div className="flex flex-col md:flex-row">
```

**Grid Columns**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

**Text Size**
```jsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
```

---

## 🔧 Implementation Notes

### 1. Consistency is Key
すべてのページで同じパターンを使用:
- Header with gradient title + actions
- 4-column KPI grid
- Section cards with header + content
- Hover effects on list items

### 2. Dark Mode First
すべてのクラスで `dark:` variant を指定:
```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### 3. Group Hover Pattern
親要素に `group` クラス、子要素に `group-hover:` を使用:
```jsx
<div className="group">
  <div className="opacity-0 group-hover:opacity-100">
    Action Button
  </div>
</div>
```

### 4. Transition Always
すべてのインタラクティブ要素に `transition-all` を追加:
```jsx
<button className="... transition-all">
```

---

## 📚 Component Library (Future)

現在は実装されていないが、将来的に共通コンポーネントとして抽出すべき要素:

1. **KPICard** - KPI表示用カード
2. **SectionCard** - セクションコンテナ
3. **ListItem** - Hover actions付きリストアイテム
4. **PrimaryButton** - グラデーションボタン
5. **Badge** - ステータスバッジ
6. **EmptyState** - データなし表示
7. **PageHeader** - ページヘッダー

---

## 🚀 Next Steps

### Phase 1: 残りのページ実装
- Neural Identity
- Neural Publisher
- Neural Connector
- Neural Sentinel

### Phase 2: 共通コンポーネント抽出
- `components/ui/KPICard.tsx`
- `components/ui/SectionCard.tsx`
- `components/ui/ListItem.tsx`

### Phase 3: デザイントークンファイル
- `styles/tokens.css` - CSS custom properties
- `lib/design-tokens.ts` - TypeScript constants

---

**Author**: Miyabi Water Spider × Claude Code
**Date**: 2025-10-22
**Version**: v1.0.0
