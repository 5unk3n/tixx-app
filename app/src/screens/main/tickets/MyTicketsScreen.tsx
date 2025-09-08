import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import EmptyTickets from '@/components/tickets/EmptyTickets'
import TicketListItem from '@/components/tickets/TicketListItem'
import Tabs from '@/components/ui/navigation/Tabs'
import { useEventTickets } from '@/hooks/queries/eventTickets/useEventTickets'
import { EventTicketStatus } from '@/types'
import { formatDateWithDay } from '@/utils/formatters'

const tabMap: Record<string, EventTicketStatus[]> = {
	available: ['available'],
	used: ['used'],
	expiredOrCancelled: ['expired', 'cancelled']
}
export default function MyTicketsScreen() {
	const [activeTab, setActiveTab] = useState<
		'available' | 'used' | 'expiredOrCancelled'
	>('available')
	const { t, i18n } = useTranslation()
	const { data: groupedEventTickets } = useEventTickets(tabMap[activeTab])

	return (
		<View className="flex-1 pt-3 px-5">
			<Tabs value={activeTab} onChange={setActiveTab} type="outline">
				<Tabs.Tab value="available" label={t('tickets.tabs.available')} />
				<Tabs.Tab value="used" label={t('tickets.tabs.used')} />
				<Tabs.Tab
					value="expiredOrCancelled"
					label={t('tickets.tabs.expiredOrCanceled')}
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
									? `${formatDateWithDay(eventTicket.usedAt!, i18n.language)} ${t('tickets.status.used')}`
									: eventTicket.status === 'expired'
										? t('tickets.status.expired')
										: eventTicket.status === 'cancelled'
											? t('tickets.status.canceled')
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
