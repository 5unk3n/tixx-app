import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	'inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-neutral-300',
	{
		variants: {
			variant: {
				primary:
					'bg-primary-500 text-grayscale-900 hover:bg-primary-600 disabled:bg-primary-300 active:bg-primary-700',
				black:
					'bg-grayscale-900 text-grayscale-0 hover:bg-grayscale-700 disabled:bg-grayscale-500 active:bg-grayscale-800',
				gray: 'bg-[#F2F2F2] text-grayscale-900 hover:bg-grayscale-100 disabled:bg-grayscale-500 active:bg-grayscale-200',
				primaryLine:
					'bg-grayscale-0 text-primary-500 border border-primary-500 hover:bg-primary-50 disabled:text-primary-100 disabled:border-primary-100 active:border-primary-600 active:text-primary-600',
				blackLine:
					'bg-grayscale-0 text-grayscale-700 content-border border border-grayscale-500 hover:bg-grayscale-50 hover:border-grayscale-600 disabled:bg-grayscale-0 disabled:text-grayscale-300 active:border-grayscale-700 active:text-grayscale-800',
				grayLine:
					'bg-grayscale-0 text-grayscale-900 content-border border border-grayscale-[#D5D5D5] hover:bg-grayscale-50 hover:border-grayscale-400 disabled:bg-grayscale-0 disabled:text-grayscale-300 active:border-grayscale-700 active:text-grayscale-800',
				ghost:
					'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-[53px] px-4 text-body-2 font-semibold [&_svg]:size-5',
				sm: 'h-[29px] px-3 text-caption-1 font-regular',

				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default'
		}
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
	}
)
Button.displayName = 'Button'

export { Button, buttonVariants }
