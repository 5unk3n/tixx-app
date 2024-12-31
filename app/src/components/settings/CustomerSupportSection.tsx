import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'

import { UI } from '@/constants/ui'

import CustomIcon from '../ui/display/CustomIcon'
import CustomListItem from '../ui/display/CustomListItem'
import { CustomText } from '../ui/display/CustomText'

export default function CustomerSupportSection() {
	const navigation = useNavigation()

	return (
		<View className="mt-6 mb-3">
			<CustomText variant="body3Medium" className="mx-5 mb-3 text-grayscale-5">
				{UI.COMMON.CUSTOMER_SUPPORT}
			</CustomText>
			<CustomListItem
				title={UI.COMMON.FEEDBACK}
				right={() => <CustomIcon name="arrowRight" size={20} />}
				onPress={() => navigation.navigate('Feedback')}
			/>
			<CustomListItem
				title={UI.COMMON.NOTICE}
				right={() => <CustomIcon name="arrowRight" size={20} />}
				onPress={() => {}}
			/>
			<CustomListItem
				title={UI.COMMON.BUSINESS_INFO}
				right={() => <CustomIcon name="arrowRight" size={20} />}
				onPress={() => {}}
			/>
		</View>
	)
}
