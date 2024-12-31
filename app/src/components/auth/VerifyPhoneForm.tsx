import { zodResolver } from '@hookform/resolvers/zod'
import React, { useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Keyboard, Platform, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import { UI } from '@/constants/ui'
import { useCheckPhoneNumber } from '@/hooks/queries/users/useCheckPhoneNumber'
import { usePhoneVerification } from '@/hooks/usePhoneVerification'
import { PhonAuthRequestInput, PhonAuthVerifyInput } from '@/types'
import { formatPhone, normalizePhone } from '@/utils/formatters'
import {
	PhonAuthRequestInputSchema,
	PhonAuthVerifyInputSchema
} from '@/utils/schemas'

import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'
import CustomBottomSheet, {
	BottomSheetRef
} from '../ui/feedback/CustomBottomSheet'
import CustomButton from '../ui/input/CustomButton'
import { CustomRadioButton } from '../ui/input/CustomRadioButton'
import CustomTextInput from '../ui/input/CustomTextInput'

interface VerifyPhoneFormProps {
	onSubmit: (phone: string) => void
}

export default function VerifyPhoneForm({ onSubmit }: VerifyPhoneFormProps) {
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
	const bottomSheetRef = useRef<BottomSheetRef>(null)
	const { mutateAsync: checkPhoneNumber } = useCheckPhoneNumber()
	// HACK: 폼 에러로 바꾸기
	const [phoneError, setPhoneError] = useState(false)

	const phoneForm = useForm<PhonAuthRequestInput>({
		resolver: zodResolver(PhonAuthRequestInputSchema.omit({ hash: true }))
	})

	const codeForm = useForm<PhonAuthVerifyInput>({
		resolver: zodResolver(PhonAuthVerifyInputSchema.pick({ authCode: true }))
	})

	const handleAuthCodeReceived = (authCode: string) => {
		codeForm.setValue('authCode', authCode, { shouldValidate: true })
	}

	const { requestCode, verifyCode, remainingTime, isCodeSent } =
		usePhoneVerification(handleAuthCodeReceived)

	const handleRequestCode: SubmitHandler<PhonAuthRequestInput> = async ({
		carrier,
		phone
	}) => {
		Keyboard.dismiss()
		const normalizedPhone = normalizePhone(phone)

		const user = await checkPhoneNumber(normalizedPhone)
		if (user) {
			Toast.show({
				type: 'error',
				text1: '이미 가입된 전화번호입니다.'
			})
			setPhoneError(true)
			return
		}

		await requestCode({ carrier, phone })
	}

	const handleVerifyCode: SubmitHandler<PhonAuthVerifyInput> = async ({
		authCode
	}) => {
		const success = await verifyCode(phoneForm.getValues('phone'), authCode)
		if (success) {
			onSubmit(normalizePhone(phoneForm.getValues('phone')))
		}
	}

	return (
		<View className="flex-1">
			<CustomText
				className="text-grayscale-4 ml-2 mb-2"
				variant="caption1Regular"
			>
				{UI.USERS.PHONE}
			</CustomText>
			<View className="flex-row items-center mb-4">
				<TouchableRipple
					onPress={() => {
						bottomSheetRef.current?.present()
						setIsBottomSheetOpen(true)
					}}
					className="mr-2 rounded-lg bg-surfaceVariant"
					borderless={true}
				>
					<View className="w-28 h-12 pl-5 pr-2 flex-row items-center justify-between">
						<CustomText
							className={`${phoneForm.watch('carrier') || 'text-grayscale-3'}`}
							variant="body1Medium"
						>
							{phoneForm.watch('carrier') || '통신사'}
						</CustomText>
						<CustomIcon
							name="arrowDown"
							size={20}
							rotation={isBottomSheetOpen ? 180 : 0}
						/>
					</View>
				</TouchableRipple>
				<View className="flex-1">
					<Controller
						control={phoneForm.control}
						name="phone"
						render={({ field: { onBlur, onChange, value } }) => (
							<CustomTextInput
								onBlur={onBlur}
								onChangeText={(text) => {
									onChange(text)
									setPhoneError(false)
								}}
								value={value && formatPhone(value)}
								keyboardType="phone-pad"
								placeholder={formatPhone('01000000000')}
								right={
									<CustomButton
										mode="contained"
										size="sm"
										onPress={phoneForm.handleSubmit(handleRequestCode)}
										disabled={phoneError}
									>
										{isCodeSent ? UI.COMMON.RESEND : UI.COMMON.SEND}
									</CustomButton>
								}
							/>
						)}
					/>
				</View>
			</View>
			<View>
				{isCodeSent && (
					<Controller
						control={codeForm.control}
						name="authCode"
						render={({ field: { onChange, onBlur, value } }) => (
							<CustomTextInput
								onBlur={onBlur}
								onChangeText={(text) => {
									if (text.length >= 6) {
										Keyboard.dismiss()
									}
									if (text.length <= 6) {
										onChange(text)
									}
								}}
								value={value}
								keyboardType="number-pad"
								textContentType={
									Platform.OS === 'ios' ? 'oneTimeCode' : undefined
								}
								placeholder={UI.AUTH.CODE_PLACEHOLDER}
								right={
									<CustomText
										className="text-primary mr-3"
										variant="caption1Regular"
									>
										{remainingTime}
									</CustomText>
								}
							/>
						)}
					/>
				)}
			</View>
			<CustomButton
				mode="contained"
				onPress={codeForm.handleSubmit(handleVerifyCode)}
				disabled={!codeForm.watch('authCode')}
				className="mt-auto"
			>
				{UI.COMMON.NEXT}
			</CustomButton>

			<CustomBottomSheet
				ref={bottomSheetRef}
				snapPoints={[424]}
				isDraggable={false}
				onBackDropPress={() => {
					setIsBottomSheetOpen(false)
				}}
			>
				<CustomText variant="headline1Semibold" className="ml-7 mt-7 mb-6">
					{UI.AUTH.SELECT_CARRIER}
				</CustomText>
				<CustomRadioButton.Group
					onChange={(value: string) => {
						phoneForm.setValue('carrier', value)
						bottomSheetRef.current?.dismiss()
						setIsBottomSheetOpen(false)
					}}
					value={phoneForm.getValues().carrier}
				>
					<CustomRadioButton.Button label="KT" value="KT" />
					<CustomRadioButton.Button label="SKT" value="SKT" />
					<CustomRadioButton.Button label="LG" value="LG" />
					<CustomRadioButton.Button label="KT알뜰폰" value="KT알뜰폰" />
					<CustomRadioButton.Button label="SKT알뜰폰" value="SKT알뜰폰" />
					<CustomRadioButton.Button label="LG알뜰폰" value="LG알뜰폰" />
				</CustomRadioButton.Group>
			</CustomBottomSheet>
		</View>
	)
}
