import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { View } from 'react-native'

import ProfileEditForm from '@/components/users/ProfileEditForm'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'Profile'>

export default function ProfileScreen(_: Props) {
	return (
		<View className="flex-1">
			<ProfileEditForm isEditable />
		</View>
	)
}
