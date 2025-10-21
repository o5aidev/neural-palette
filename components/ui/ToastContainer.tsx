'use client'

import Toast from './Toast'
import { Toast as ToastType } from '@/lib/hooks/useToast'

interface ToastContainerProps {
  toasts: ToastType[]
  onClose: (id: string) => void
}

export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}
