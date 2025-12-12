import { cn } from '@/lib/utils'
import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          className={cn(
            'w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none',
            'focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none',
            'placeholder:text-slate-400',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-300 hover:border-slate-400',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
