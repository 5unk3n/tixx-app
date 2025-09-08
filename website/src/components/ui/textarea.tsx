import * as React from 'react'

import { cn } from '@/lib/utils'

interface TextareaProps extends React.ComponentProps<'textarea'> {
	error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, error, ...props }, ref) => {
		return (
			<textarea
				className={cn(
					'flex min-h-[60px] w-full rounded-lg border border-grayscale-100 bg-grayscale-0 bg-transparent p-3 text-body-1 font-medium text-grayscale-900 placeholder:text-grayscale-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300',
					error && 'border-status-destructive',
					className
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)
Textarea.displayName = 'Textarea'

export { Textarea }
