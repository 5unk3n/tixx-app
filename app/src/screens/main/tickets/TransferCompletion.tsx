import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { Share, View } from 'react-native'

import BulletText from '@/components/ui/display/BulletText'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomButton from '@/components/ui/input/CustomButton'
import { UI } from '@/constants/ui'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'TransferCompletion'>

export default function TransferCompletion({ navigation }: Props) {
	const handleShare = async () => {
		const result = await Share.share({
			// FIXME: 공유할 메시지 수정
			message: UI.TICKETS.SHARE_MESSAGE
		})
		if (result.action === Share.sharedAction) {
			if (result.activityType) {
				// shared with activity type of result.activityType
			} else {
				// shared
			}
		} else if (result.action === Share.dismissedAction) {
			// dismissed
		}
	}

	return (
		<View className="flex-1">
			<CustomText variant="h1Semibold" className="mt-12 text-center">
				{UI.TICKETS.SHARE_COMPLETE_TITLE}
			</CustomText>
			<CustomIcon
				name="ticketSent"
				width={161}
				height={128}
				className="self-center mt-14 mb-20"
			/>
			<View className="mt-1 mx-4 px-5 py-4 rounded-lg bg-grayscale-2">
				<BulletText variant="body3RegularLarge" className="text-grayscale-4">
					{UI.TICKETS.SHARE_NOTICE}
				</BulletText>
			</View>
			<View className="mt-auto mx-5 flex-row">
				<CustomButton onPress={handleShare} flex className="mr-3">
					{UI.COMMON.SHARE_ACTION}
				</CustomButton>
				<CustomButton
					onPress={() => navigation.popToTop()}
					flex
					colorVariant="secondary"
				>
					{UI.COMMON.CONFIRM}
				</CustomButton>
			</View>
		</View>
	)
}
