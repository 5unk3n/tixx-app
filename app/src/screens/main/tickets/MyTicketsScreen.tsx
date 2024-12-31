import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import EmptyTickets from '@/components/tickets/EmptyTickets'
import TicketListItem from '@/components/tickets/TicketListItem'
import Tabs from '@/components/ui/navigation/Tabs'
import { UI } from '@/constants/ui'
import { useEventTickets } from '@/hooks/queries/eventTickets/useEventTickets'
import { EventTicketStatus } from '@/types'
import { formatTicketDate } from '@/utils/formatters'

const tabMap: Record<string, EventTicketStatus[]> = {
	available: ['available'],
	used: ['used'],
	expiredOrCancelled: ['expired', 'cancelled']
}
export default function MyTicketsScreen() {
	const [activeTab, setActiveTab] = useState<
		'available' | 'used' | 'expiredOrCancelled'
	>('available')
	const { data: groupedEventTickets } = useEventTickets(tabMap[activeTab])

	return (
		<View className="flex-1 pt-3 px-5">
			<Tabs value={activeTab} onChange={setActiveTab} type="filled">
				<Tabs.Tab value="available" label={UI.TICKETS.AVAILABLE_TAB} />
				<Tabs.Tab value="used" label={UI.TICKETS.USED_TAB} />
				<Tabs.Tab
					value="expiredOrCancelled"
					label={UI.TICKETS.EXPIRED_OR_CANCELED_TAB}
				/>
			</Tabs>
			<ScrollView
				className="gap-3 mt-4"
				contentContainerStyle={styles.container}
			>
				{groupedEventTickets?.length ? (
					groupedEventTickets.map((eventTicket) => (
						<TicketListItem
							key={eventTicket.id}
							eventTicket={eventTicket}
							statusText={
								eventTicket.status === 'used'
									? `${formatTicketDate(eventTicket.usedAt as string)} ${UI.TICKETS.USED_STATUS}`
									: eventTicket.status === 'expired'
										? UI.TICKETS.EXPIRED_STATUS
										: eventTicket.status === 'cancelled'
											? UI.TICKETS.CANCELED_STATUS
											: ''
							}
						/>
					))
				) : (
					<EmptyTickets />
				)}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		minHeight: '100%',
		paddingBottom: 16
	}
})
