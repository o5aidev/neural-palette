/**
 * Neural Identity Storage テスト
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NeuralIdentityStorage, StorageError } from '../neural-identity.storage.js';
import type { CreateArtistDNAInput } from '../../types/neural-identity.js';

describe('NeuralIdentityStorage', () => {
  let storage: NeuralIdentityStorage;

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
    storage = new NeuralIdentityStorage();
  });

  describe('create', () => {
    it('ArtistDNAを作成できる', async () => {
      const artist = await storage.create(validInput);

      expect(artist.id).toBeDefined();
      expect(artist.name).toBe('Luna Starlight');
      expect(artist.version).toBe(1);
      expect(artist.createdAt).toBeInstanceOf(Date);
      expect(artist.updatedAt).toBeInstanceOf(Date);
    });

    it('無効なデータの場合はエラー', async () => {
      const invalidInput = { ...validInput, name: '' };
      await expect(storage.create(invalidInput)).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('存在するIDで取得できる', async () => {
      const created = await storage.create(validInput);
      const found = await storage.findById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe('Luna Starlight');
    });

    it('存在しないIDの場合はnullを返す', async () => {
      const found = await storage.findById('nonexistent');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('空の場合は空配列を返す', async () => {
      const all = await storage.findAll();
      expect(all).toEqual([]);
    });

    it('全てのArtistDNAを取得できる', async () => {
      await storage.create(validInput);
      await storage.create({ ...validInput, name: 'Another Artist' });

      const all = await storage.findAll();
      expect(all).toHaveLength(2);
    });
  });

  describe('findByName', () => {
    it('名前で検索できる', async () => {
      await storage.create(validInput);
      await storage.create({ ...validInput, name: 'Another Artist' });

      const results = await storage.findByName('Luna');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Luna Starlight');
    });

    it('大文字小文字を区別せず検索できる', async () => {
      await storage.create(validInput);

      const results = await storage.findByName('luna');
      expect(results).toHaveLength(1);
    });

    it('マッチしない場合は空配列を返す', async () => {
      await storage.create(validInput);

      const results = await storage.findByName('Nonexistent');
      expect(results).toEqual([]);
    });
  });

  describe('update', () => {
    it('ArtistDNAを更新できる', async () => {
      const created = await storage.create(validInput);

      // タイミングを確実にするため少し待機
      await new Promise(resolve => setTimeout(resolve, 10));

      const updated = await storage.update(created.id, {
        bio: '新しい自己紹介',
      });

      expect(updated.bio).toBe('新しい自己紹介');
      expect(updated.version).toBe(2);
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
      expect(updated.id).toBe(created.id);
      expect(updated.createdAt).toEqual(created.createdAt);
    });

    it('存在しないIDの場合はエラー', async () => {
      await expect(
        storage.update('nonexistent', { bio: '新しい自己紹介' })
      ).rejects.toThrow(StorageError);
    });

    it('無効なデータの場合はエラー', async () => {
      const created = await storage.create(validInput);
      await expect(storage.update(created.id, { name: '' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('ArtistDNAを削除できる', async () => {
      const created = await storage.create(validInput);
      const deleted = await storage.delete(created.id);

      expect(deleted).toBe(true);

      const found = await storage.findById(created.id);
      expect(found).toBeNull();
    });

    it('存在しないIDの場合はfalseを返す', async () => {
      const deleted = await storage.delete('nonexistent');
      expect(deleted).toBe(false);
    });
  });

  describe('clear', () => {
    it('全データをクリアできる', async () => {
      await storage.create(validInput);
      await storage.create({ ...validInput, name: 'Another Artist' });

      await storage.clear();

      const count = await storage.count();
      expect(count).toBe(0);
    });
  });

  describe('count', () => {
    it('データ数を取得できる', async () => {
      expect(await storage.count()).toBe(0);

      await storage.create(validInput);
      expect(await storage.count()).toBe(1);

      await storage.create({ ...validInput, name: 'Another Artist' });
      expect(await storage.count()).toBe(2);
    });
  });
});
