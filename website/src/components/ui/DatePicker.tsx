'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar, CalendarProps } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps<T extends FieldValues> {
	field: ControllerRenderProps<T>
	placeholder?: string
	calendarProps?: Omit<CalendarProps, 'showOutsideDays'>
}

export function DatePicker<T extends FieldValues>({
	field,
	placeholder,
	calendarProps
}: DatePickerProps<T>) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'grayLine'}
					className={cn(
						'w-full justify-start text-left font-normal',
						!field.value && 'text-muted-foreground'
					)}
				>
					{field.value ? (
						format(field.value, 'PP', { locale: ko })
					) : (
						<span className="text-grayscale-500">{placeholder}</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					{...calendarProps}
					mode="single"
					selected={field.value}
					onSelect={field.onChange}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
