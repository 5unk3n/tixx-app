import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native-paper'

import ErrorFallback from '@/components/error/ErrorFallback'
import TransferredTickets from '@/components/tickets/TransferredTickets'

export default function ReceivedTicketsScreen() {
	return (
		<View className="flex-1 pt-6 px-5">
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
						<Suspense fallback={<ActivityIndicator className="flex-1" />}>
							<ScrollView
								className="gap-3"
								contentContainerStyle={styles.container}
							>
								<TransferredTickets type={'received'} />
							</ScrollView>
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		minHeight: '100%',
		paddingBottom: 16
	}
})
