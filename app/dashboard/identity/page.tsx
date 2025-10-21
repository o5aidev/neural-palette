'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { useForm } from '@/lib/hooks/useForm'
import { useToast } from '@/lib/hooks/useToast'
import { useApi, useMutation } from '@/lib/hooks/useApi'
import ToastContainer from '@/components/ui/ToastContainer'
import { apiClient } from '@/lib/api/client'
import { ArtistIdentity, CreateIdentityInput } from '@/lib/api/types'

interface IdentityFormData {
  artistName: string
  genre: string
  biography: string
  influences: string
}

export default function IdentityPage() {
  const { toasts, removeToast, success, error: showError } = useToast()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Fetch existing identity
  const { data: identity, isLoading: isFetching, error: fetchError, refetch } = useApi<{ data: ArtistIdentity }>('/identity', {
    autoFetch: true
  })

  // Create/Update mutation
  const { mutate: saveIdentity, isLoading: isSaving } = useMutation<{ data: ArtistIdentity }, CreateIdentityInput>(
    async (data) => {
      if (identity?.data) {
        return await apiClient.put('/identity', data)
      } else {
        return await apiClient.post('/identity', data)
      }
    }
  )

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, setValues } = useForm<IdentityFormData>(
    {
      artistName: '',
      genre: '',
      biography: '',
      influences: ''
    },
    {
      artistName: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      genre: {
        required: true
      },
      biography: {
        maxLength: 500
      }
    }
  )

  // Load existing data into form
  useEffect(() => {
    if (identity?.data) {
      setValues({
        artistName: identity.data.artistName || '',
        genre: identity.data.genre || '',
        biography: identity.data.biography || '',
        influences: identity.data.influences?.join(', ') || ''
      })
      setSelectedTags(identity.data.musicalFeatures || [])
    }
  }, [identity, setValues])

  const availableTags = ['メロディック', 'リズミカル', 'ハーモニック', 'エクスペリメンタル', 'アンビエント', 'アグレッシブ']

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const onSubmit = async (data: IdentityFormData) => {
    try {
      const influences = data.influences
        ? data.influences.split(',').map(s => s.trim()).filter(Boolean)
        : []

      const payload: CreateIdentityInput = {
        artistName: data.artistName,
        genre: data.genre,
        biography: data.biography,
        influences,
        musicalFeatures: selectedTags
      }

      await saveIdentity(payload)
      await refetch()
      success('プロフィールを保存しました')
    } catch (err) {
      showError(err instanceof Error ? err.message : '保存に失敗しました')
    }
  }

  if (isFetching) {
    return (
      <DashboardLayout
        title="Neural Identity"
        description="アーティストのDNAを定義し、独自の個性を保存・管理します"
      >
        <div className="grid gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  if (fetchError && fetchError.message !== 'Identity not found') {
    return (
      <DashboardLayout
        title="Neural Identity"
        description="アーティストのDNAを定義し、独自の個性を保存・管理します"
      >
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            エラーが発生しました
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">
            {fetchError.message}
          </p>
          <Button variant="danger" onClick={() => refetch()}>
            再試行
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Neural Identity"
      description="アーティストのDNAを定義し、独自の個性を保存・管理します"
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {identity?.data && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            最終更新: {new Date(identity.data.updatedAt).toLocaleString('ja-JP')}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
        {/* Artist DNA Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">アーティストプロフィール</h2>
          <div className="space-y-4">
            <Input
              label="アーティスト名"
              placeholder="アーティスト名を入力"
              value={values.artistName}
              onChange={(e) => handleChange('artistName', e.target.value)}
              onBlur={() => handleBlur('artistName')}
              error={errors.artistName}
            />

            <Select
              label="ジャンル"
              value={values.genre}
              onChange={(e) => handleChange('genre', e.target.value)}
              onBlur={() => handleBlur('genre')}
              error={errors.genre}
            >
              <option value="">ジャンルを選択</option>
              <option value="pop">ポップ</option>
              <option value="rock">ロック</option>
              <option value="electronic">エレクトロニック</option>
              <option value="hiphop">ヒップホップ</option>
              <option value="jazz">ジャズ</option>
              <option value="classical">クラシック</option>
            </Select>

            <Textarea
              label="バイオグラフィー"
              rows={4}
              placeholder="アーティストの経歴や特徴を入力"
              value={values.biography}
              onChange={(e) => handleChange('biography', e.target.value)}
              onBlur={() => handleBlur('biography')}
              error={errors.biography}
              helperText={`${values.biography.length}/500文字`}
            />
          </div>
        </div>

        {/* Creative DNA Card */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">クリエイティブDNA</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                音楽的特徴
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {selectedTags.length}個選択中
              </p>
            </div>

            <Input
              label="影響を受けたアーティスト"
              placeholder="影響を受けたアーティストを入力"
              value={values.influences}
              onChange={(e) => handleChange('influences', e.target.value)}
              helperText="カンマ区切りで複数入力可能"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.location.href = '/'}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
          >
            {identity?.data ? '更新する' : '作成する'}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
