import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useCheckNickname } from '@/hooks/queries/auth/useCheckNickname'
import { useAuth } from '@/hooks/useAuth'
import { useSignUpStore } from '@/stores/signUpStore'
import { UserCheckProfileInput } from '@/types'
import { formatPhone } from '@/utils/formatters'
import { UserSchema } from '@/utils/schemas'

import CustomButton from '../ui/input/CustomButton'
import CustomTextInput from '../ui/input/CustomTextInput'

export default function CheckProfileForm() {
	const { t } = useTranslation()
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
		defaultValues: { birth: user.birthYYYYMMDD }
	})

	const onSubmit: SubmitHandler<UserCheckProfileInput> = async ({
		nickname
	}) => {
		const { success } = await checkNickname(nickname)
		if (!success) {
			setError('nickname', {
				message: t('profile.errors.duplicatedNickname')
			})
			return
		}
		// TODO: 생년월일 활용 시 birth 추가
		signUp({ ...user, nickname, birthYYYYMMDD: null })
	}

	return (
		<View className="flex-1">
			<View className="gap-9">
				<CustomTextInput
					label={t('profile.fields.name')}
					disabled={true}
					value={user.name}
				/>
				<Controller
					control={control}
					name="nickname"
					render={({ field: { onChange, onBlur, value } }) => (
						<CustomTextInput
							label={t('profile.fields.nickname')}
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							errorMessage={errors.nickname?.message}
							placeholder={t('profile.placeholders.nickname')}
							className="ml-9 mt-9"
						/>
					)}
				/>
				{/* TODO: 생년월일 활용 시 다시 사용 */}
				{/* <Controller
					control={control}
					name={'birth'}
					render={({ field: { onChange, value } }) => (
						<View className="mt-9 ml-9">
							<TouchableOpacity onPress={() => setOpen(true)}>
								<CustomTextInput
									label={t('profile.fields.birth')}
									value={value ? formatDateWithPoint(value) : ''}
									editable={false}
									pointerEvents="box-none"
								/>
								<TouchableOpacity
									onPress={() => setValue('birth', null)}
									className="z-20"
								>
									<CustomIcon
										name={'close'}
										className="absolute right-3 bottom-3"
									/>
								</TouchableOpacity>
							</TouchableOpacity>
							<DatePicker
								date={
									value && typeof value === 'string'
										? parse(value, 'yyyyMMdd', new Date())
										: new Date()
								}
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
								title={t('profile.selectBirth')}
								cancelText={t('common.cancel')}
								confirmText={t('common.confirm')}
								mode="date"
								locale={i18n.language}
							/>
						</View>
					)}
				/> */}
				<CustomTextInput
					label={t('profile.fields.phone')}
					disabled={true}
					value={formatPhone(user.phone)}
					right={
						<CustomButton size="sm" mode="contained" disabled>
							{user.verified
								? t('auth.verification.notComplete')
								: t('auth.verification.complete')}
						</CustomButton>
					}
				/>
				<CustomTextInput
					label={t('profile.fields.email')}
					disabled={true}
					value={user.email}
				/>
			</View>
			<CustomButton
				className="mt-auto rounded-lg bottom-0"
				onPress={handleSubmit(onSubmit)}
				disabled={!watch('nickname')}
				testID="submit-button"
			>
				{t('common.actions.start')}
			</CustomButton>
		</View>
	)
}
