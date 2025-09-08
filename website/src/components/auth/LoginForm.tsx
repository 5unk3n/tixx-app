import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '../ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form'
import { Input } from '../ui/input'

import { useLogin } from '@/hooks/queries/auth/useLogin'
import { LoginPayloadSchema } from '@/lib/schemas/auth'
import { LoginPayload } from '@/types'

export default function LoginForm() {
	const { t } = useTranslation()
	const { mutateAsync: login } = useLogin()

	const loginForm = useForm<LoginPayload>({
		resolver: zodResolver(LoginPayloadSchema)
	})

	const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
		try {
			await login(data)
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.status === 404) {
					if (error.response?.data.message === 'Password Incorrect') {
						loginForm.setError('email', {
							type: 'manual',
							message: t('auth.errors.passwordIncorrect')
						})
					} else if (error.response?.data.message === 'User not found') {
						loginForm.setError('email', {
							type: 'manual',
							message: t('auth.errors.userNotFound')
						})
					}
				} else if (error.status === 400) {
					if (error.response?.data.message === 'Account is not Approved') {
						toast.info(t('auth.waitingForApproval'))
					}
				}
			}
		}
	}

	return (
		<Form {...loginForm}>
			<form
				onSubmit={loginForm.handleSubmit(onSubmit)}
				noValidate
				className="pt-4"
			>
				<FormField
					control={loginForm.control}
					name="email"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{t('mypage.email')}</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder={t('auth.emailPlaceholder')}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={loginForm.control}
					name="password"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{t('mypage.currentPassword')}</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder={t('mypage.currentPasswordPlaceholder')}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					variant="black"
					className="mt-4 w-full"
					disabled={!loginForm.watch(['email', 'password']).every(Boolean)}
				>
					{t('common.start')}
				</Button>
			</form>
		</Form>
	)
}
