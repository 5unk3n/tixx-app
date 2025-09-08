import * as React from 'react'

import { cn } from '@/lib/utils'

const spinnerVariants =
	'w-6 h-6 border-4 border-t-4 border-gray-200 border-t-gray-600 rounded-full animate-spin'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn(spinnerVariants, className)} {...props} />
	)
)

Spinner.displayName = 'Spinner'

export { Spinner }
