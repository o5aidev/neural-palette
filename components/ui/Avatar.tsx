import { ReactNode } from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: ReactNode | string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export default function Avatar({ src, alt = 'Avatar', fallback, size = 'md', className = '' }: AvatarProps) {
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  return (
    <div className={`${sizeStyles[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>{fallback || alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  )
}

interface AvatarGroupProps {
  children: ReactNode
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export function AvatarGroup({ children, max = 4, size = 'md' }: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children]
  const displayedChildren = max ? childArray.slice(0, max) : childArray
  const remaining = max && childArray.length > max ? childArray.length - max : 0

  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  return (
    <div className="flex -space-x-2">
      {displayedChildren.map((child, index) => (
        <div key={index} className="ring-2 ring-white dark:ring-gray-900 rounded-full">
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div className={`${sizeStyles[size]} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium ring-2 ring-white dark:ring-gray-900`}>
          +{remaining}
        </div>
      )}
    </div>
  )
}
