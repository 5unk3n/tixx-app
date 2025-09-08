import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import EventTags from '@/components/events/EventTags'
import BulletText from '@/components/ui/display/BulletText'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomButton from '@/components/ui/input/CustomButton'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { MainStackParamList } from '@/types/navigation'
import { formatDateWithDay, formatTimeRange } from '@/utils/formatters'

type Props = NativeStackScreenProps<MainStackParamList, 'ReceivedTicketDetail'>

export default function ReceivedTicketDetailScreen({
	navigation,
	route
}: Props) {
	const { colors } = useCustomTheme()
	const { t, i18n } = useTranslation()
	const eventTicketTransfer = route.params

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View className="absolute w-screen h-60">
				<Image
					source={{ uri: eventTicketTransfer.eventTicket.event.imageUrl }}
					className="h-60"
				/>
				<LinearGradient
					colors={['transparent', 'transparent', colors.background]}
					locations={[0, 0.2, 1]}
					className="absolute top-0 bottom-0 left-0 right-0"
				/>
			</View>
			<CustomText variant="h1Semibold" className="mt-40 mb-6">
				{t('tickets.messages.accepted')}
			</CustomText>
			<View>
				<EventTags
					tags={eventTicketTransfer.eventTicket.event.tags}
					className="mb-2"
				/>
				{/* FIXME: 이벤트 상세 화면 params 수정 필요, mb-4 제거 및 버튼 추가 */}
				<CustomText variant="h1Semibold" className="mb-4">
					{eventTicketTransfer.eventTicket.event.name}
				</CustomText>
				<CustomButton
					mode="text"
					size="sm"
					labelVariant="body3Regular"
					className="-ml-3 mb-4"
					labelStyle={{ color: colors.grayscale[400] }}
					onPress={() =>
						navigation.navigate('EventDetail', {
							eventId: eventTicketTransfer.eventTicket.event.id
						})
					}
				>
					{t('tickets.viewDetail')}
				</CustomButton>
			</View>
			<View className="gap-4 pb-9">
				<View className="flex-row">
					<CustomIcon name="calendar" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-100">
						{formatDateWithDay(
							eventTicketTransfer.eventTicket.ticket.startAt,
							i18n.language
						)}
					</CustomText>
				</View>
				<View className="flex-row">
					<CustomIcon name="time" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-100">
						{t(
							'tickets.entryTime',
							formatTimeRange(
								eventTicketTransfer.eventTicket.ticket.startAt,
								eventTicketTransfer.eventTicket.ticket.endAt
							)
						)}
					</CustomText>
				</View>
				<View className="flex-row">
					<CustomIcon name="place" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-100">
						{eventTicketTransfer.eventTicket.event.place.name}
					</CustomText>
				</View>
				<View className="flex-row">
					<CustomIcon name="pin" size={20} className="mr-2" />
					<CustomText variant="body1Regular" className="text-grayscale-100">
						{eventTicketTransfer.eventTicket.event.memo}
					</CustomText>
				</View>
			</View>
			<View className="py-4 px-5 mb-5 bg-grayscale-700 rounded-2xl">
				<BulletText variant="body3RegularLarge" className="text-grayscale-500">
					{t('tickets.notices.accountDeletion')}
				</BulletText>
				<BulletText variant="body3RegularLarge" className="text-grayscale-500">
					{t('tickets.notices.recovery')}
				</BulletText>
			</View>
			<CustomButton
				onPress={() => navigation.navigate('MainTab')}
				className="bottom-0 mt-auto mb-2"
			>
				{t('common.confirm')}
			</CustomButton>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: { paddingHorizontal: 20, minHeight: '100%' }
})
