/**
 * Neural Identity API テスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createArtistDNA,
  getArtistDNAById,
  getAllArtistDNA,
  searchArtistDNAByName,
  updateArtistDNA,
  deleteArtistDNA,
} from '../neural-identity.api.js';
import { neuralIdentityStorage } from '../../storage/neural-identity.storage.js';
import type { CreateArtistDNAInput } from '../../types/neural-identity.js';

describe('Neural Identity API', () => {
  const validInput: CreateArtistDNAInput = {
    name: 'Luna Starlight',
    bio: 'ポップとエレクトロニカを融合させた革新的なサウンド',
    creativeStyle: {
      visualThemes: ['宇宙', '光'],
      musicGenres: ['エレクトロポップ'],
      writingStyle: 'ポエティック',
      colorPalette: ['#8B5CF6', '#EC4899'],
    },
    communicationStyle: {
      tone: 'inspiring',
      emojiUsage: 'high',
      responseLength: 'moderate',
      languagePreferences: ['日本語'],
    },
    values: {
      coreValues: ['創造性', '共感'],
      artisticVision: '音楽を通じて人々の心を繋ぐ',
      fanRelationshipPhilosophy: 'ファンと共に成長する',
    },
    milestones: [
      {
        id: 'milestone_1',
        date: new Date('2023-03-15'),
        title: 'デビューアルバムリリース',
        description: '初のフルアルバム',
        type: 'release',
        significance: 10,
      },
    ],
  };

  beforeEach(async () => {
    await neuralIdentityStorage.clear();
  });

  describe('createArtistDNA', () => {
    it('ArtistDNAを作成できる', async () => {
      const result = await createArtistDNA(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('Luna Starlight');
      expect(result.error).toBeUndefined();
    });

    it('無効なデータの場合はエラーレスポンス', async () => {
      const invalidInput = { ...validInput, name: '' };
      const result = await createArtistDNA(invalidInput);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('CREATE_FAILED');
    });
  });

  describe('getArtistDNAById', () => {
    it('存在するIDで取得できる', async () => {
      const created = await createArtistDNA(validInput);
      const result = await getArtistDNAById(created.data!.id);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.name).toBe('Luna Starlight');
    });

    it('存在しないIDの場合はnull', async () => {
      const result = await getArtistDNAById('nonexistent');

      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
    });
  });

  describe('getAllArtistDNA', () => {
    it('空の場合は空配列を返す', async () => {
      const result = await getAllArtistDNA();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('全てのArtistDNAを取得できる', async () => {
      await createArtistDNA(validInput);
      await createArtistDNA({ ...validInput, name: 'Another Artist' });

      const result = await getAllArtistDNA();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });
  });

  describe('searchArtistDNAByName', () => {
    it('名前で検索できる', async () => {
      await createArtistDNA(validInput);
      await createArtistDNA({ ...validInput, name: 'Another Artist' });

      const result = await searchArtistDNAByName('Luna');

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].name).toBe('Luna Starlight');
    });

    it('マッチしない場合は空配列を返す', async () => {
      await createArtistDNA(validInput);

      const result = await searchArtistDNAByName('Nonexistent');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('updateArtistDNA', () => {
    it('ArtistDNAを更新できる', async () => {
      const created = await createArtistDNA(validInput);
      const result = await updateArtistDNA(created.data!.id, {
        bio: '新しい自己紹介',
      });

      expect(result.success).toBe(true);
      expect(result.data?.bio).toBe('新しい自己紹介');
      expect(result.data?.version).toBe(2);
    });

    it('存在しないIDの場合はエラーレスポンス', async () => {
      const result = await updateArtistDNA('nonexistent', {
        bio: '新しい自己紹介',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('NOT_FOUND');
    });

    it('無効なデータの場合はエラーレスポンス', async () => {
      const created = await createArtistDNA(validInput);
      const result = await updateArtistDNA(created.data!.id, { name: '' });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('deleteArtistDNA', () => {
    it('ArtistDNAを削除できる', async () => {
      const created = await createArtistDNA(validInput);
      const result = await deleteArtistDNA(created.data!.id);

      expect(result.success).toBe(true);
      expect(result.data?.deleted).toBe(true);

      const getResult = await getArtistDNAById(created.data!.id);
      expect(getResult.data).toBeNull();
    });

    it('存在しないIDの場合もsuccessでdeleted:false', async () => {
      const result = await deleteArtistDNA('nonexistent');

      expect(result.success).toBe(true);
      expect(result.data?.deleted).toBe(false);
    });
  });
});
