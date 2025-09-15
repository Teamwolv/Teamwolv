"use client"

import { useState } from "react"
import { Save, Check, X } from "lucide-react"

interface SaveButtonProps {
  onSave: () => Promise<void>
  disabled?: boolean
  className?: string
}

export function SaveButton({ onSave, disabled = false, className = "" }: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      await onSave()
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
      setTimeout(() => setError(null), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col items-end space-y-2">
      <button
        onClick={handleSave}
        disabled={disabled || isSaving}
        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
          isSuccess
            ? 'bg-green-500 text-white'
            : error
            ? 'bg-red-500 text-white'
            : 'bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed'
        } ${className}`}
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Saving...</span>
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-4 h-4" />
            <span>Saved!</span>
          </>
        ) : error ? (
          <>
            <X className="w-4 h-4" />
            <span>Error</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-500 text-right max-w-xs">{error}</p>
      )}
    </div>
  )
}
