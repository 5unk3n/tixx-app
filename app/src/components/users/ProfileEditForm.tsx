import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

import { UI } from '@/constants/ui'
import { useCheckNickname } from '@/hooks/queries/auth/useCheckNickname'
import { useUpdateUser } from '@/hooks/queries/useUpdateUser'
import { useUser } from '@/hooks/queries/useUser'
import { UserUpdateInput } from '@/types'
import { formatDateWithPoint, formatPhone } from '@/utils/formatters'
import { UserSchema } from '@/utils/schemas'

import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'
import CustomButton from '../ui/input/CustomButton'
import CustomTextInput from '../ui/input/CustomTextInput'

interface ProfileEditFormProps {
	isEditable: boolean
}

export default function ProfileEditForm({ isEditable }: ProfileEditFormProps) {
	const navigation = useNavigation()
	const { data: user, isError, isPending } = useUser()
	const { mutateAsync: checkNickname } = useCheckNickname()
	const { mutateAsync: updateUser } = useUpdateUser()
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		setError
	} = useForm<UserUpdateInput>({
		resolver: zodResolver(UserSchema.updateInput),
		defaultValues: user
	})

	if (isPending || isError) return

	const onSubmit: SubmitHandler<UserUpdateInput> = async ({ nickname }) => {
		try {
			if (nickname !== user.nickname) {
				const { success } = await checkNickname(nickname as string)
				if (!success) {
					setError('nickname', { message: '중복된 닉네임입니다.' })
					return
				}
			}

			await updateUser({ nickname })
			navigation.setParams({ mode: 'view' })
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: '프로필 수정 실패'
			})
		}
	}

	return (
		<View className="flex-1 px-5">
			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.container}
			>
				<View className="ml-2 mb-9">
					<CustomText
						variant="caption1Regular"
						className="pb-4 text-grayscale-4"
					>
						{UI.USERS.CONNECT_SNS}
					</CustomText>
					<View className="flex-row gap-4">
						<View
							className={`w-10 h-10 rounded-full ${user.provider === 'naver' ? 'bg-brandColors-naver' : 'bg-grayscale-2'}`}
						>
							<CustomIcon
								name={user.provider === 'naver' ? 'naver' : 'naverGray'}
								className="flex-1 self-center"
							/>
						</View>
						<View
							className={`w-10 h-10 rounded-full ${user.provider === 'kakao' ? 'bg-brandColors-kakao' : 'bg-grayscale-2'}`}
						>
							<CustomIcon
								name={user.provider === 'kakao' ? 'kakao' : 'kakaoGray'}
								className="flex-1 self-center"
							/>
						</View>
						<View
							className={`w-10 h-10 rounded-full ${user.provider === 'apple' ? 'bg-brandColors-apple' : 'bg-grayscale-2'}`}
						>
							<CustomIcon
								name={user.provider === 'apple' ? 'apple' : 'appleGray'}
								className="flex-1 self-center"
							/>
						</View>
					</View>
				</View>
				<View className="flex-1 gap-9">
					<CustomTextInput
						label={UI.USERS.NAME}
						disabled={true}
						value={user.name}
					/>
					<Controller
						control={control}
						name="nickname"
						render={({ field: { onChange, onBlur, value } }) => (
							<CustomTextInput
								label={UI.USERS.NICKNAME}
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								errorMessage={errors.nickname?.message}
								placeholder={UI.USERS.NICKNAME_PLACEHOLDER}
								className="ml-9 mt-9"
								disabled={!isEditable}
							/>
						)}
					/>
					{/* FIXME: 생년월일 피커와 함께 수정 */}
					<CustomTextInput
						label={UI.USERS.BIRTH}
						disabled={true}
						value={formatDateWithPoint(user.birth)}
					/>
					<CustomTextInput
						label={UI.USERS.PHONE}
						value={formatPhone(user.phone)}
						disabled={true}
						right={
							<CustomButton size="sm" mode="contained" disabled>
								{UI.AUTH.AUTHENTICATED}
							</CustomButton>
						}
						className="ml-9 mt-9"
					/>
					<CustomTextInput
						label={UI.USERS.EMAIL}
						disabled={true}
						value={user.email}
						className="mb-9"
					/>
				</View>
			</ScrollView>
			{isEditable && (
				<CustomButton
					className={`w-full mb-2`}
					disabled={
						watch('nickname') === user.nickname && watch('phone') === user.phone
					}
					onPress={handleSubmit(onSubmit)}
				>
					{UI.COMMON.CONFIRM}
				</CustomButton>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 48
	}
})
