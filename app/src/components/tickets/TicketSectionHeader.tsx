import { format, parse } from 'date-fns'
import React from 'react'
import { View } from 'react-native'

import { EventTickets } from '@/types'

import { CustomText } from '../ui/display/CustomText'

interface TicketSectionHeaderProps {
	date: string
	eventTickets: EventTickets
}

const getTitle = (date: string) => {
	const ticketDate = parse(date, 'yyyyMMdd', new Date())
	const now = new Date()
	const thisYear = now.getFullYear()
	const nowYYYYMMDD = format(now, 'yyyyMMdd')

	if (date === nowYYYYMMDD) {
		return '오늘'
	} else if (date.slice(0, 4) === thisYear.toString()) {
		return format(ticketDate, 'M월 d일')
	} else {
		return format(ticketDate, 'yyyy년 M월 d일')
	}
}

export default function TicketSectionHeader({
	date,
	eventTickets
}: TicketSectionHeaderProps) {
	return (
		<View className="left-2 flex-row items-center mb-4 h-8">
			<CustomText variant="h1Semibold">{getTitle(date)}</CustomText>
			<View className="bg-point-3 w-7 h-7 ml-2 rounded-full">
				<CustomText variant="body1Medium" className="text-center leading-7">
					{eventTickets.length}
				</CustomText>
			</View>
		</View>
	)
}
