import { format, parse } from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { EventTickets } from '@/types'

import { CustomText } from '../ui/display/CustomText'

interface TicketSectionHeaderProps {
	date: string
	eventTickets: EventTickets
}

const getTitle = (date: string, locale: string) => {
	const ticketDate = parse(date, 'yyyyMMdd', new Date())
	const now = new Date()
	const thisYear = now.getFullYear()
	const nowYYYYMMDD = format(now, 'yyyyMMdd')

	const selectedLocale = locale === 'ko' ? ko : enUS

	if (date === nowYYYYMMDD) {
		return locale === 'ko' ? '오늘' : 'Today'
	} else if (date.slice(0, 4) === thisYear.toString()) {
		return format(ticketDate, locale === 'ko' ? 'MMM do' : 'MMM d', {
			locale: selectedLocale
		})
	} else {
		return format(ticketDate, locale === 'ko' ? 'PPP' : 'PP', {
			locale: selectedLocale
		})
	}
}

export default function TicketSectionHeader({
	date,
	eventTickets
}: TicketSectionHeaderProps) {
	const { i18n } = useTranslation()

	return (
		<View className="left-2 flex-row items-center mb-4 h-8">
			<CustomText variant="h1Semibold">
				{getTitle(date, i18n.language)}
			</CustomText>
			<View className="bg-point-500 w-7 h-7 ml-2 rounded-full">
				<CustomText variant="body1Medium" className="text-center leading-7">
					{eventTickets.length}
				</CustomText>
			</View>
		</View>
	)
}
