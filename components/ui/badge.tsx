import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary' | 'secondary' | 'outline'
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  // Wamodern: Muted, desaturated colors with minimal border
  const variantStyles = {
    default: 'bg-muted text-muted-foreground border border-border',
    neutral: 'bg-muted text-muted-foreground border border-border',
    success: 'bg-secondary/10 text-secondary border border-secondary/20',
    warning: 'bg-destructive/10 text-destructive border border-destructive/20',
    danger: 'bg-destructive/10 text-destructive border border-destructive/20',
    info: 'bg-primary/10 text-primary border border-primary/20',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
    outline: 'bg-transparent text-foreground border border-border'
  }

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }

  return (
    <span className={`inline-flex items-center font-normal tracking-wide transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  )
}
