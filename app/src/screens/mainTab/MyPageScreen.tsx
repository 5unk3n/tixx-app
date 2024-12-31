import { QueryErrorResetBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ScrollView, StyleSheet } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import ErrorFallback from '@/components/error/ErrorFallback'
import TicketManagementMenu from '@/components/tickets/TicketManagementMenu'

export default function MyPageScreen() {
	// const { data: eventTickets } = useEventTickets(['used'])

	return (
		<ScrollView
			className="flex-1"
			contentContainerStyle={style.contentContainerStyle}
		>
			{/* TODO: 후기 알림 */}
			{/* <GradientBorderView
				borderRadius={12}
				borderWidth={1}
				colors={[colors.point[3], colors.grayscale[8]]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				className="mb-6"
			>
				<View className="bg-point-5a12 px-8 py-7">
					<CustomText variant="body1Medium" className="text-grayscale-8">
						[Coyseio 24 F/W] 가 후기를 기다리고 있어요
					</CustomText>
				</View>
			</GradientBorderView> */}
			<QueryErrorResetBoundary>
				{({ reset }) => (
					<ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
						<Suspense fallback={<ActivityIndicator className="flex-1" />}>
							<TicketManagementMenu />
						</Suspense>
					</ErrorBoundary>
				)}
			</QueryErrorResetBoundary>
			{/* TODO: 반응 남기기 */}
			{/* <CustomText variant="headline1Semibold" className="mb-5">
				반응을 기다리는 티켓
			</CustomText>
			<View className="gap-3">
				{eventTickets?.map((eventTicket) => (
					<MyTicket key={eventTicket.id} eventTicket={eventTicket} />
				))}
			</View> */}
		</ScrollView>
	)
}

const style = StyleSheet.create({
	contentContainerStyle: {
		paddingTop: 14,
		paddingHorizontal: 20,
		paddingBottom: 122
	}
})
