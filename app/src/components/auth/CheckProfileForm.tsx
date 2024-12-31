import { zodResolver } from '@hookform/resolvers/zod'
import { format, parse } from 'date-fns'
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import DatePicker from 'react-native-date-picker'

import { UI } from '@/constants/ui'
import { useCheckNickname } from '@/hooks/queries/auth/useCheckNickname'
import { useAuth } from '@/hooks/useAuth'
import { useSignUpStore } from '@/stores/signUpStore'
import { UserCheckProfileInput } from '@/types'
import { formatDateWithPoint, formatPhone } from '@/utils/formatters'
import { UserSchema } from '@/utils/schemas'

import CustomButton from '../ui/input/CustomButton'
import CustomTextInput from '../ui/input/CustomTextInput'

export default function CheckProfileForm() {
	const [open, setOpen] = useState(false)
	const user = useSignUpStore()
	const { signUp } = useAuth()
	const { mutateAsync: checkNickname } = useCheckNickname()
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		setError
	} = useForm<UserCheckProfileInput>({
		resolver: zodResolver(UserSchema.checkProfileInput),
		defaultValues: { birth: user.birthYYYYMMDD || '20000101' }
	})

	const onSubmit: SubmitHandler<UserCheckProfileInput> = async ({
		nickname,
		birth
	}) => {
		const { success } = await checkNickname(nickname)
		if (!success) {
			setError('nickname', { message: '중복된 닉네임입니다.' })
			return
		}

		signUp({ ...user, birthYYYYMMDD: birth, nickname })
	}

	return (
		<View className="flex-1">
			<View className="gap-9">
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
							placeholder="닉네임을 입력해주세요"
							className="ml-9 mt-9"
						/>
					)}
				/>
				<Controller
					control={control}
					name={'birth'}
					render={({ field: { onChange, value } }) => (
						<View className="mt-9 ml-9">
							<TouchableOpacity onPress={() => setOpen(true)}>
								<CustomTextInput
									label={UI.USERS.BIRTH}
									value={formatDateWithPoint(value)}
									editable={false}
									pointerEvents="box-none"
								/>
							</TouchableOpacity>
							<DatePicker
								date={parse(value, 'yyyyMMdd', new Date())}
								onConfirm={(date) => {
									const formattedDate = format(date, 'yyyyMMdd')
									setOpen(false)
									onChange(formattedDate)
								}}
								onCancel={() => {
									setOpen(false)
								}}
								modal
								open={open}
								title="생년월일을 선택해주세요."
								cancelText="취소"
								confirmText="확인"
								mode="date"
								locale="ko"
							/>
						</View>
					)}
				/>
				<CustomTextInput
					label={UI.USERS.PHONE}
					disabled={true}
					value={formatPhone(user.phone)}
					right={
						<CustomButton size="sm" mode="contained" disabled>
							인증완료
						</CustomButton>
					}
				/>
				<CustomTextInput
					label={UI.USERS.EMAIL}
					disabled={true}
					value={user.email}
				/>
			</View>
			<CustomButton
				mode="contained"
				className="mt-auto rounded-lg bottom-0"
				onPress={handleSubmit(onSubmit)}
				disabled={!watch('nickname') || !watch('birth')}
			>
				{UI.COMMON.NEXT}
			</CustomButton>
		</View>
	)
}
