import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import CheckProfileForm from '@/components/auth/CheckProfileForm'
import { AuthStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<AuthStackParamList, 'CheckProfile'>

export default function CheckProfile(_props: Props) {
	return (
		<ScrollView
			className="flex-1 px-5 pb-2"
			contentContainerStyle={styles.contentContainer}
		>
			<CheckProfileForm />
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	contentContainer: {
		flexGrow: 1,
		paddingTop: 48,
		paddingBottom: 8
	}
})
