import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	ViewProps,
	ViewStyle
} from 'react-native'

import { UI } from '@/constants/ui'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { GroupedEventTicket } from '@/types'

import BaseTicketCard from './BaseTicketCard'
import CancelBottomSheet from './CancelBottomSheet'
import TicketCardDetailOverlay from './TicketCardDetailOverlay'
import { CustomText } from '../ui/display/CustomText'
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
	const { colors } = useCustomTheme()
	const navigation = useNavigation()
	const [isCancelBottomSheetVisible, setIsCancelBottomSheetVisible] =
		useState(false)
	const [isDetailVisible, setIsDetailVisible] = useState(defaultIsDetailVisible)

	return (
		<TouchableWithoutFeedback
			onPress={() => setIsDetailVisible((prev) => !prev)}
			onLayout={onLayout}
		>
			<View onLayout={onLayout} style={style}>
				<BaseTicketCard eventTicket={groupedTicket} />
				{isDetailVisible || (
					<View className="absolute top-3 right-3 rounded-2xl bg-grayscale-b/60">
						<CustomText
							variant="body3Regular"
							className="m-2"
						>{`수량 : ${groupedTicket.ids.length}`}</CustomText>
					</View>
				)}
				{isDetailVisible && (
					<TicketCardDetailOverlay
						eventTicket={groupedTicket}
						actions={
							hasActions ? (
								<View className="pt-3 border-t-[1px] border-t-grayscale-2 flex-row justify-end">
									<CustomButton
										labelVariant="body3Medium"
										labelStyle={{ color: colors.grayscale[5] }}
										mode="text"
										size="sm"
										onPress={() => setIsCancelBottomSheetVisible(true)}
									>
										{UI.COMMON.CANCEL_ACTION}
									</CustomButton>
									<CancelBottomSheet
										groupedEventTicket={groupedTicket}
										isBottomSheetOpen={isCancelBottomSheetVisible}
										onDismiss={() => setIsCancelBottomSheetVisible(false)}
									/>
									<CustomButton
										labelVariant="body3Medium"
										contentStyle={styles.buttonContent}
										labelStyle={{ color: colors.grayscale[5] }}
										mode="text"
										size="sm"
										onPress={() => {
											navigation.navigate('TicketShare', groupedTicket.ids)
										}}
										icon={() => (
											<View className="w-6 h-6 rounded-full bg-grayscale-3 justify-center">
												<CustomText className="text-center">
													{groupedTicket.ids.length}
												</CustomText>
											</View>
										)}
									>
										{UI.COMMON.SHARE_ACTION}
									</CustomButton>
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
	buttonContent: {
		gap: 4,
		flexDirection: 'row-reverse'
	}
})
