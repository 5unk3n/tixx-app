import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'

import { UI } from '@/constants/ui'

import CustomIcon from '../ui/display/CustomIcon'
import CustomListItem from '../ui/display/CustomListItem'
import { CustomText } from '../ui/display/CustomText'

export default function ProfileSection() {
	const navigation = useNavigation()

	return (
		<View className="pb-3">
			<CustomText variant="body3Medium" className="mx-5 mb-3 text-grayscale-5">
				{UI.COMMON.MY_PROFILE}
			</CustomText>
			<CustomListItem
				title={UI.USERS.EDIT_MY_PROFILE}
				right={() => <CustomIcon name="arrowRight" size={20} />}
				onPress={() => navigation.navigate('Profile', { mode: 'view' })}
			/>
		</View>
	)
}
