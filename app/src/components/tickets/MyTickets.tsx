import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, FlatList } from 'react-native'
import { Divider } from 'react-native-paper'

import { useEventTickets } from '@/hooks/queries/eventTickets/useEventTickets'
import { EventTicketStatus } from '@/types'
import { formatDateWithDay } from '@/utils/formatters'

import EmptyTickets from './EmptyTickets'
import TicketListItem from './TicketListItem'
import Tabs from '../ui/navigation/Tabs'

const tabMap: Record<string, EventTicketStatus[]> = {
	available: ['available'],
	used: ['used'],
	expiredOrCancelled: ['expired', 'cancelled']
}

export default function MyTickets() {
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
			<FlatList
				keyExtractor={(item) => item.id.toString()}
				data={groupedEventTickets}
				renderItem={({ item }) => (
					<TicketListItem
						eventTicket={item}
						statusText={
							item.status === 'used'
								? `${formatDateWithDay(item.usedAt!, i18n.language)} ${t('tickets.status.used')}`
								: item.status === 'expired'
									? t('tickets.status.expired')
									: item.status === 'cancelled'
										? t('tickets.status.canceled')
										: ''
						}
					/>
				)}
				ItemSeparatorComponent={TicketDivider}
				ListEmptyComponent={
					<View className="mt-20">
						<EmptyTickets />
					</View>
				}
				className="flex-1 mt-4"
			/>
		</View>
	)
}

function TicketDivider() {
	return <Divider className="bg-grayscale-600 my-6" />
}
