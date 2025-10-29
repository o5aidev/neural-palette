'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import { KPICard } from '@/components/ui/KPICard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { useForm } from '@/lib/hooks/useForm'
import { useToast } from '@/lib/hooks/useToast'
import { useApi, useMutation } from '@/lib/hooks/useApi'
import ToastContainer from '@/components/ui/ToastContainer'
import { apiClient } from '@/lib/api/client'
import { ArtistIdentity, CreateIdentityInput } from '@/lib/api/types'
import { ArtistStats } from '@/components/identity/ArtistStats'

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

  const { values, errors, handleChange, handleBlur, handleSubmit, setValues } = useForm<IdentityFormData>(
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
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Neural Identity
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              アーティストのDNAを定義し、独自の個性を保存・管理
            </p>
          </div>
          <div className="grid gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (fetchError && fetchError.message !== 'Identity not found') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Neural Identity
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              アーティストのDNAを定義し、独自の個性を保存・管理
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
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
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="space-y-6">
        {/* Header with Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Neural Identity
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              アーティストのDNAを定義し、独自の個性を保存・管理
            </p>
          </div>

          <div className="flex items-center gap-3">
            {identity?.data && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                最終更新: {new Date(identity.data.updatedAt).toLocaleDateString('ja-JP')}
              </div>
            )}
            <button className="p-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="プロフィール完成度"
            value={identity?.data ? '100%' : '0%'}
            change={identity?.data ? '完了' : '未作成'}
            period="全体"
            trend={identity?.data ? 'up' : 'neutral'}
          />
          <KPICard
            label="音楽的特徴"
            value={selectedTags.length.toString()}
            change={`${selectedTags.length}個選択`}
            period="DNA"
            trend="up"
          />
          <KPICard
            label="影響アーティスト"
            value={values.influences.split(',').filter(Boolean).length.toString()}
            change="登録済み"
            period="履歴"
            trend="neutral"
          />
          <KPICard
            label="バイオグラフィー"
            value={`${values.biography.length}`}
            change="/500文字"
            period="詳細度"
            trend={values.biography.length > 200 ? 'up' : 'neutral'}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          {/* Artist DNA Profile Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">アーティストプロフィール</h2>
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">クリエイティブDNA</h2>
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

        {/* Artist Stats */}
        {identity?.data && <ArtistStats />}
      </div>
    </DashboardLayout>
  )
}
