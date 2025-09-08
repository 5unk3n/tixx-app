import {
	differenceInDays,
	format,
	isSameDay,
	isSameYear,
	parseISO,
	startOfDay,
	subDays
} from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import Calendar from '@/assets/icons/calendar-number.svg?react'
import Clock from '@/assets/icons/clock.svg?react'
import { cn } from '@/lib/utils'
import { Event, Events } from '@/types'

interface EventInfoProps {
	event: Event | Events[0]
	isExtend?: boolean
}

// TODO: 아이콘 수정
export default function EventInfo({ event, isExtend }: EventInfoProps) {
	const { t, i18n } = useTranslation()
	const startDateTimeUTC = parseISO(`${event.startDate}T${event.startTime}Z`)
	const endDateTimeUTC = parseISO(`${event.endDate}T${event.endTime}Z`)
	const isAfterMidnightEvent =
		startDateTimeUTC.getHours() * 60 + startDateTimeUTC.getMinutes() >
		endDateTimeUTC.getHours() * 60 + endDateTimeUTC.getMinutes()
	const displayEndDateTimeUTC = isAfterMidnightEvent
		? subDays(endDateTimeUTC, 1)
		: endDateTimeUTC

	const getEventDate = () => {
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
		const durationDays =
			differenceInDays(
				startOfDay(displayEndDateTimeUTC),
				startOfDay(startDateTimeUTC)
			) + 1

		if (isSameDay(startDateTimeUTC, displayEndDateTimeUTC)) {
			return `${formattedStartDate} (${t('event.duration', {
				count: durationDays,
				unit: t('event.day')
			})})`
		}
		return `${formattedStartDate} - ${formattedEndDate} (${t('event.duration', {
			count: durationDays,
			unit: t('event.days')
		})})`
	}

	const getEventTime = () => {
		const formattedStartTime = format(startDateTimeUTC, 'HH:mm')
		const formattedEndTime = format(displayEndDateTimeUTC, 'HH:mm')

		return `${formattedStartTime} - ${formattedEndTime}`
	}

	return (
		<div className="text-label-1 font-regular text-grayscale-500">
			<div>
				{isExtend ? (
					<p>{t('event.dateLabel')}</p>
				) : (
					<Calendar className="mr-2 inline text-grayscale-600" />
				)}
				<p
					className={cn(
						'inline text-body-1 text-grayscale-600',
						isExtend && 'text-grayscale-900'
					)}
				>
					{getEventDate()}
				</p>
			</div>
			<div className="mt-2 md:mt-4">
				{isExtend ? (
					<p>{t('event.timeLabel')}</p>
				) : (
					<Clock className="mr-2 inline text-grayscale-600" />
				)}
				<p
					className={cn(
						'inline text-body-1 text-grayscale-600',
						isExtend && 'text-grayscale-900'
					)}
				>
					{getEventTime()}
				</p>
			</div>
			{isExtend && 'place' in event && (
				<>
					<div className="mt-2 md:mt-4">
						<p>{t('event.placeLabel')}</p>
						<p className="text-body-1 text-grayscale-900">
							{event.place.address + ' ' + event.place.name}
						</p>
					</div>
					<div className="mt-2 md:mt-4">
						<p>{t('event.benefitLabel')}</p>
						<p className="text-body-1 text-grayscale-900">{event.memo}</p>
					</div>
				</>
			)}
		</div>
	)
}
