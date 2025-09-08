import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
	'inline-flex items-center rounded-lg px-3 py-1 text-label-1 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:border-neutral-800 dark:focus:ring-neutral-300',
	{
		variants: {
			variant: {
				primary: 'bg-primary-500 text-grayscale-900',
				secondary: 'bg-primary-400 text-[#7F8400]',
				black: 'bg-grayscale-900 text-grayscale-0',
				gray: 'bg-grayscale-200 text-grayscale-0'
			}
		},
		defaultVariants: {
			variant: 'primary'
		}
	}
)

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	)
}

export { Badge, badgeVariants }
