# Neural Palette - 使用方法ガイド

**バージョン**: v1.0.0
**最終更新**: 2025-10-22
**対象**: 5人未満のプライベート利用

---

## 📋 目次

1. [起動方法](#起動方法)
2. [アクセス方法](#アクセス方法)
3. [他の人と共有する方法](#他の人と共有する方法)
4. [各ダッシュボードの使い方](#各ダッシュボードの使い方)
5. [データ管理](#データ管理)
6. [トラブルシューティング](#トラブルシューティング)

---

## 🚀 起動方法

### 毎日の起動手順

**1. ターミナル（Terminal.app）を開く**

Macの場合: `アプリケーション` → `ユーティリティ` → `ターミナル`

**2. プロジェクトフォルダに移動**

```bash
cd /Users/watanabekazki/Documents/neural-palette
```

**3. アプリケーションを起動**

```bash
npm run dev
```

**4. 起動完了の確認**

以下のようなメッセージが表示されたら成功：

```
  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

---

## 🌐 アクセス方法

### あなた自身がアクセスする場合

ブラウザ（Chrome, Safari, Firefox等）で以下のURLを開く：

```
http://localhost:3000
```

**利用可能なページ**:

| ページ | URL | 説明 |
|--------|-----|------|
| ホーム | http://localhost:3000 | トップページ |
| Neural Identity | http://localhost:3000/dashboard/identity | アーティストDNA管理 |
| Neural Palette | http://localhost:3000/dashboard/palette | コンテンツ管理 |
| Neural Muse | http://localhost:3000/dashboard/muse | AI創作支援 |
| Neural Echo | http://localhost:3000/dashboard/echo | ファンインタラクション |
| Neural Publisher | http://localhost:3000/dashboard/publisher | 配信管理 |
| Neural Connector | http://localhost:3000/dashboard/connector | SNS連携 |
| Neural Sentinel | http://localhost:3000/dashboard/sentinel | 権利保護 |

---

## 👥 他の人と共有する方法

### 同じネットワーク内の人にアクセスさせる

**ステップ1: あなたのIPアドレスを確認**

ターミナルで以下を実行：

```bash
# Macの場合
ipconfig getifaddr en0

# Windowsの場合
ipconfig | findstr IPv4
```

例: `192.168.1.100` のような数字が表示される

**ステップ2: 他の人に共有**

以下のURLを伝える：

```
http://192.168.1.100:3000
```

**注意事項**:
- ✅ 同じWi-Fi（自宅ネットワーク）に接続している必要があります
- ✅ あなたのPCが起動してアプリが実行中の間のみ利用可能
- ⚠️ あなたのPCをスリープ・シャットダウンすると利用不可

---

## 🛑 停止方法

ターミナルでアプリが実行中の画面にて：

```
Ctrl + C を押す
```

確認メッセージが出たら `Y` を入力してEnter

---

## 🎨 各ダッシュボードの使い方

### 1. Neural Identity（アーティストDNA管理）

**URL**: http://localhost:3000/dashboard/identity

**機能**:
- アーティストプロフィール作成・編集
- 創作スタイル設定（視覚テーマ、音楽ジャンル、カラーパレット）
- コミュニケーションスタイル設定（トーン、絵文字使用頻度）
- 価値観・哲学の定義

**基本操作**:
1. "Create Artist DNA" ボタンをクリック
2. フォームに必要情報を入力
3. "Save" で保存

---

### 2. Neural Palette（コンテンツ管理）

**URL**: http://localhost:3000/dashboard/palette

**機能**:
- 楽曲、アルバム、動画、アートワークの管理
- メディアファイルのアップロード（予定）
- タグ・カテゴリ分類
- コラボレーター管理

**基本操作**:
1. "Add Content" ボタン
2. タイトル、説明、タイプ（song/album/video/artwork）を入力
3. "Create" で作成

---

### 3. Neural Muse（AI創作支援）

**URL**: http://localhost:3000/dashboard/muse

**機能**:
- AI による歌詞生成
- メロディアイデア生成
- アートワークコンセプト提案
- 創作セッション履歴管理

**基本操作**:
1. 創作タイプを選択（lyrics/melody/artwork/concept）
2. プロンプト（指示）を入力
3. "Generate" でAI生成実行

**注意**: OpenAI APIキーまたはAnthropic APIキーが必要です

---

### 4. Neural Echo（ファンインタラクション）

**URL**: http://localhost:3000/dashboard/echo

**機能**:
- ファンメッセージ管理
- 感情分析（Excited/Positive/Neutral/Negative等）
- AI応答生成
- エンゲージメント統計

**基本操作**:
1. メッセージ一覧を確認
2. メッセージをクリックして詳細表示
3. "Generate AI Response" で返信案を生成

---

### 5. Neural Publisher（配信管理）

**URL**: http://localhost:3000/dashboard/publisher

**機能**:
- 配信プラットフォーム管理（Spotify, Apple Music, YouTube等）
- リリーススケジュール
- 配信統計表示

---

### 6. Neural Connector（SNS連携）

**URL**: http://localhost:3000/dashboard/connector

**機能**:
- SNSアカウント連携（Twitter, Instagram, TikTok等）
- クロスプラットフォーム投稿（予定）
- エンゲージメント統計

---

### 7. Neural Sentinel（権利保護）

**URL**: http://localhost:3000/dashboard/sentinel

**機能**:
- 著作権・商標管理
- 侵害検出・監視（予定）
- 権利保護統計

---

## 💾 データ管理

### データの保存場所

すべてのデータは以下のSQLiteデータベースに保存されます：

```
/Users/watanabekazki/Documents/neural-palette/dev.db
```

### バックアップ方法

**推奨頻度**: 週1回

```bash
# プロジェクトフォルダで実行
cd /Users/watanabekazki/Documents/neural-palette

# 日付付きバックアップ作成
cp dev.db "backups/dev.db.$(date +%Y%m%d).backup"
```

### データの復元

```bash
# バックアップから復元
cp backups/dev.db.20251022.backup dev.db
```

---

## 🔧 トラブルシューティング

### 問題1: アプリが起動しない

**エラー**: `command not found: npm`

**解決策**:
```bash
# Node.jsがインストールされているか確認
node -v

# インストールされていない場合
# https://nodejs.org/ からインストール
```

---

### 問題2: ポート3000が既に使用中

**エラー**: `Port 3000 is already in use`

**解決策**:
```bash
# 既存のプロセスを確認
lsof -i :3000

# プロセスを停止
kill -9 <PID>

# または別のポートで起動
PORT=3001 npm run dev
```

---

### 問題3: データベースエラー

**エラー**: `Prisma Client initialization failed`

**解決策**:
```bash
# Prisma Clientを再生成
npx prisma generate

# データベースをリセット（注意: データが消えます）
npx prisma db push --force-reset
```

---

### 問題4: 他の人がアクセスできない

**チェックリスト**:
- [ ] あなたのPCでアプリが起動しているか確認
- [ ] 同じWi-Fiネットワークに接続しているか確認
- [ ] IPアドレスが正しいか確認（`ipconfig getifaddr en0`）
- [ ] ファイアウォール設定を確認

**Macのファイアウォール設定**:
1. システム設定 → ネットワーク → ファイアウォール
2. "Node" または "npm" を許可

---

### 問題5: AI機能が動作しない

**エラー**: `API key not found`

**解決策**:
```bash
# .envファイルを確認
cat .env

# 以下の行が含まれているか確認
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# なければ追加
echo "OPENAI_API_KEY=your_key_here" >> .env
```

---

## 📞 サポート

### よくある質問

**Q: インターネット接続は必要ですか？**
A: ローカル利用のみなら不要です。ただしAI機能（Neural Muse）を使う場合は必要です。

**Q: 複数人が同時にアクセスできますか？**
A: はい、可能です。同じネットワーク内なら何人でも同時アクセス可能です。

**Q: データは安全ですか？**
A: ローカルPC内のみに保存されるため、外部に漏れることはありません。

**Q: 将来的に一般公開したくなったら？**
A: Vercelなどのクラウドにデプロイすることで公開可能です。（詳細はREADME.md参照）

---

## 🔄 定期メンテナンス

### 週1回

- [ ] データベースバックアップ
- [ ] ディスク容量確認

### 月1回

- [ ] 依存関係の更新確認
  ```bash
  npm outdated
  ```

- [ ] セキュリティチェック
  ```bash
  npm audit
  ```

---

## 📚 関連ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - システムアーキテクチャ
- [CHANGELOG.md](./CHANGELOG.md) - 変更履歴

---

## 🎉 楽しんでください！

Neural Paletteを使って、素晴らしい創作活動をお楽しみください！

---

**作成日**: 2025-10-22
**バージョン**: v1.0.0
🌸 Generated by Miyabi Water Spider × Claude Code
