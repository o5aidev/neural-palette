/**
 * Neural Identity Storage (Prisma) Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NeuralIdentityStoragePrisma } from '../neural-identity.storage.prisma.js';
import { clearDatabase, disconnectPrisma } from '../../lib/prisma.js';
import type { CreateArtistDNAInput, UpdateArtistDNAInput } from '../../types/neural-identity.js';

describe('NeuralIdentityStoragePrisma', () => {
  let storage: NeuralIdentityStoragePrisma;

  beforeEach(async () => {
    storage = new NeuralIdentityStoragePrisma();
    await clearDatabase();
  });

  describe('create', () => {
    it('should create a new ArtistDNA', async () => {
      const input: CreateArtistDNAInput = {
        name: 'Test Artist',
        bio: 'A test artist bio',
        creativeStyle: {
          visualThemes: ['minimalist', 'colorful'],
          musicGenres: ['electronic', 'ambient'],
          writingStyle: 'poetic and introspective',
          colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        },
        communicationStyle: {
          tone: 'friendly',
          emojiUsage: 'medium',
          responseLength: 'moderate',
          languagePreferences: ['en', 'ja'],
        },
        values: {
          coreValues: ['authenticity', 'creativity', 'connection'],
          artisticVision: 'To create meaningful experiences through art',
          fanRelationshipPhilosophy: 'Fans are collaborators, not consumers',
        },
        milestones: [],
      };

      const result = await storage.create(input);

      expect(result.id).toBeDefined();
      expect(result.name).toBe(input.name);
      expect(result.bio).toBe(input.bio);
      expect(result.creativeStyle).toEqual(input.creativeStyle);
      expect(result.communicationStyle).toEqual(input.communicationStyle);
      expect(result.values).toEqual(input.values);
      expect(result.version).toBe(1);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should create ArtistDNA with milestones', async () => {
      const input: CreateArtistDNAInput = {
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
        milestones: [
          {
            id: 'milestone-1',
            date: new Date('2023-01-01'),
            title: 'First Release',
            description: 'Released debut album',
            type: 'release',
            significance: 10,
          },
        ],
      };

      const result = await storage.create(input);

      expect(result.milestones).toHaveLength(1);
      expect(result.milestones[0].title).toBe('First Release');
      expect(result.milestones[0].type).toBe('release');
      expect(result.milestones[0].significance).toBe(10);
    });
  });

  describe('findById', () => {
    it('should find ArtistDNA by ID', async () => {
      const input: CreateArtistDNAInput = {
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

      const created = await storage.create(input);
      const found = await storage.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe(input.name);
    });

    it('should return null for non-existent ID', async () => {
      const found = await storage.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all ArtistDNA', async () => {
      const input1: CreateArtistDNAInput = {
        name: 'Artist 1',
        bio: 'Bio 1',
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
          artisticVision: 'Vision 1',
          fanRelationshipPhilosophy: 'Philosophy 1',
        },
        milestones: [],
      };

      const input2: CreateArtistDNAInput = {
        ...input1,
        name: 'Artist 2',
        bio: 'Bio 2',
      };

      await storage.create(input1);
      await storage.create(input2);

      const all = await storage.findAll();
      expect(all).toHaveLength(2);
    });

    it('should return empty array when no artists exist', async () => {
      const all = await storage.findAll();
      expect(all).toHaveLength(0);
    });
  });

  describe('findByName', () => {
    it('should find artists by name (case-insensitive)', async () => {
      const input: CreateArtistDNAInput = {
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

      await storage.create(input);

      const found = await storage.findByName('test');
      expect(found).toHaveLength(1);
      expect(found[0].name).toBe('Test Artist');

      const foundUpper = await storage.findByName('TEST');
      expect(foundUpper).toHaveLength(1);
    });

    it('should return empty array when no match found', async () => {
      const found = await storage.findByName('nonexistent');
      expect(found).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update ArtistDNA', async () => {
      const input: CreateArtistDNAInput = {
        name: 'Test Artist',
        bio: 'Original bio',
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
          artisticVision: 'Original vision',
          fanRelationshipPhilosophy: 'Original philosophy',
        },
        milestones: [],
      };

      const created = await storage.create(input);

      // Verify creation was successful
      expect(created).toBeDefined();
      expect(created.id).toBeDefined();

      // Verify artist can be found
      const found = await storage.findById(created.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);

      // Small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 50));

      const updateInput: UpdateArtistDNAInput = {
        bio: 'Updated bio',
        values: {
          coreValues: ['creativity'],
          artisticVision: 'Updated vision',
          fanRelationshipPhilosophy: 'Updated philosophy',
        },
      };

      const updated = await storage.update(created.id, updateInput);

      expect(updated.bio).toBe('Updated bio');
      expect(updated.values.artisticVision).toBe('Updated vision');
      expect(updated.values.coreValues).toEqual(updateInput.values!.coreValues);
      expect(updated.version).toBe(2);
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());
    });

    it('should throw error when updating non-existent ArtistDNA', async () => {
      const updateInput: UpdateArtistDNAInput = {
        bio: 'Updated bio',
      };

      await expect(storage.update('non-existent-id', updateInput)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete ArtistDNA', async () => {
      const input: CreateArtistDNAInput = {
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

      const created = await storage.create(input);
      const deleted = await storage.delete(created.id);

      expect(deleted).toBe(true);

      const found = await storage.findById(created.id);
      expect(found).toBeNull();
    });

    it('should return false when deleting non-existent ArtistDNA', async () => {
      const deleted = await storage.delete('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('count', () => {
    it('should return correct count', async () => {
      const input: CreateArtistDNAInput = {
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

      expect(await storage.count()).toBe(0);

      await storage.create(input);
      expect(await storage.count()).toBe(1);

      await storage.create({ ...input, name: 'Artist 2' });
      expect(await storage.count()).toBe(2);
    });
  });
});
