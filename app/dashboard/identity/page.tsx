'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { useForm } from '@/lib/hooks/useForm'
import { useToast } from '@/lib/hooks/useToast'
import ToastContainer from '@/components/ui/ToastContainer'

interface IdentityFormData {
  artistName: string
  genre: string
  biography: string
  influences: string
}

export default function IdentityPage() {
  const { toasts, removeToast, success, error: showError } = useToast()
  const [selectedTags, setSelectedTags] = useState<string[]>(['メロディック', 'リズミカル'])

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm<IdentityFormData>(
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      success('プロフィールを保存しました')
      console.log('Saving identity:', { ...data, tags: selectedTags })
    } catch (err) {
      showError('保存に失敗しました')
    }
  }

  return (
    <DashboardLayout
      title="Neural Identity"
      description="アーティストのDNAを定義し、独自の個性を保存・管理します"
    >
      <ToastContainer toasts={toasts} onClose={removeToast} />

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
            onClick={() => window.history.back()}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            保存する
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}
