import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import { useUpdateUser } from '@/hooks/queries/useUpdateUser'
import { useCustomTheme } from '@/hooks/useCustomTheme'
export default function LanguageScreen() {
	const { i18n } = useTranslation()
	const { colors } = useCustomTheme()
	const { mutateAsync: updateUser } = useUpdateUser()

	return (
		<ScrollView className="my-4">
			<TouchableRipple onPress={() => i18n.changeLanguage('ko')}>
				<View className="flex-row items-center px-5 py-4">
					<CustomIcon
						name={i18n.language === 'ko' ? 'radioChecked' : 'radioUnchecked'}
						className="mr-2"
						color={colors.primary}
					/>
					<CustomText variant="headline1Medium">{'한국어'}</CustomText>
				</View>
			</TouchableRipple>
			<TouchableRipple
				onPress={async () => {
					await i18n.changeLanguage('en')
					updateUser({ appLanguage: i18n.language === 'ko' ? 'ko' : 'en' })
				}}
				className="mt-2"
			>
				<View className="flex-row items-center px-5 py-4">
					<CustomIcon
						name={i18n.language === 'en' ? 'radioChecked' : 'radioUnchecked'}
						className="mr-2"
						color={colors.primary}
					/>
					<CustomText variant="headline1Medium">{'English'}</CustomText>
				</View>
			</TouchableRipple>
		</ScrollView>
	)
}
