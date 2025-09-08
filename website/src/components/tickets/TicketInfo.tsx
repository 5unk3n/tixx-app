import { format, isSameDay, isSameYear, subDays } from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import Calendar from '@/assets/icons/calendar-number.svg?react'
import Clock from '@/assets/icons/clock.svg?react'
import { Ticket } from '@/types'

interface TicketInfoProps {
	ticket: Ticket
	startAt?: string
	endAt?: string
}

export default function TicketInfo({
	ticket,
	startAt,
	endAt
}: TicketInfoProps) {
	const { i18n } = useTranslation()

	const startDateTimeUTC = new Date(startAt ?? ticket.startAt)
	const endDateTimeUTC = new Date(endAt ?? ticket.endAt)

	const isAfterMidnightEvent =
		startDateTimeUTC.getHours() * 60 + startDateTimeUTC.getMinutes() >
		endDateTimeUTC.getHours() * 60 + endDateTimeUTC.getMinutes()
	const displayEndDateTimeUTC = isAfterMidnightEvent
		? subDays(endDateTimeUTC, 1)
		: endDateTimeUTC

	const getTicketDate = () => {
		const formattedStartDate = format(startDateTimeUTC, 'yyyy.MM.dd(E)', {
			locale: i18n.language === 'ko' ? ko : enUS
		})
		const formattedEndDate = isSameYear(startDateTimeUTC, displayEndDateTimeUTC)
			? format(displayEndDateTimeUTC, 'MM.dd(E)', {
					locale: i18n.language === 'ko' ? ko : enUS
				})
			: format(displayEndDateTimeUTC, 'yyyy.MM.dd(E)', {
					locale: i18n.language === 'ko' ? ko : enUS
				})

		if (isSameDay(startDateTimeUTC, displayEndDateTimeUTC)) {
			return formattedStartDate
		}
		return `${formattedStartDate} - ${formattedEndDate}`
	}

	const getTicketTime = () => {
		const formattedStartTime = format(startDateTimeUTC, 'HH:mm')
		const formattedEndTime = format(displayEndDateTimeUTC, 'HH:mm')

		return `${formattedStartTime} - ${formattedEndTime}`
	}

	return (
		<div className="flex flex-col gap-2.5 text-body-1 font-regular text-grayscale-600">
			<div className="flex items-center gap-1">
				<Calendar className="inline text-grayscale-600" />
				<span>{getTicketDate()}</span>
			</div>
			<div className="flex items-center gap-1">
				<Clock className="inline text-grayscale-600" />
				<span>{getTicketTime()}</span>
			</div>
		</div>
	)
}
