import * as React from 'react'

import { Button } from './button'

import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
	error?: boolean
	buttonText?: string
	onButtonClick?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{ className, type, buttonText, onButtonClick, error, disabled, ...props },
		ref
	) => {
		return (
			<div className="relative w-full">
				<input
					type={type}
					className={cn(
						'box-border flex h-[53px] w-full rounded-lg border border-grayscale-100 bg-grayscale-0 p-3 text-body-1 font-medium text-grayscale-900 transition-colors file:border-0 file:bg-transparent file:text-sm file:text-neutral-950 placeholder:text-grayscale-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 disabled:cursor-not-allowed disabled:border-grayscale-100 disabled:bg-grayscale-50 disabled:text-grayscale-500 dark:border-neutral-800 dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300',
						error && 'border-status-destructive',
						buttonText && 'pr-24',
						className
					)}
					ref={ref}
					disabled={disabled}
					{...props}
				/>
				{buttonText && (
					<Button
						type="button"
						variant="black"
						size="sm"
						className="absolute right-3 top-1/2 -translate-y-1/2"
						onClick={onButtonClick}
						disabled={disabled}
					>
						{buttonText}
					</Button>
				)}
			</div>
		)
	}
)
Input.displayName = 'Input'

export { Input }
