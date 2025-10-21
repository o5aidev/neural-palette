import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-gray-900
        rounded-lg border border-gray-200 dark:border-gray-800
        p-6
        ${hover ? 'transition-all hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
