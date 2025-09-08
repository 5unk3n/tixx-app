import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import CustomIcon from '../ui/display/CustomIcon'
import CustomListItem from '../ui/display/CustomListItem'
import { CustomText } from '../ui/display/CustomText'

export default function CustomerSupportSection() {
	const navigation = useNavigation()
	const { t } = useTranslation()

	return (
		<View className="mt-6 mb-3">
			<CustomText
				variant="body3Medium"
				className="mx-5 mb-3 text-grayscale-400"
			>
				{t('common.settings.support')}
			</CustomText>
			<CustomListItem
				title={t('common.settings.feedback')}
				rightElement={<CustomIcon name="arrowRight" size={20} />}
				onPress={() => navigation.navigate('Feedback')}
			/>
			<CustomListItem
				title={t('common.settings.apply')}
				rightElement={<CustomIcon name="arrowRight" size={20} />}
				onPress={() => Linking.openURL('https://admin.tixx.site')}
			/>
			{/* HACK: MVP 버전에서는 공지사항, 사업자정보 사용 X */}
			{/* <CustomListItem
				title={t('common.settings.notice')}
				right={() => <CustomIcon name="arrowRight" size={20} />}
				onPress={() => {}}
			/>
			<CustomListItem
				title={t('common.settings.business')}
				right={() => <CustomIcon name="arrowRight" size={20} />}
				onPress={() => {}}
			/> */}
		</View>
	)
}
