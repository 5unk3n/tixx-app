import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '../ui/alert-dialog'
import { Button, buttonVariants } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form'
import { Input } from '../ui/input'

import { useRequestEmailCode } from '@/hooks/queries/auth/useRequestEmailCode'
import { useSignUp } from '@/hooks/queries/auth/useSignup'
import { useVerifyEmailCode } from '@/hooks/queries/auth/useVerifyEmailCode'
import { SignupFormSchema } from '@/lib/schemas/auth'
import { cn } from '@/lib/utils'
import { SignupForm as SignupFormType } from '@/types'

export default function SignupForm() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [messages, setMessages] = useState({
		email: '',
		emailType: '',
		verificationCode: '',
		verificationCodeType: ''
	})
	const [isRequested, setIsRequested] = useState(false)
	const [isVerified, setIsVerified] = useState(false)

	const { mutateAsync: requestEmailCode } = useRequestEmailCode()
	const { mutateAsync: verifyEmailCode } = useVerifyEmailCode()
	const { mutateAsync: signup, isSuccess } = useSignUp()

	const signupForm = useForm<SignupFormType>({
		resolver: zodResolver(SignupFormSchema)
	})

	const requestEmail = async () => {
		const isValid = await signupForm.trigger('email')
		if (!isValid) return

		const email = signupForm.getValues('email')

		try {
			await requestEmailCode({ email })
			setIsRequested(true)
			setMessages((prev) => ({
				...prev,
				emailType: 'success',
				email: t('auth.emailCodeSent')
			}))
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.status === 400) {
					setMessages((prev) => ({
						...prev,
						emailType: 'error',
						email: t('auth.emailCodeAlreadySent')
					}))
				}
			}
		}
	}

	const verifyEmail = async () => {
		const isValid = await signupForm.trigger(['email', 'verificationCode'])
		if (!isValid) return

		const { email, verificationCode } = signupForm.getValues()

		try {
			await verifyEmailCode({ email, authCode: verificationCode })
			setMessages(() => ({
				email: '',
				emailType: '',
				verificationCodeType: 'success',
				verificationCode: t('auth.verificationComplete')
			}))
			setIsVerified(true)
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.status === 400) {
					if (error.response?.data.message === 'Invalid email auth code') {
						setMessages((prev) => ({
							...prev,
							verificationCodeType: 'error',
							verificationCode: t('auth.invalidVerificationCode')
						}))
					} else if (
						error.response?.data.message === 'email auth code has expired'
					) {
						setMessages((prev) => ({
							...prev,
							verificationCodeType: 'error',
							verificationCode: t('auth.verificationCodeExpired')
						}))
					} else if (
						error.response?.data.message === 'email auth code not found'
					) {
						setMessages((prev) => ({
							...prev,
							verificationCodeType: 'error',
							verificationCode: t('auth.requestVerificationCode')
						}))
					}
				}
			}
		}
	}

	const onSubmit: SubmitHandler<SignupFormType> = async (data) => {
		try {
			await signup({ ...data, provider: 'email' })
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.status === 409) {
					setMessages((prev) => ({
						...prev,
						emailType: 'error',
						email: t('auth.errors.emailAlreadyExists')
					}))
				}
			}
		}
	}

	return (
		<Form {...signupForm}>
			<form
				onSubmit={signupForm.handleSubmit(onSubmit)}
				noValidate
				className="pt-4"
			>
				<FormField
					control={signupForm.control}
					name="name"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{t('mypage.name')}</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder={t('auth.namePlaceholder')}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={signupForm.control}
					name="companyName"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{t('auth.companyName')}</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder={t('auth.companyNamePlaceholder')}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={signupForm.control}
					name="email"
					disabled={isVerified}
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{t('mypage.email')}</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder={t('auth.emailPlaceholder')}
									buttonText={
										isRequested
											? t('auth.resendVerification')
											: t('auth.requestVerification')
									}
									onButtonClick={requestEmail}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage
								className={cn(
									messages.emailType === 'success' && 'text-status-positive',
									messages.emailType === 'error' && 'text-status-destructive'
								)}
							>
								{messages.email}
							</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={signupForm.control}
					name="verificationCode"
					disabled={isVerified}
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{t('auth.verificationCode')}</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder={t('auth.verificationCodePlaceholder')}
									buttonText={
										isVerified
											? t('auth.verificationComplete')
											: t('auth.verify')
									}
									onButtonClick={verifyEmail}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage
								className={cn(
									messages.verificationCodeType === 'success' &&
										'text-status-positive',
									messages.verificationCodeType === 'error' &&
										'text-status-destructive'
								)}
							>
								{messages.verificationCode}
							</FormMessage>
						</FormItem>
					)}
				/>
				<FormField
					control={signupForm.control}
					name="password"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{t('mypage.newPassword')}</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder={t('mypage.newPasswordPlaceholder')}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={signupForm.control}
					name="confirmPassword"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{t('mypage.confirmPassword')}</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder={t('mypage.confirmPasswordPlaceholder')}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="my-4 flex flex-col gap-3">
					<FormField
						control={signupForm.control}
						name="privacy"
						render={({ field }) => (
							<FormItem className="flex items-center">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<FormLabel className="ml-1 mr-2 flex-1 p-0 text-body-1 font-regular text-grayscale-700">
									{t('auth.privacyPolicyAgreement')}
								</FormLabel>
								<Link
									className="box-border block rounded-lg border border-grayscale-100 px-2 py-1 text-caption-2 font-regular text-grayscale-700"
									to={'/signup'}
								>
									{t('auth.viewDetails')}
								</Link>
							</FormItem>
						)}
					/>
					<FormField
						control={signupForm.control}
						name="terms"
						render={({ field }) => (
							<FormItem className="flex items-center">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<FormLabel className="ml-1 mr-2 flex-1 p-0 text-body-1 font-regular text-grayscale-700">
									{t('auth.termsOfServiceAgreement')}
								</FormLabel>
								<Link
									className="box-border block rounded-lg border border-grayscale-100 px-2 py-1 text-caption-2 font-regular text-grayscale-700"
									to={'/signup'}
								>
									{t('auth.viewDetails')}
								</Link>
							</FormItem>
						)}
					/>
				</div>
				<Button
					type="submit"
					variant="black"
					className="mt-4 w-full"
					disabled={
						!signupForm
							.watch([
								'name',
								'companyName',
								'email',
								'verificationCode',
								'password',
								'confirmPassword',
								'privacy',
								'terms'
							])
							.every(Boolean)
					}
				>
					{t('auth.submitSignup')}
				</Button>
				<AlertDialog open={isSuccess}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t('auth.signupCompleteTitle')}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t('auth.signupCompleteDescription1')}
								<br />
								<br />
								{t('auth.signupCompleteDescription2_1')}
								<strong>tixxofficial@tixx.im</strong>
								{t('auth.signupCompleteDescription2_2')}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogAction
								className={buttonVariants({ variant: 'black' })}
								onClick={() => {
									navigate('/login')
								}}
							>
								{t('common.confirm')}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</form>
		</Form>
	)
}
