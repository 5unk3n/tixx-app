import { parseISO } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { Badge } from '../ui/badge'

import { Event } from '@/types'

const now = new Date()

interface EventBadgesProps {
	event: Pick<Event, 'startDate' | 'startTime' | 'endDate' | 'endTime' | 'tags'>
}

export default function EventBadges({ event }: EventBadgesProps) {
	const { t } = useTranslation()
	const startDateTimeUTC = parseISO(`${event.startDate}T${event.startTime}Z`)
	const endDateTimeUTC = parseISO(`${event.endDate}T${event.endTime}Z`)

	const getStatusBadge = () => {
		if (now < startDateTimeUTC) {
			return <Badge variant={'secondary'}>{t('status.notStarted')}</Badge>
		}
		if (now > endDateTimeUTC) {
			return (
				<Badge variant={'gray'} className="text-grayscale-600">
					{t('event.ended')}
				</Badge>
			)
		}
		return <Badge variant={'primary'}>{t('status.inProgress')}</Badge>
	}

	return (
		<div className="flex gap-2">
			<Badge variant="black">{t(`category.${event.tags[0].tag}`)}</Badge>
			{getStatusBadge()}
		</div>
	)
}
