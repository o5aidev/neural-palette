/**
 * Neural Palette バリデーター
 *
 * Contentデータの検証を行う
 */

import type {
  Content,
  CreateContentInput,
  UpdateContentInput,
  MediaFile,
  Collaborator,
  Tag,
  ContentType,
  ContentStatus,
} from '../types/neural-palette.js';
import { ValidationError } from './neural-identity.validator.js';

/**
 * ContentTypeの有効な値
 */
const VALID_CONTENT_TYPES: ContentType[] = ['song', 'album', 'video', 'artwork', 'post', 'other'];

/**
 * ContentStatusの有効な値
 */
const VALID_CONTENT_STATUSES: ContentStatus[] = [
  'draft',
  'in_progress',
  'review',
  'published',
  'archived',
];

/**
 * URLの検証（簡易版）
 */
function isValidUrl(url: string): boolean {
  try {
    // Phase 1: ローカルパスも許可
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true;
    }
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Tagの検証
 */
export function validateTag(tag: Tag): void {
  const errors: string[] = [];

  if (!tag.name || tag.name.trim() === '') {
    errors.push('Tag name is required');
  }

  if (errors.length > 0) {
    throw new ValidationError('Tag validation failed', 'tag', errors);
  }
}

/**
 * MediaFileの検証
 */
export function validateMediaFile(mediaFile: MediaFile): void {
  const errors: string[] = [];

  if (!mediaFile.id || mediaFile.id.trim() === '') {
    errors.push('MediaFile ID is required');
  }

  if (!mediaFile.filename || mediaFile.filename.trim() === '') {
    errors.push('Filename is required');
  }

  if (!mediaFile.mimeType || mediaFile.mimeType.trim() === '') {
    errors.push('MIME type is required');
  }

  if (typeof mediaFile.size !== 'number' || mediaFile.size < 0) {
    errors.push('File size must be a non-negative number');
  }

  if (!mediaFile.url || !isValidUrl(mediaFile.url)) {
    errors.push('Valid URL is required');
  }

  if (mediaFile.thumbnailUrl && !isValidUrl(mediaFile.thumbnailUrl)) {
    errors.push('Thumbnail URL must be valid if provided');
  }

  if (!(mediaFile.uploadedAt instanceof Date) || isNaN(mediaFile.uploadedAt.getTime())) {
    errors.push('Valid uploadedAt date is required');
  }

  if (errors.length > 0) {
    throw new ValidationError('MediaFile validation failed', 'mediaFile', errors);
  }
}

/**
 * Collaboratorの検証
 */
export function validateCollaborator(collaborator: Collaborator): void {
  const errors: string[] = [];

  if (!collaborator.id || collaborator.id.trim() === '') {
    errors.push('Collaborator ID is required');
  }

  if (!collaborator.name || collaborator.name.trim() === '') {
    errors.push('Collaborator name is required');
  }

  if (!collaborator.role || collaborator.role.trim() === '') {
    errors.push('Collaborator role is required');
  }

  if (collaborator.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(collaborator.email)) {
    errors.push('Invalid email format');
  }

  if (errors.length > 0) {
    throw new ValidationError('Collaborator validation failed', 'collaborator', errors);
  }
}

/**
 * CreateContentInputの検証
 */
export function validateCreateContentInput(input: CreateContentInput): void {
  const errors: string[] = [];

  // 基本情報の検証
  if (!input.artistId || input.artistId.trim() === '') {
    errors.push('Artist ID is required');
  }

  if (!input.title || input.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!input.description || input.description.trim() === '') {
    errors.push('Description is required');
  }

  if (!VALID_CONTENT_TYPES.includes(input.type)) {
    errors.push(`Invalid content type. Must be one of: ${VALID_CONTENT_TYPES.join(', ')}`);
  }

  if (!VALID_CONTENT_STATUSES.includes(input.status)) {
    errors.push(`Invalid status. Must be one of: ${VALID_CONTENT_STATUSES.join(', ')}`);
  }

  // タグの検証
  if (!Array.isArray(input.tags)) {
    errors.push('Tags must be an array');
  } else {
    input.tags.forEach((tag, index) => {
      try {
        validateTag(tag);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`Tag[${index}]: ${error.errors.join(', ')}`);
        }
      }
    });
  }

  // メディアファイルの検証
  if (!Array.isArray(input.mediaFiles)) {
    errors.push('Media files must be an array');
  } else {
    input.mediaFiles.forEach((file, index) => {
      try {
        validateMediaFile(file);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`MediaFile[${index}]: ${error.errors.join(', ')}`);
        }
      }
    });
  }

  // コラボレーターの検証
  if (!Array.isArray(input.collaborators)) {
    errors.push('Collaborators must be an array');
  } else {
    input.collaborators.forEach((collab, index) => {
      try {
        validateCollaborator(collab);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`Collaborator[${index}]: ${error.errors.join(', ')}`);
        }
      }
    });
  }

  // メタデータの検証
  if (input.metadata.bpm !== undefined) {
    if (typeof input.metadata.bpm !== 'number' || input.metadata.bpm <= 0) {
      errors.push('BPM must be a positive number');
    }
  }

  if (input.metadata.duration !== undefined) {
    if (typeof input.metadata.duration !== 'number' || input.metadata.duration < 0) {
      errors.push('Duration must be a non-negative number');
    }
  }

  // 公開日時の検証
  if (input.publishedAt) {
    if (!(input.publishedAt instanceof Date) || isNaN(input.publishedAt.getTime())) {
      errors.push('publishedAt must be a valid date');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Content validation failed', undefined, errors);
  }
}

/**
 * UpdateContentInputの検証（部分更新）
 */
export function validateUpdateContentInput(input: UpdateContentInput): void {
  const errors: string[] = [];

  // 提供されたフィールドのみ検証
  if (input.title !== undefined && input.title.trim() === '') {
    errors.push('Title cannot be empty');
  }

  if (input.description !== undefined && input.description.trim() === '') {
    errors.push('Description cannot be empty');
  }

  if (input.type !== undefined && !VALID_CONTENT_TYPES.includes(input.type)) {
    errors.push(`Invalid content type. Must be one of: ${VALID_CONTENT_TYPES.join(', ')}`);
  }

  if (input.status !== undefined && !VALID_CONTENT_STATUSES.includes(input.status)) {
    errors.push(`Invalid status. Must be one of: ${VALID_CONTENT_STATUSES.join(', ')}`);
  }

  if (input.tags) {
    input.tags.forEach((tag, index) => {
      try {
        validateTag(tag);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`Tag[${index}]: ${error.errors.join(', ')}`);
        }
      }
    });
  }

  if (input.mediaFiles) {
    input.mediaFiles.forEach((file, index) => {
      try {
        validateMediaFile(file);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`MediaFile[${index}]: ${error.errors.join(', ')}`);
        }
      }
    });
  }

  if (input.collaborators) {
    input.collaborators.forEach((collab, index) => {
      try {
        validateCollaborator(collab);
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(`Collaborator[${index}]: ${error.errors.join(', ')}`);
        }
      }
    });
  }

  if (input.metadata?.bpm !== undefined) {
    if (typeof input.metadata.bpm !== 'number' || input.metadata.bpm <= 0) {
      errors.push('BPM must be a positive number');
    }
  }

  if (input.metadata?.duration !== undefined) {
    if (typeof input.metadata.duration !== 'number' || input.metadata.duration < 0) {
      errors.push('Duration must be a non-negative number');
    }
  }

  if (input.publishedAt) {
    if (!(input.publishedAt instanceof Date) || isNaN(input.publishedAt.getTime())) {
      errors.push('publishedAt must be a valid date');
    }
  }

  if (errors.length > 0) {
    throw new ValidationError('Update validation failed', undefined, errors);
  }
}
