import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
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

import { useUpdatePassword } from '@/hooks/queries/clientUser/useUpdatePassword'
import { UpdatePasswordFormSchema } from '@/lib/schemas/clientUser'
import { UpdatePasswordForm, UpdatePasswordPayload } from '@/types'

interface ChangePasswordFormProps {
	email: string
}

export default function ChangePasswordForm({
	email,
	token
}: ChangePasswordFormProps & { token: string }) {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { mutateAsync: updatePassword } = useUpdatePassword()

	const findPasswordForm = useForm<UpdatePasswordForm>({
		resolver: zodResolver(UpdatePasswordFormSchema)
	})

	const onSubmit: SubmitHandler<UpdatePasswordPayload> = async (data) => {
		try {
			await updatePassword({ data, token })
			toast.success(t('mypage.passwordChanged'))
			navigate('/login')
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return
			}
			toast.error(t('common.unknownError'))
		}
	}
	return (
		<Form {...findPasswordForm}>
			<form
				onSubmit={findPasswordForm.handleSubmit(onSubmit)}
				noValidate
				className="pt-4"
			>
				<FormItem>
					<FormLabel>{t('mypage.email')}</FormLabel>
					<FormControl>
						<Input
							type="email"
							placeholder={t('mypage.newPasswordPlaceholder')}
							value={email}
							disabled
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
				<FormField
					control={findPasswordForm.control}
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
					control={findPasswordForm.control}
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
				<Button
					type="submit"
					variant="gray"
					className="mt-4 w-full"
					disabled={!findPasswordForm.watch(['password']).every(Boolean)}
				>
					{t('common.start')}
				</Button>
			</form>
		</Form>
	)
}
