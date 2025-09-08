import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import ErrorFallback from '@/components/error/ErrorFallback'
import TransferredTickets from '@/components/tickets/TransferredTickets'

export default function SentTicketsScreen() {
	return (
		<View className="flex-1 pt-6 px-5">
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
						<Suspense fallback={<ActivityIndicator className="flex-1" />}>
							<TransferredTickets type={'sent'} />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</View>
	)
}
