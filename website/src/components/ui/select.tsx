import * as SelectPrimitive from '@radix-ui/react-select'
import { cva } from 'class-variance-authority'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

// SelectTrigger variants
const selectTriggerVariants = cva(
	'flex w-full items-center justify-between whitespace-nowrap rounded-lg border border-neutral-200 bg-transparent shadow-sm ring-offset-white focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-grayscale-400 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[placeholder]:text-neutral-400 [&>span]:line-clamp-1',
	{
		variants: {
			size: {
				md: 'h-[53px] p-3 text-body-1 font-medium',
				sm: 'h-[31px] px-3 py-2'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
)

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(selectTriggerVariants({ className }))}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className="h-6 w-6 opacity-50" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// SelectScrollUpButton variants
const selectScrollUpButtonVariants = cva(
	'flex cursor-default items-center justify-center py-1'
)

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn(selectScrollUpButtonVariants({ className }))}
		{...props}
	>
		<ChevronUp className="h-4 w-4" />
	</SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

// SelectScrollDownButton variants
const selectScrollDownButtonVariants = cva(
	'flex cursor-default items-center justify-center py-1'
)

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn(selectScrollDownButtonVariants({ className }))}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName

// SelectContent variants
const selectContentVariants = cva(
	'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-grayscale-100 bg-white text-grayscale-500 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
	{
		variants: {
			position: {
				popper:
					'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
				'item-aligned': ''
			},
			size: { md: '', sm: 'min-w-20 rounded-2xl' }
		},
		defaultVariants: {
			position: undefined,
			size: 'md'
		}
	}
)

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={cn(selectContentVariants({ position, className }))}
			position={position}
			{...props}
		>
			<SelectScrollUpButton />
			<SelectPrimitive.Viewport
				className={cn(selectViewportVariants({ position, className }))}
			>
				{children}
			</SelectPrimitive.Viewport>
			<SelectScrollDownButton />
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

// SelectLabel variants
const selectLabelVariants = cva('px-2 py-1.5 text-sm font-semibold')

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn(selectLabelVariants({ className }))}
		{...props}
	/>
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

// SelectItem variants
const selectItemVariants = cva(
	'relative flex w-full cursor-default select-none items-center rounded-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50',
	{
		variants: {
			size: {
				md: 'h-[53px] text-body-1 font-medium px-[33px] py-[14px]',
				sm: ''
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
)

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(selectItemVariants({ className }))}
		{...props}
	>
		<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

// SelectSeparator variants
const selectSeparatorVariants = cva(
	'-mx-1 my-1 h-px bg-neutral-100 dark:bg-neutral-800'
)

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		className={cn(selectSeparatorVariants({ className }))}
		{...props}
	/>
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// SelectViewport variants
const selectViewportVariants = cva('', {
	variants: {
		position: {
			popper:
				'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
			'item-aligned': ''
		}
	},
	defaultVariants: {
		position: undefined
	}
})

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
	selectTriggerVariants,
	selectScrollUpButtonVariants,
	selectScrollDownButtonVariants,
	selectContentVariants,
	selectViewportVariants,
	selectLabelVariants,
	selectItemVariants,
	selectSeparatorVariants
}
