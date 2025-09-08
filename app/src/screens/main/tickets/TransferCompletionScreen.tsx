import { PROD_URL } from '@env'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Share, View } from 'react-native'

import TixxSymbol from '@/assets/illustrations/tixx-symbol.svg'
import BulletText from '@/components/ui/display/BulletText'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomButton from '@/components/ui/input/CustomButton'
import { useUser } from '@/hooks/queries/useUser'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'TransferCompletion'>

export default function TransferCompletionScreen({ navigation, route }: Props) {
	const event = route.params
	const { data: user } = useUser()
	const { t } = useTranslation()

	const handleShare = () => {
		Share.share({
			message: t('tickets.shareMessage', {
				nickname: user!.nickname,
				eventName: event.name,
				link: `${PROD_URL}/download`
			})
		})
	}

	return (
		<View className="flex-1">
			<View className="items-center mt-24 mb-auto">
				<TixxSymbol color={'white'} width={78} height={53} />
				<CustomText variant="h1Semibold" className="mt-12">
					{t('tickets.messages.shareComplete')}
				</CustomText>
			</View>
			<View className="mt-1 mx-4 px-5 py-4 rounded-lg bg-grayscale-700">
				<BulletText variant="body3RegularLarge" className="text-grayscale-500">
					{t('tickets.notices.share')}
				</BulletText>
			</View>
			<View className="mt-2.5 mb-2 mx-5 flex-row">
				<CustomButton onPress={handleShare} flex className="mr-3">
					{t('common.actions.share')}
				</CustomButton>
				<CustomButton
					onPress={() => navigation.popToTop()}
					flex
					colorVariant="secondary"
				>
					{t('common.confirm')}
				</CustomButton>
			</View>
		</View>
	)
}
