'use client'

import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="absolute left-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              isDestructive ? 'bg-red-50 text-red-600' : 'bg-[#1a233a]/5 text-[#c5a059]'
            }`}
          >
            <AlertTriangle className="h-6 w-6" />
          </div>

          <div className="text-right">
            <h3 className="text-lg font-bold text-[#1a233a]">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2 text-sm font-bold text-white transition ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#1a233a] text-[#c5a059] hover:bg-[#1a233a]/90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}