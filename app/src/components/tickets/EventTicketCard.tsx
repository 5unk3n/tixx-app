import React, { useState } from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'

import { EventTicket } from '@/types'

import BaseTicketCard from './BaseTicketCard'
import TicketCardDetailOverlay from './TicketCardDetailOverlay'

interface EventTicketCardProps {
	eventTicket: Omit<EventTicket, 'transfers'>
	defaultIsDetailVisible?: boolean
}

export default function EventTicketCard({
	eventTicket,
	defaultIsDetailVisible = false
}: EventTicketCardProps) {
	const [isDetailVisible, setIsDetailVisible] = useState(defaultIsDetailVisible)

	return (
		<TouchableWithoutFeedback
			onPress={() => setIsDetailVisible((prev) => !prev)}
		>
			<View>
				<BaseTicketCard eventTicket={eventTicket} />
				{isDetailVisible && (
					<TicketCardDetailOverlay eventTicket={eventTicket} />
				)}
			</View>
		</TouchableWithoutFeedback>
	)
}
