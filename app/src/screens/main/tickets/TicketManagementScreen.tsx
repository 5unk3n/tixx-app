import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import ErrorFallback from '@/components/error/ErrorFallback'
import MyTickets from '@/components/tickets/MyTickets'
import TransferredTickets from '@/components/tickets/TransferredTickets'
import Tabs from '@/components/ui/navigation/Tabs'

export default function TicketManagementScreen() {
	const { t } = useTranslation()
	const [tab, setTab] = useState<'myTickets' | 'received' | 'sent'>('myTickets')

	return (
		<View className="flex-1">
			<Tabs value={tab} onChange={(value) => setTab(value as typeof tab)}>
				<Tabs.Tab value="myTickets" label={t('tickets.tabs.myTickets')} />
				<Tabs.Tab value="received" label={t('tickets.tabs.received')} />
				<Tabs.Tab value="sent" label={t('tickets.tabs.sent')} />
			</Tabs>
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
						<Suspense fallback={<ActivityIndicator className="flex-1" />}>
							{tab === 'myTickets' ? (
								<MyTickets />
							) : (
								<View className="flex-1 p-4 pb-1">
									{tab === 'received' && (
										<TransferredTickets type={'received'} />
									)}
									{tab === 'sent' && <TransferredTickets type={'sent'} />}
								</View>
							)}
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</View>
	)
}
