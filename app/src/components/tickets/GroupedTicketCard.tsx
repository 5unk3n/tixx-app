import { useNavigation } from '@react-navigation/native'
import { isAxiosError } from 'axios'
import { isWithinInterval } from 'date-fns'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	ViewProps,
	ViewStyle
} from 'react-native'
import Toast from 'react-native-toast-message'

import { useEventTicketUseByUser } from '@/hooks/queries/eventTickets/useEventTicketUseByUser'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { GroupedEventTicket } from '@/types'

import BaseTicketCard from './BaseTicketCard'
import CancelBottomSheet from './CancelBottomSheet'
import TicketCardDetailOverlay from './TicketCardDetailOverlay'
import BulletText from '../ui/display/BulletText'
import { CustomText } from '../ui/display/CustomText'
import CustomDialog from '../ui/feedback/CustomDialog'
import CustomButton from '../ui/input/CustomButton'

interface GroupedTicketCardProps {
	groupedTicket: Omit<GroupedEventTicket, 'transfers'>
	hasActions?: boolean
	onLayout?: ViewProps['onLayout']
	defaultIsDetailVisible?: boolean
	style?: ViewStyle
}

export default function GroupedTicketCard({
	groupedTicket,
	hasActions = false,
	onLayout,
	defaultIsDetailVisible = false,
	style
}: GroupedTicketCardProps) {
	const { t } = useTranslation()
	const { colors } = useCustomTheme()
	const navigation = useNavigation()
	const [isCancelBottomSheetVisible, setIsCancelBottomSheetVisible] =
		useState(false)
	const [isStaffUseDialogVisible, setIsStaffUseDialogVisible] = useState(false)
	const [isDetailVisible, setIsDetailVisible] = useState(defaultIsDetailVisible)

	const { mutateAsync: eventTicketUseByUser } = useEventTicketUseByUser()

	const handleStaffUseTicket = async () => {
		try {
			await Promise.all(
				groupedTicket.ids.map((id) =>
					eventTicketUseByUser({ eventTicketId: id })
				)
			)
			setIsStaffUseDialogVisible(false)
			Toast.show({
				type: 'success',
				text1: t('tickets.usedSuccessfully')
			})
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response?.status === 404) {
					Toast.show({
						type: 'error',
						text1: t('tickets.errors.alreadyUsed')
					})
				} else {
					Toast.show({ type: 'error', text1: error.message })
				}
			}
		}
	}

	const isUseButtonDisabled = !isWithinInterval(new Date(), {
		start: groupedTicket.ticket.startAt,
		end: groupedTicket.ticket.endAt
	})

	const renderGiftIcon = useCallback(
		() => (
			<View className="w-6 h-6 rounded-full bg-grayscale-600 justify-center">
				<CustomText className="text-center">
					{groupedTicket.ids.length}
				</CustomText>
			</View>
		),
		[groupedTicket.ids.length]
	)

	return (
		<TouchableWithoutFeedback
			onPress={() => setIsDetailVisible((prev) => !prev)}
			onLayout={onLayout}
		>
			<View onLayout={onLayout} style={[styles.container, style]}>
				<BaseTicketCard
					ticket={groupedTicket.ticket}
					event={groupedTicket.event}
				/>
				{isDetailVisible || (
					<View className="absolute top-3 right-3 rounded-2xl bg-grayscale-900/60">
						<CustomText variant="body3Regular" className="m-2">
							{t('tickets.quantity', { count: groupedTicket.ids.length })}
						</CustomText>
					</View>
				)}
				{isDetailVisible && (
					<TicketCardDetailOverlay
						eventTicket={groupedTicket}
						actions={
							hasActions ? (
								<View className="pt-5 border-t-[1px] border-t-grayscale-700">
									<CustomButton
										onPress={() => setIsStaffUseDialogVisible((prev) => !prev)}
										disabled={isUseButtonDisabled}
									>
										{t('tickets.staffConfirmation')}
									</CustomButton>
									<CustomDialog visible={isStaffUseDialogVisible}>
										<CustomDialog.Title>
											{t('tickets.confirmEntry', {
												count: groupedTicket.ids.length
											})}
										</CustomDialog.Title>
										<CustomDialog.Actions>
											<CustomButton
												labelVariant="body1Semibold"
												colorVariant="secondary"
												onPress={() => setIsStaffUseDialogVisible(false)}
												flex
											>
												{t('common.actions.cancel')}
											</CustomButton>
											<CustomButton
												labelVariant="body1Semibold"
												mode="contained"
												onPress={handleStaffUseTicket}
												// disabled={isPending}
												// loading={isPending}
												flex
											>
												{t('tickets.enter')}
											</CustomButton>
										</CustomDialog.Actions>
									</CustomDialog>
									<BulletText
										variant="body3Regular"
										className="mt-2 text-grayscale-400"
									>
										{t('tickets.staffConfirmationInfo')}
									</BulletText>
									<View className="flex-row justify-end pt-2 mt-5 border-t-[1px] border-t-grayscale-700">
										{groupedTicket.ticket.name !== 'Standard' && (
											<>
												<CustomButton
													labelVariant="body3Medium"
													labelStyle={{ color: colors.grayscale[400] }}
													mode="text"
													size="sm"
													onPress={() => setIsCancelBottomSheetVisible(true)}
												>
													{t('common.actions.cancel')}
												</CustomButton>
												<CancelBottomSheet
													groupedEventTicket={groupedTicket}
													isBottomSheetOpen={isCancelBottomSheetVisible}
													onDismiss={() => setIsCancelBottomSheetVisible(false)}
												/>
											</>
										)}
										<CustomButton
											labelVariant="body3Medium"
											contentStyle={styles.buttonContent}
											labelStyle={{ color: colors.grayscale[400] }}
											mode="text"
											size="sm"
											onPress={() => {
												navigation.navigate('TicketShare', {
													ids: groupedTicket.ids,
													event: groupedTicket.event
												})
											}}
											icon={renderGiftIcon}
										>
											{t('common.actions.gift')}
										</CustomButton>
									</View>
								</View>
							) : null
						}
					/>
				)}
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		position: 'relative'
	},
	buttonContent: {
		gap: 4,
		flexDirection: 'row-reverse'
	}
})
