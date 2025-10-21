/**
 * Neural Palette Storage (Prisma) Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NeuralPaletteStoragePrisma } from '../neural-palette.storage.prisma.js';
import { NeuralIdentityStoragePrisma } from '../neural-identity.storage.prisma.js';
import { clearDatabase } from '../../lib/prisma.js';
import type { CreateContentInput, UpdateContentInput, ContentFilter } from '../../types/neural-palette.js';
import type { CreateArtistDNAInput } from '../../types/neural-identity.js';

describe('NeuralPaletteStoragePrisma', () => {
  let storage: NeuralPaletteStoragePrisma;
  let identityStorage: NeuralIdentityStoragePrisma;
  let testArtistId: string;

  beforeEach(async () => {
    storage = new NeuralPaletteStoragePrisma();
    identityStorage = new NeuralIdentityStoragePrisma();
    await clearDatabase();

    // Create test artist
    const artistInput: CreateArtistDNAInput = {
      name: 'Test Artist',
      bio: 'A test artist bio',
      creativeStyle: {
        visualThemes: ['minimalist'],
        musicGenres: ['electronic'],
        writingStyle: 'poetic',
        colorPalette: ['#FF6B6B'],
      },
      communicationStyle: {
        tone: 'friendly',
        emojiUsage: 'medium',
        responseLength: 'moderate',
        languagePreferences: ['en'],
      },
      values: {
        coreValues: ['authenticity'],
        artisticVision: 'To create meaningful experiences',
        fanRelationshipPhilosophy: 'Fans are collaborators',
      },
      milestones: [],
    };

    const artist = await identityStorage.create(artistInput);
    testArtistId = artist.id;
  });

  describe('create', () => {
    it('should create a new Content', async () => {
      const input: CreateContentInput = {
        artistId: testArtistId,
        title: 'Test Song',
        description: 'A test song description',
        type: 'song',
        status: 'draft',
        tags: [],
        mediaFiles: [],
        collaborators: [],
        metadata: {
          duration: 180,
          tempo: 120,
          key: 'C Major',
        },
      };

      const result = await storage.create(input);

      expect(result.id).toBeDefined();
      expect(result.artistId).toBe(testArtistId);
      expect(result.title).toBe(input.title);
      expect(result.description).toBe(input.description);
      expect(result.type).toBe(input.type);
      expect(result.status).toBe(input.status);
      expect(result.metadata).toEqual(input.metadata);
      expect(result.version).toBe(1);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should create Content with tags, media, and collaborators', async () => {
      const input: CreateContentInput = {
        artistId: testArtistId,
        title: 'Test Song',
        description: 'A test song description',
        type: 'song',
        status: 'draft',
        tags: [
          { id: 'tag-1', name: 'electronic', category: 'genre' },
          { id: 'tag-2', name: 'chill', category: 'mood' },
        ],
        mediaFiles: [
          {
            id: 'media-1',
            filename: 'song.mp3',
            mimeType: 'audio/mpeg',
            size: 5000000,
            url: 'https://example.com/song.mp3',
            uploadedAt: new Date(),
          },
        ],
        collaborators: [
          {
            id: 'collab-1',
            name: 'Producer Name',
            role: 'producer',
            email: 'producer@example.com',
          },
        ],
        metadata: {
          duration: 180,
        },
      };

      const result = await storage.create(input);

      expect(result.tags).toHaveLength(2);
      expect(result.tags[0].name).toBe('electronic');
      expect(result.mediaFiles).toHaveLength(1);
      expect(result.mediaFiles[0].filename).toBe('song.mp3');
      expect(result.collaborators).toHaveLength(1);
      expect(result.collaborators[0].name).toBe('Producer Name');
    });
  });

  describe('findById', () => {
    it('should find Content by ID', async () => {
      const input: CreateContentInput = {
        artistId: testArtistId,
        title: 'Test Song',
        description: 'A test song description',
        type: 'song',
        status: 'draft',
        tags: [],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      };

      const created = await storage.create(input);
      const found = await storage.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.title).toBe(input.title);
    });

    it('should return null for non-existent ID', async () => {
      const found = await storage.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all Content', async () => {
      const input1: CreateContentInput = {
        artistId: testArtistId,
        title: 'Song 1',
        description: 'Description 1',
        type: 'song',
        status: 'draft',
        tags: [],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      };

      const input2: CreateContentInput = {
        ...input1,
        title: 'Song 2',
      };

      await storage.create(input1);
      await storage.create(input2);

      const all = await storage.findAll();
      expect(all).toHaveLength(2);
    });

    it('should return empty array when no content exists', async () => {
      const all = await storage.findAll();
      expect(all).toHaveLength(0);
    });
  });

  describe('findByArtistId', () => {
    it('should find content by artist ID', async () => {
      const input: CreateContentInput = {
        artistId: testArtistId,
        title: 'Test Song',
        description: 'A test song description',
        type: 'song',
        status: 'draft',
        tags: [],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      };

      await storage.create(input);

      const found = await storage.findByArtistId(testArtistId);
      expect(found).toHaveLength(1);
      expect(found[0].artistId).toBe(testArtistId);
    });

    it('should return empty array for non-existent artist', async () => {
      const found = await storage.findByArtistId('non-existent-artist');
      expect(found).toHaveLength(0);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await storage.create({
        artistId: testArtistId,
        title: 'Electronic Song',
        description: 'A chill electronic track',
        type: 'song',
        status: 'published',
        tags: [{ id: 'tag-1', name: 'electronic', category: 'genre' }],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      });

      await storage.create({
        artistId: testArtistId,
        title: 'Rock Song',
        description: 'An energetic rock song',
        type: 'song',
        status: 'draft',
        tags: [{ id: 'tag-2', name: 'rock', category: 'genre' }],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      });

      await storage.create({
        artistId: testArtistId,
        title: 'Music Video',
        description: 'Video for the electronic song',
        type: 'video',
        status: 'published',
        tags: [{ id: 'tag-3', name: 'electronic', category: 'genre' }],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      });
    });

    it('should filter by type', async () => {
      const filter: ContentFilter = { type: 'video' };
      const results = await storage.search(filter);

      expect(results).toHaveLength(1);
      expect(results[0].type).toBe('video');
    });

    it('should filter by status', async () => {
      const filter: ContentFilter = { status: 'published' };
      const results = await storage.search(filter);

      expect(results).toHaveLength(2);
      expect(results.every(r => r.status === 'published')).toBe(true);
    });

    it('should filter by tags', async () => {
      const filter: ContentFilter = { tags: ['electronic'] };
      const results = await storage.search(filter);

      expect(results).toHaveLength(2);
      expect(results.every(r => r.tags.some(t => t.name === 'electronic'))).toBe(true);
    });

    it('should filter by search text', async () => {
      const filter: ContentFilter = { search: 'chill' };
      const results = await storage.search(filter);

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Electronic Song');
    });

    it('should filter by artist ID', async () => {
      const filter: ContentFilter = { artistId: testArtistId };
      const results = await storage.search(filter);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.artistId === testArtistId)).toBe(true);
    });

    it('should combine multiple filters', async () => {
      const filter: ContentFilter = {
        type: 'song',
        status: 'published',
        tags: ['electronic'],
      };
      const results = await storage.search(filter);

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Electronic Song');
    });
  });

  describe('update', () => {
    it('should update Content', async () => {
      const input: CreateContentInput = {
        artistId: testArtistId,
        title: 'Original Title',
        description: 'Original description',
        type: 'song',
        status: 'draft',
        tags: [],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      };

      const created = await storage.create(input);

      // Small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      const updateInput: UpdateContentInput = {
        title: 'Updated Title',
        status: 'published',
      };

      const updated = await storage.update(created.id, updateInput);

      expect(updated.title).toBe('Updated Title');
      expect(updated.status).toBe('published');
      expect(updated.version).toBe(2);
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should throw error when updating non-existent Content', async () => {
      const updateInput: UpdateContentInput = {
        title: 'Updated Title',
      };

      await expect(storage.update('non-existent-id', updateInput)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete Content', async () => {
      const input: CreateContentInput = {
        artistId: testArtistId,
        title: 'Test Song',
        description: 'A test song description',
        type: 'song',
        status: 'draft',
        tags: [],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      };

      const created = await storage.create(input);
      const deleted = await storage.delete(created.id);

      expect(deleted).toBe(true);

      const found = await storage.findById(created.id);
      expect(found).toBeNull();
    });

    it('should return false when deleting non-existent Content', async () => {
      const deleted = await storage.delete('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('deleteByArtistId', () => {
    it('should delete all content for an artist', async () => {
      const input1: CreateContentInput = {
        artistId: testArtistId,
        title: 'Song 1',
        description: 'Description 1',
        type: 'song',
        status: 'draft',
        tags: [],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      };

      const input2: CreateContentInput = {
        ...input1,
        title: 'Song 2',
      };

      await storage.create(input1);
      await storage.create(input2);

      const deletedCount = await storage.deleteByArtistId(testArtistId);
      expect(deletedCount).toBe(2);

      const found = await storage.findByArtistId(testArtistId);
      expect(found).toHaveLength(0);
    });

    it('should return 0 when no content exists for artist', async () => {
      const deletedCount = await storage.deleteByArtistId('non-existent-artist');
      expect(deletedCount).toBe(0);
    });
  });

  describe('count', () => {
    it('should return correct count', async () => {
      const input: CreateContentInput = {
        artistId: testArtistId,
        title: 'Test Song',
        description: 'A test song description',
        type: 'song',
        status: 'draft',
        tags: [],
        mediaFiles: [],
        collaborators: [],
        metadata: {},
      };

      expect(await storage.count()).toBe(0);

      await storage.create(input);
      expect(await storage.count()).toBe(1);

      await storage.create({ ...input, title: 'Song 2' });
      expect(await storage.count()).toBe(2);
    });
  });
});
