'use client'

import { FormHTMLAttributes, ReactNode } from 'react'

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
}

export default function Form({ children, className = '', ...props }: FormProps) {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  )
}

interface FormFieldProps {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, error, helperText, required, children }: FormFieldProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  )
}
