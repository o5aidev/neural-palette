/**
 * Neural Palette - Demo Application
 *
 * Neural Identity (DNA定義システム) のデモンストレーション
 */

import {
  createArtistDNA,
  getAllArtistDNA,
  getArtistDNAById,
  searchArtistDNAByName,
  updateArtistDNA,
  deleteArtistDNA,
} from './api/neural-identity.api.js';
import type { CreateArtistDNAInput } from './types/neural-identity.js';

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

  console.log('🎉 Demo completed successfully!');
  console.log('\n📊 Neural Identity System is ready for Phase 2!');
}

// エラーハンドリング付きで実行
main().catch((error) => {
  console.error('❌ Demo failed:', error);
  process.exit(1);
});
