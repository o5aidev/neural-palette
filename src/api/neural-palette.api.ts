/**
 * Neural Palette API
 *
 * Content の CRUD 操作を提供
 */

import type { Content, CreateContentInput, UpdateContentInput, ContentFilter } from '../types/neural-palette.js';
import { neuralPaletteStorage } from '../storage/neural-palette.storage.js';
import type { ApiResponse } from './neural-identity.api.js';

/**
 * Contentを作成
 *
 * @param input 作成データ
 * @returns 作成されたContent
 */
export async function createContent(input: CreateContentInput): Promise<ApiResponse<Content>> {
  try {
    const content = await neuralPaletteStorage.create(input);
    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create Content',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * IDでContentを取得
 *
 * @param id コンテンツID
 * @returns Content または null
 */
export async function getContentById(id: string): Promise<ApiResponse<Content | null>> {
  try {
    const content = await neuralPaletteStorage.findById(id);
    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch Content',
        code: 'FETCH_FAILED',
      },
    };
  }
}

/**
 * 全てのContentを取得
 *
 * @returns Contentの配列
 */
export async function getAllContent(): Promise<ApiResponse<Content[]>> {
  try {
    const contents = await neuralPaletteStorage.findAll();
    return {
      success: true,
      data: contents,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch all Content',
        code: 'FETCH_ALL_FAILED',
      },
    };
  }
}

/**
 * アーティストIDでContentを取得
 *
 * @param artistId アーティストID
 * @returns Contentの配列
 */
export async function getContentByArtistId(artistId: string): Promise<ApiResponse<Content[]>> {
  try {
    const contents = await neuralPaletteStorage.findByArtistId(artistId);
    return {
      success: true,
      data: contents,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch Content by artist',
        code: 'FETCH_BY_ARTIST_FAILED',
      },
    };
  }
}

/**
 * フィルター条件でContentを検索
 *
 * @param filter 検索フィルター
 * @returns マッチしたContentの配列
 */
export async function searchContent(filter: ContentFilter): Promise<ApiResponse<Content[]>> {
  try {
    const contents = await neuralPaletteStorage.findByFilter(filter);
    return {
      success: true,
      data: contents,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to search Content',
        code: 'SEARCH_FAILED',
      },
    };
  }
}

/**
 * Contentを更新
 *
 * @param id コンテンツID
 * @param input 更新データ
 * @returns 更新されたContent
 */
export async function updateContent(id: string, input: UpdateContentInput): Promise<ApiResponse<Content>> {
  try {
    const content = await neuralPaletteStorage.update(id, input);
    return {
      success: true,
      data: content,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update Content',
        code: (error as any).code || 'UPDATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * Contentを削除
 *
 * @param id コンテンツID
 * @returns 削除が成功したかどうか
 */
export async function deleteContent(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const deleted = await neuralPaletteStorage.delete(id);
    return {
      success: true,
      data: { deleted },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete Content',
        code: 'DELETE_FAILED',
      },
    };
  }
}

/**
 * アーティストの全Contentを削除
 *
 * @param artistId アーティストID
 * @returns 削除された件数
 */
export async function deleteContentByArtistId(
  artistId: string
): Promise<ApiResponse<{ deletedCount: number }>> {
  try {
    const deletedCount = await neuralPaletteStorage.deleteByArtistId(artistId);
    return {
      success: true,
      data: { deletedCount },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete Content by artist',
        code: 'DELETE_BY_ARTIST_FAILED',
      },
    };
  }
}
