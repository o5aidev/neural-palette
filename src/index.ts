/**
 * Neural Palette - Demo Application
 *
 * Neural Identity (DNA定義システム) と Neural Palette (制作支援システム) のデモンストレーション
 */

import {
  createArtistDNA,
  getAllArtistDNA,
  getArtistDNAById,
  searchArtistDNAByName,
  updateArtistDNA,
  deleteArtistDNA,
} from './api/neural-identity.api.js';
import {
  createContent,
  getContentById,
  getAllContent,
  getContentByArtistId,
  searchContent,
  updateContent,
  deleteContent,
} from './api/neural-palette.api.js';
import type { CreateArtistDNAInput } from './types/neural-identity.js';
import type { CreateContentInput } from './types/neural-palette.js';

/**
 * サンプルアーティストDNAデータ
 */
const sampleArtistData: CreateArtistDNAInput = {
  name: 'Luna Starlight',
  bio: 'ポップとエレクトロニカを融合させた革新的なサウンドで、世界中のファンを魅了するアーティスト',
  creativeStyle: {
    visualThemes: ['宇宙', '光', 'ネオン', '未来都市'],
    musicGenres: ['エレクトロポップ', 'シンセウェーブ', 'フューチャーベース'],
    writingStyle: 'ポエティックで感情的、希望に満ちたメッセージ',
    colorPalette: ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B'],
  },
  communicationStyle: {
    tone: 'inspiring',
    emojiUsage: 'high',
    responseLength: 'moderate',
    languagePreferences: ['日本語', '英語'],
  },
  values: {
    coreValues: ['創造性', '共感', '進化', 'コミュニティ'],
    artisticVision: '音楽を通じて人々の心を繋ぎ、希望と勇気を届ける',
    fanRelationshipPhilosophy: 'ファンは単なる聴衆ではなく、共に成長する運命共同体',
  },
  milestones: [
    {
      id: 'milestone_1',
      date: new Date('2023-03-15'),
      title: 'デビューアルバム "Cosmic Dreams" リリース',
      description: '初のフルアルバムが全世界で50万枚を突破',
      type: 'release',
      significance: 10,
    },
    {
      id: 'milestone_2',
      date: new Date('2023-09-20'),
      title: '武道館ライブ成功',
      description: '1万人のファンと共に感動の一夜を創り上げた',
      type: 'concert',
      significance: 9,
    },
  ],
};

/**
 * デモアプリケーション
 */
async function main() {
  console.log('🌸 Neural Palette - Neural Identity Demo\n');

  // 1. ArtistDNAを作成
  console.log('📝 Step 1: Creating Artist DNA...');
  const createResult = await createArtistDNA(sampleArtistData);
  if (!createResult.success || !createResult.data) {
    console.error('❌ Failed to create:', createResult.error);
    return;
  }
  console.log('✅ Artist Created:', createResult.data.name);
  console.log('   ID:', createResult.data.id);
  console.log('   Version:', createResult.data.version);
  console.log();

  const artistId = createResult.data.id;

  // 2. IDで取得
  console.log('🔍 Step 2: Fetching Artist by ID...');
  const getResult = await getArtistDNAById(artistId);
  if (getResult.success && getResult.data) {
    console.log('✅ Found:', getResult.data.name);
    console.log('   Bio:', getResult.data.bio);
    console.log('   Core Values:', getResult.data.values.coreValues.join(', '));
  }
  console.log();

  // 3. 更新
  console.log('🔄 Step 3: Updating Artist DNA...');
  const updateResult = await updateArtistDNA(artistId, {
    bio: 'ポップとエレクトロニカを融合させた革新的なサウンドで、世界中のファンを魅了する進化し続けるアーティスト',
  });
  if (updateResult.success && updateResult.data) {
    console.log('✅ Updated:', updateResult.data.name);
    console.log('   New Version:', updateResult.data.version);
    console.log('   Updated Bio:', updateResult.data.bio);
  }
  console.log();

  // 4. 名前で検索
  console.log('🔎 Step 4: Searching by name...');
  const searchResult = await searchArtistDNAByName('Luna');
  if (searchResult.success && searchResult.data) {
    console.log(`✅ Found ${searchResult.data.length} artist(s):`);
    searchResult.data.forEach((artist) => {
      console.log(`   - ${artist.name} (${artist.id})`);
    });
  }
  console.log();

  // 5. 全Artist取得
  console.log('📋 Step 5: Listing all Artists...');
  const allResult = await getAllArtistDNA();
  if (allResult.success && allResult.data) {
    console.log(`✅ Total Artists: ${allResult.data.length}`);
    allResult.data.forEach((artist) => {
      console.log(`   - ${artist.name}`);
      console.log(`     Genres: ${artist.creativeStyle.musicGenres.join(', ')}`);
      console.log(`     Communication: ${artist.communicationStyle.tone}`);
    });
  }
  console.log();

  // 6. 削除
  console.log('🗑️  Step 6: Deleting Artist...');
  const deleteResult = await deleteArtistDNA(artistId);
  if (deleteResult.success && deleteResult.data) {
    console.log('✅ Deleted:', deleteResult.data.deleted ? 'Yes' : 'No');
  }
  console.log();

  // 7. 削除確認
  console.log('✔️  Step 7: Verifying deletion...');
  const verifyResult = await getArtistDNAById(artistId);
  if (verifyResult.success) {
    console.log('✅ Artist no longer exists:', verifyResult.data === null);
  }
  console.log();

  console.log('🎉 Neural Identity Demo completed successfully!');
  console.log('\n' + '='.repeat(60));
  console.log('🎨 Part 2: Neural Palette (Content Management) Demo\n');

  // Part 2: Neural Palette Demo
  // まず新しいアーティストを作成
  console.log('📝 Step 1: Creating new Artist for content demo...');
  const artist2Result = await createArtistDNA(sampleArtistData);
  if (!artist2Result.success || !artist2Result.data) {
    console.error('❌ Failed to create artist:', artist2Result.error);
    return;
  }
  const artist2Id = artist2Result.data.id;
  console.log('✅ Artist Created:', artist2Result.data.name);
  console.log('   ID:', artist2Id);
  console.log();

  // サンプルコンテンツデータ
  const sampleContent: CreateContentInput = {
    artistId: artist2Id,
    title: 'Cosmic Dreams - タイトル曲',
    description: 'デビューアルバムのタイトル曲。壮大な宇宙をテーマにしたエレクトロポップ',
    type: 'song',
    status: 'published',
    tags: [
      { name: 'エレクトロポップ', category: 'ジャンル' },
      { name: '宇宙', category: 'テーマ' },
      { name: 'アップテンポ', category: 'ムード' },
    ],
    mediaFiles: [
      {
        id: 'media_1',
        filename: 'cosmic_dreams.mp3',
        mimeType: 'audio/mpeg',
        size: 5242880, // 5MB
        url: '/media/cosmic_dreams.mp3',
        uploadedAt: new Date(),
      },
      {
        id: 'media_2',
        filename: 'cosmic_dreams_cover.jpg',
        mimeType: 'image/jpeg',
        size: 1048576, // 1MB
        url: '/media/cosmic_dreams_cover.jpg',
        thumbnailUrl: '/media/cosmic_dreams_cover_thumb.jpg',
        uploadedAt: new Date(),
      },
    ],
    collaborators: [
      {
        id: 'collab_1',
        name: 'Yuuki Tanaka',
        role: 'Producer',
        email: 'yuuki@example.com',
      },
      {
        id: 'collab_2',
        name: 'Sakura Yamamoto',
        role: 'Lyricist',
      },
    ],
    metadata: {
      genres: ['エレクトロポップ', 'シンセウェーブ'],
      moods: ['希望', 'エネルギッシュ'],
      bpm: 128,
      key: 'C Major',
      duration: 245, // 4分5秒
    },
    publishedAt: new Date('2023-03-15'),
  };

  // 2. Contentを作成
  console.log('🎵 Step 2: Creating Content...');
  const contentResult = await createContent(sampleContent);
  if (!contentResult.success || !contentResult.data) {
    console.error('❌ Failed to create content:', contentResult.error);
    return;
  }
  console.log('✅ Content Created:', contentResult.data.title);
  console.log('   ID:', contentResult.data.id);
  console.log('   Type:', contentResult.data.type);
  console.log('   Status:', contentResult.data.status);
  console.log('   Tags:', contentResult.data.tags.map((t) => t.name).join(', '));
  console.log();

  const contentId = contentResult.data.id;

  // 3. IDでContentを取得
  console.log('🔍 Step 3: Fetching Content by ID...');
  const getContentResult = await getContentById(contentId);
  if (getContentResult.success && getContentResult.data) {
    console.log('✅ Found:', getContentResult.data.title);
    console.log('   Collaborators:', getContentResult.data.collaborators.map((c) => c.name).join(', '));
    console.log('   BPM:', getContentResult.data.metadata.bpm);
  }
  console.log();

  // 4. Contentを更新
  console.log('🔄 Step 4: Updating Content...');
  const updateContentResult = await updateContent(contentId, {
    status: 'archived',
    description: 'デビューアルバムのタイトル曲。壮大な宇宙をテーマにしたエレクトロポップ（アーカイブ済み）',
  });
  if (updateContentResult.success && updateContentResult.data) {
    console.log('✅ Updated:', updateContentResult.data.title);
    console.log('   New Status:', updateContentResult.data.status);
    console.log('   Version:', updateContentResult.data.version);
  }
  console.log();

  // 5. アーティストIDでContent検索
  console.log('🔎 Step 5: Finding Content by Artist ID...');
  const artistContentResult = await getContentByArtistId(artist2Id);
  if (artistContentResult.success && artistContentResult.data) {
    console.log(`✅ Found ${artistContentResult.data.length} content(s) for this artist`);
    artistContentResult.data.forEach((content) => {
      console.log(`   - ${content.title} [${content.type}]`);
    });
  }
  console.log();

  // 6. フィルターで検索
  console.log('🔎 Step 6: Searching Content with filters...');
  const searchResult2 = await searchContent({
    artistId: artist2Id,
    type: 'song',
    tags: ['宇宙'],
  });
  if (searchResult2.success && searchResult2.data) {
    console.log(`✅ Found ${searchResult2.data.length} matching content(s)`);
    searchResult2.data.forEach((content) => {
      console.log(`   - ${content.title}`);
      console.log(`     Tags: ${content.tags.map((t) => t.name).join(', ')}`);
    });
  }
  console.log();

  // 7. Contentを削除
  console.log('🗑️  Step 7: Deleting Content...');
  const deleteContentResult = await deleteContent(contentId);
  if (deleteContentResult.success && deleteContentResult.data) {
    console.log('✅ Content Deleted:', deleteContentResult.data.deleted ? 'Yes' : 'No');
  }
  console.log();

  // 8. アーティストを削除
  console.log('🗑️  Step 8: Cleaning up Artist...');
  await deleteArtistDNA(artist2Id);
  console.log('✅ Artist Deleted');
  console.log();

  console.log('🎉 Full Demo completed successfully!');
  console.log('\n📊 Neural Palette System (Phase 1) is complete!');
  console.log('   ✅ Neural Identity: Artist DNA management');
  console.log('   ✅ Neural Palette: Content management');
  console.log('\n🚀 Ready for Phase 2: Database integration & advanced features!');
}

// エラーハンドリング付きで実行
main().catch((error) => {
  console.error('❌ Demo failed:', error);
  process.exit(1);
});
