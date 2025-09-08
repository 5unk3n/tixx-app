import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { differenceInSeconds } from 'date-fns'
import {
	parsePhoneNumberWithError,
	AsYouType,
	CountryCode,
	getExampleNumber,
	ParseError
} from 'libphonenumber-js'
import examples from 'libphonenumber-js/mobile/examples'
import React, { useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, View } from 'react-native'
import { CountryItem, CountryList } from 'react-native-country-codes-picker'
import { TouchableRipple } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import { useCheckPhoneNumber } from '@/hooks/queries/users/useCheckPhoneNumber'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { usePhoneVerification } from '@/hooks/usePhoneVerification'
import { PhonAuthRequestInput, PhonAuthVerifyInput } from '@/types'
import {
	PhonAuthRequestInputSchema,
	PhonAuthVerifyInputSchema
} from '@/utils/schemas'

import BulletText from '../ui/display/BulletText'
import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'
import CustomBottomSheet, {
	BottomSheetRef
} from '../ui/feedback/CustomBottomSheet'
import CustomButton from '../ui/input/CustomButton'
import CustomTextInput from '../ui/input/CustomTextInput'

interface VerifyPhoneFormProps {
	onSubmit: (phone: string, verified: number) => void
}

export default function VerifyPhoneForm({ onSubmit }: VerifyPhoneFormProps) {
	const { t } = useTranslation()
	const { colors } = useCustomTheme()
	const bottomSheetRef = useRef<BottomSheetRef>(null)
	const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
	const [phoneError, setPhoneError] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const [canSmsService, setCanSmsService] = useState(true)
	const [country, setCountry] = useState<Partial<CountryItem>>({
		code: 'KR',
		dial_code: '+82'
	})
	const asYouType = new AsYouType(country.code as CountryCode)
	let keyPress = ''

	const phoneForm = useForm<PhonAuthRequestInput>({
		resolver: zodResolver(PhonAuthRequestInputSchema.omit({ hash: true }))
	})

	const codeForm = useForm<PhonAuthVerifyInput>({
		resolver: zodResolver(PhonAuthVerifyInputSchema.pick({ authCode: true }))
	})

	const handleAuthCodeReceived = (authCode: string) => {
		codeForm.setValue('authCode', authCode, { shouldValidate: true })
	}

	const { mutateAsync: checkPhoneNumber } = useCheckPhoneNumber()
	const {
		requestCode,
		verifyCode,
		remainingTime,
		isCodeSent,
		isResendDisabled,
		firstReqTime,
		reqCount
	} = usePhoneVerification(handleAuthCodeReceived)
	const canSkip =
		(firstReqTime && differenceInSeconds(new Date(), firstReqTime) > 60) ||
		reqCount >= 2

	const handleRequestCode: SubmitHandler<PhonAuthRequestInput> = async ({
		phone
	}) => {
		Keyboard.dismiss()

		try {
			const e164Phone = parsePhoneNumberWithError(
				country.dial_code + phone
			).number

			const user = await checkPhoneNumber(e164Phone)

			if (user) {
				Toast.show({
					type: 'error',
					text1: t('auth.errors.alreadyExistPhone')
				})
				setPhoneError(true)
				return
			}
			await requestCode({ phone: e164Phone })
		} catch (error) {
			if (error instanceof ParseError) {
				Toast.show({
					type: 'error',
					text1: t('auth.errors.invalidPhoneNumber')
				})
			} else if (isAxiosError(error) && error.status === 503) {
				setCanSmsService(false)
				Toast.show({
					type: 'error',
					text1: t('auth.errors.temporarilyUnavailablePhone')
				})
			} else {
				Toast.show({ type: 'error', text1: t('common.errors.unknownError') })
			}
		}
	}

	const handleVerifyCode: SubmitHandler<PhonAuthVerifyInput> = async ({
		authCode
	}) => {
		const e164Phone = parsePhoneNumberWithError(
			country.dial_code + phoneForm.getValues('phone')
		).number
		const success = await verifyCode(e164Phone, authCode)
		if (success) {
			onSubmit(e164Phone, 0)
		}
	}

	const handleSkip = () => {
		const e164Phone = parsePhoneNumberWithError(
			country.dial_code + phoneForm.getValues('phone')
		).number
		onSubmit(e164Phone, 1)
	}

	return (
		<View className="flex-1">
			<CustomText
				className="text-grayscale-500 ml-2 mb-2"
				variant="caption1Regular"
			>
				{t('profile.fields.phone')}
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
						<CustomText variant="body1Medium">{country?.dial_code}</CustomText>
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
									let formattedPhone = text
									if (keyPress !== 'Backspace') {
										asYouType.reset()
										formattedPhone = asYouType.input(text).replaceAll('-', ' ')
									}
									onChange(formattedPhone)
									setPhoneError(false)
								}}
								value={value}
								onKeyPress={(e) => (keyPress = e.nativeEvent.key)}
								keyboardType="phone-pad"
								placeholder={getExampleNumber(
									country.code as CountryCode,
									examples
								)
									?.formatNational()
									.replaceAll('-', ' ')}
								right={
									<CustomButton
										mode="contained"
										size="sm"
										onPress={phoneForm.handleSubmit(handleRequestCode)}
										disabled={phoneError || isResendDisabled}
									>
										{isCodeSent ? t('common.resend') : t('common.send')}
									</CustomButton>
								}
							/>
						)}
					/>
				</View>
			</View>
			{isCodeSent && (
				<View className="mb-4">
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
								placeholder={t('auth.verification.codePlaceholder')}
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
				</View>
			)}
			{(canSkip || !canSmsService) && (
				<CustomButton onPress={handleSkip} className="mb-4">
					{t('auth.verification.verifyLater')}
				</CustomButton>
			)}
			<View className="bg-grayscale-800 px-5 py-3 rounded-lg">
				<BulletText variant="body3RegularLarge" className="text-gray-400">
					{t('coupon.notices.disableInternationalCall')}
				</BulletText>
			</View>
			<CustomButton
				onPress={codeForm.handleSubmit(handleVerifyCode)}
				disabled={!codeForm.watch('authCode')}
				className="mt-auto"
			>
				{t('common.next')}
			</CustomButton>

			<CustomBottomSheet
				ref={bottomSheetRef}
				snapPoints={[424]}
				isDraggable={false}
				onBackDropPress={() => {
					setIsBottomSheetOpen(false)
				}}
			>
				<View className="mt-7 mx-5 mb-4">
					<CustomTextInput
						containerStyle={{ backgroundColor: colors.grayscale[700] }}
						onChangeText={setSearchValue}
						placeholder="Search your country"
					/>
				</View>
				<CountryList
					lang={'en'}
					pickerButtonOnPress={(item) => {
						setCountry(item)
						bottomSheetRef.current?.dismiss()
						setIsBottomSheetOpen(false)
						setSearchValue('')
					}}
					searchValue={searchValue}
					style={{
						countryButtonStyles: {
							backgroundColor: colors.grayscale[800],
							borderRadius: 0
						},
						countryName: {
							color: colors.onPrimary
						},
						dialCode: {
							color: colors.onPrimary
						}
					}}
				/>
			</CustomBottomSheet>
		</View>
	)
}
