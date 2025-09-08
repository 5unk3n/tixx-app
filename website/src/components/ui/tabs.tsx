import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const tabsListVariants = cva('inline-flex h-12 items-center justify-center ', {
	variants: {
		variant: {
			default: 'gap-7 text-grayscale-400 h-auto',
			underline: 'border-b bg-grayscale-0 border-grayscale-100'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
})

const tabsTriggerVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ',
	{
		variants: {
			variant: {
				default:
					'rounded-2xl p-2 text-label-1 font-medium ring-offset-white transition-all data-[state=active]:bg-grayscale-50 data-[state=active]:text-grayscale-900',
				underline:
					'text-grayscale-500 px-9 py-3 data-[state=active]:text-grayscale-900 data-[state=active]:border-grayscale-900 data-[state=active]:border-b'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
		VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(tabsListVariants({ variant, className }))}
		{...props}
	/>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
		VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(tabsTriggerVariants({ variant, className }))}
		{...props}
	/>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
			className
		)}
		{...props}
	/>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
