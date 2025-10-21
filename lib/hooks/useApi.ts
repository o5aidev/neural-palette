'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api/client'

export interface UseApiOptions {
  autoFetch?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const { autoFetch = false, onSuccess, onError } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await apiClient.get<T>(endpoint)
      setData(result)
      onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, onSuccess, onError])

  useEffect(() => {
    if (autoFetch) {
      execute()
    }
  }, [autoFetch, execute])

  const refetch = useCallback(() => {
    return execute()
  }, [execute])

  return {
    data,
    error,
    isLoading,
    execute,
    refetch
  }
}

export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await mutationFn(variables)
        setData(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [mutationFn]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    data,
    error,
    isLoading,
    mutate,
    reset
  }
}
