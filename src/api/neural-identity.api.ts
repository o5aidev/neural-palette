/**
 * Neural Identity API
 *
 * ArtistDNAの CRUD 操作を提供
 */

import type { ArtistDNA, CreateArtistDNAInput, UpdateArtistDNAInput } from '../types/neural-identity.js';
import { neuralIdentityStorage } from '../storage/neural-identity.storage.js';

/**
 * APIレスポンス型
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: string[];
  };
}

/**
 * ArtistDNAを作成
 *
 * @param input 作成データ
 * @returns 作成されたArtistDNA
 */
export async function createArtistDNA(
  input: CreateArtistDNAInput
): Promise<ApiResponse<ArtistDNA>> {
  try {
    const artistDNA = await neuralIdentityStorage.create(input);
    return {
      success: true,
      data: artistDNA,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create ArtistDNA',
        code: 'CREATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * IDでArtistDNAを取得
 *
 * @param id アーティストID
 * @returns ArtistDNA または null
 */
export async function getArtistDNAById(id: string): Promise<ApiResponse<ArtistDNA | null>> {
  try {
    const artistDNA = await neuralIdentityStorage.findById(id);
    return {
      success: true,
      data: artistDNA,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch ArtistDNA',
        code: 'FETCH_FAILED',
      },
    };
  }
}

/**
 * 全てのArtistDNAを取得
 *
 * @returns ArtistDNAの配列
 */
export async function getAllArtistDNA(): Promise<ApiResponse<ArtistDNA[]>> {
  try {
    const artistDNAs = await neuralIdentityStorage.findAll();
    return {
      success: true,
      data: artistDNAs,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch all ArtistDNA',
        code: 'FETCH_ALL_FAILED',
      },
    };
  }
}

/**
 * 名前でArtistDNAを検索
 *
 * @param name 検索する名前
 * @returns マッチしたArtistDNAの配列
 */
export async function searchArtistDNAByName(name: string): Promise<ApiResponse<ArtistDNA[]>> {
  try {
    const artistDNAs = await neuralIdentityStorage.findByName(name);
    return {
      success: true,
      data: artistDNAs,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to search ArtistDNA',
        code: 'SEARCH_FAILED',
      },
    };
  }
}

/**
 * ArtistDNAを更新
 *
 * @param id アーティストID
 * @param input 更新データ
 * @returns 更新されたArtistDNA
 */
export async function updateArtistDNA(
  id: string,
  input: UpdateArtistDNAInput
): Promise<ApiResponse<ArtistDNA>> {
  try {
    const artistDNA = await neuralIdentityStorage.update(id, input);
    return {
      success: true,
      data: artistDNA,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update ArtistDNA',
        code: (error as any).code || 'UPDATE_FAILED',
        details: (error as any).errors,
      },
    };
  }
}

/**
 * ArtistDNAを削除
 *
 * @param id アーティストID
 * @returns 削除が成功したかどうか
 */
export async function deleteArtistDNA(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const deleted = await neuralIdentityStorage.delete(id);
    return {
      success: true,
      data: { deleted },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete ArtistDNA',
        code: 'DELETE_FAILED',
      },
    };
  }
}
