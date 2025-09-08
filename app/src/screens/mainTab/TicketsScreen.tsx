import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ActivityIndicator } from 'react-native-paper'

import ErrorFallback from '@/components/error/ErrorFallback'
import TicketCarouselSection from '@/components/tickets/TicketCarouselSection'

export default function TicketsScreen() {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
					<Suspense fallback={<ActivityIndicator className="flex-1" />}>
						<TicketCarouselSection />
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	)
}
