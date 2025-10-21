'use client'

import { useState, useCallback, FormEvent } from 'react'

export interface FormErrors {
  [key: string]: string
}

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | undefined
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback(
    (name: string, value: any): string | undefined => {
      if (!validationRules || !validationRules[name]) return undefined

      const rules = validationRules[name]

      if (rules.required && !value) {
        return 'この項目は必須です'
      }

      if (rules.minLength && value.length < rules.minLength) {
        return `${rules.minLength}文字以上入力してください`
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `${rules.maxLength}文字以内で入力してください`
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return '形式が正しくありません'
      }

      if (rules.custom) {
        return rules.custom(value)
      }

      return undefined
    },
    [validationRules]
  )

  const validateAll = useCallback((): boolean => {
    if (!validationRules) return true

    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName])
      if (error) {
        newErrors[fieldName] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validationRules, validateField])

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))

      if (touched[name]) {
        const error = validateField(name, value)
        setErrors((prev) => ({
          ...prev,
          [name]: error || ''
        }))
      }
    },
    [touched, validateField]
  )

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }))
      const error = validateField(name, values[name])
      setErrors((prev) => ({
        ...prev,
        [name]: error || ''
      }))
    },
    [values, validateField]
  )

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) => {
      return async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const isValid = validateAll()
        if (!isValid) {
          setIsSubmitting(false)
          return
        }

        try {
          await onSubmit(values)
        } catch (error) {
          console.error('Form submission error:', error)
        } finally {
          setIsSubmitting(false)
        }
      }
    },
    [values, validateAll]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors
  }
}
