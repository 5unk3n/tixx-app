import { format } from 'date-fns'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '../ui/select'

import { useEvents } from '@/hooks/queries/events/useEvents'
import { CreateEventForm } from '@/types'

interface RecentEventSelectProps {
	hostId: number
	onChange: (event: Partial<CreateEventForm>) => void
	onMouseEnter: (event: Partial<CreateEventForm>) => void
	onMouseLeave: () => void
}

export default function RecentEventSelect({
	hostId,
	onChange,
	onMouseEnter,
	onMouseLeave
}: RecentEventSelectProps) {
	const { t } = useTranslation()

	const { data: events } = useEvents(hostId)
	const [selectedId, setSelectedId] = useState<string>('')

	// FIXME: 매핑하기
	const handleValueChange = (value: string) => {
		setSelectedId(value)
		const selectedEvent = events?.find((e) => String(e.id) === value)
		if (selectedEvent) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			onChange(selectedEvent)
		}
	}

	const handleMouseEnter = (id: string) => {
		const hoveredEvent = events?.find((e) => String(e.id) === id)
		if (hoveredEvent) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			onMouseEnter(hoveredEvent)
		}
	}

	const handleMouseLeave = () => {
		onMouseLeave()
	}

	return (
		<Select value={selectedId} onValueChange={handleValueChange}>
			<SelectTrigger>
				<SelectValue placeholder={t('event.recentEventSelectPlaceholder')} />
			</SelectTrigger>
			<SelectContent>
				{events
					?.slice(-4)
					.reverse()
					.map((event) => (
						<SelectItem
							key={event.id}
							value={String(event.id)}
							className="h-[72px]"
							onMouseEnter={() => handleMouseEnter(String(event.id))}
							onMouseLeave={handleMouseLeave}
						>
							<p>{event.name}</p>
							<p className="mt-1.5 text-label-1 font-regular text-grayscale-500">{`${format(event.startDate, 'yyyy.MM.dd')} ${t('event.held')}`}</p>
						</SelectItem>
					))}
			</SelectContent>
		</Select>
	)
}
