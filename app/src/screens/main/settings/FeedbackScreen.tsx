import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'

import { CustomText } from '@/components/ui/display/CustomText'
import CustomButton from '@/components/ui/input/CustomButton'
import CustomTextInput from '@/components/ui/input/CustomTextInput'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'Feedback'>

export default function FeedbackScreen(_props: Props) {
	const navigation = useNavigation()

	const handleSubmit = () => {
		// TODO: 피드백 api 추가하기
		Toast.show({
			type: 'success',
			text1: '피드백이 제출되었습니다.'
		})
		navigation.goBack()
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<CustomText variant="h1Semibold" className="mt-12">
				피드백을 작성해주세요
			</CustomText>
			<CustomTextInput
				placeholder="피드백을 작성해주세요"
				className="mt-6 h-36"
				numberOfLines={6}
				textAlignVertical="top"
				multiline
			/>
			<CustomButton onPress={handleSubmit} className="mt-auto">
				보내기
			</CustomButton>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingBottom: 8
	}
})
