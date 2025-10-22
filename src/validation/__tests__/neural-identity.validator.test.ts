/**
 * Neural Identity Validator テスト
 */

import { describe, it, expect } from 'vitest';
import {
  validateMilestone,
  validateCreateArtistDNAInput,
  validateUpdateArtistDNAInput,
  ValidationError,
} from '../neural-identity.validator.js';
import type { CreateArtistDNAInput, Milestone } from '../../types/neural-identity.js';

describe('validateMilestone', () => {
  it('正常なMilestoneを受け入れる', () => {
    const milestone: Milestone = {
      id: 'milestone_1',
      date: new Date('2023-03-15'),
      title: 'デビューアルバムリリース',
      description: '初のフルアルバムが全世界で50万枚を突破',
      type: 'release',
      significance: 10,
    };

    expect(() => validateMilestone(milestone)).not.toThrow();
  });

  it('IDが空文字の場合はエラー', () => {
    const milestone: Milestone = {
      id: '',
      date: new Date('2023-03-15'),
      title: 'デビューアルバムリリース',
      description: '初のフルアルバムが全世界で50万枚を突破',
      type: 'release',
      significance: 10,
    };

    expect(() => validateMilestone(milestone)).toThrow(ValidationError);
  });

  it('無効な日付の場合はエラー', () => {
    const milestone: Milestone = {
      id: 'milestone_1',
      date: new Date('invalid'),
      title: 'デビューアルバムリリース',
      description: '初のフルアルバムが全世界で50万枚を突破',
      type: 'release',
      significance: 10,
    };

    expect(() => validateMilestone(milestone)).toThrow(ValidationError);
  });

  it('無効なtypeの場合はエラー', () => {
    const milestone: any = {
      id: 'milestone_1',
      date: new Date('2023-03-15'),
      title: 'デビューアルバムリリース',
      description: '初のフルアルバムが全世界で50万枚を突破',
      type: 'invalid_type',
      significance: 10,
    };

    expect(() => validateMilestone(milestone)).toThrow(ValidationError);
  });

  it('significance が範囲外の場合はエラー', () => {
    const milestone: Milestone = {
      id: 'milestone_1',
      date: new Date('2023-03-15'),
      title: 'デビューアルバムリリース',
      description: '初のフルアルバムが全世界で50万枚を突破',
      type: 'release',
      significance: 11, // 10より大きい
    };

    expect(() => validateMilestone(milestone)).toThrow(ValidationError);
  });
});

describe('validateCreateArtistDNAInput', () => {
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

  it('正常なArtistDNAを受け入れる', () => {
    expect(() => validateCreateArtistDNAInput(validInput)).not.toThrow();
  });

  it('nameが空文字の場合はエラー', () => {
    const input = { ...validInput, name: '' };
    expect(() => validateCreateArtistDNAInput(input)).toThrow(ValidationError);
  });

  it('bioが空文字の場合はエラー', () => {
    const input = { ...validInput, bio: '' };
    expect(() => validateCreateArtistDNAInput(input)).toThrow(ValidationError);
  });

  it('無効なHEXカラーの場合はエラー', () => {
    const input = {
      ...validInput,
      creativeStyle: {
        ...validInput.creativeStyle,
        colorPalette: ['#GGGGGG'], // 無効なHEX
      },
    };
    expect(() => validateCreateArtistDNAInput(input)).toThrow(ValidationError);
  });

  it('無効なtoneの場合はエラー', () => {
    const input: any = {
      ...validInput,
      communicationStyle: {
        ...validInput.communicationStyle,
        tone: 'invalid_tone',
      },
    };
    expect(() => validateCreateArtistDNAInput(input)).toThrow(ValidationError);
  });

  it('coreValuesが空配列の場合はエラー', () => {
    const input = {
      ...validInput,
      values: {
        ...validInput.values,
        coreValues: [],
      },
    };
    expect(() => validateCreateArtistDNAInput(input)).toThrow(ValidationError);
  });

  it('無効なMilestoneが含まれる場合はエラー', () => {
    const input = {
      ...validInput,
      milestones: [
        {
          ...validInput.milestones[0],
          significance: 11, // 範囲外
        },
      ],
    };
    expect(() => validateCreateArtistDNAInput(input)).toThrow(ValidationError);
  });
});

describe('validateUpdateArtistDNAInput', () => {
  it('正常な部分更新を受け入れる', () => {
    const input = {
      bio: '新しい自己紹介',
    };
    expect(() => validateUpdateArtistDNAInput(input)).not.toThrow();
  });

  it('nameが空文字の場合はエラー', () => {
    const input = { name: '' };
    expect(() => validateUpdateArtistDNAInput(input)).toThrow(ValidationError);
  });

  it('無効なHEXカラーの場合はエラー', () => {
    const input: Partial<Omit<ArtistDNA, 'id' | 'createdAt' | 'updatedAt' | 'version'>> = {
      creativeStyle: {
        visualThemes: ['abstract'],
        musicGenres: ['electronic'],
        writingStyle: 'poetic',
        colorPalette: ['invalid'],
      },
    };
    expect(() => validateUpdateArtistDNAInput(input)).toThrow(ValidationError);
  });

  it('coreValuesが空配列の場合はエラー', () => {
    const input: Partial<Omit<ArtistDNA, 'id' | 'createdAt' | 'updatedAt' | 'version'>> = {
      values: {
        coreValues: [],
        artisticVision: 'Test vision',
        fanRelationshipPhilosophy: 'Test philosophy',
      },
    };
    expect(() => validateUpdateArtistDNAInput(input)).toThrow(ValidationError);
  });
});
