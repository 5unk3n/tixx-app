import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useProfile } from '@/hooks/queries/clientUser/useProfile'
import { useUpdatePassword } from '@/hooks/queries/clientUser/useUpdatePassword'
import { useAuth } from '@/hooks/queries/useAuth'
import { UpdatePasswordFormSchema } from '@/lib/schemas/clientUser'
import { UpdatePasswordForm } from '@/types'

export default function MyPage() {
	const navigate = useNavigate()
	const { data: profile } = useProfile()
	const { mutateAsync: updatePassword } = useUpdatePassword()
	const { logout } = useAuth()
	const { t } = useTranslation()

	const updatePasswordForm = useForm<UpdatePasswordForm>({
		resolver: zodResolver(UpdatePasswordFormSchema)
	})

	const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
		try {
			await updatePassword({ data })
			toast.success(t('mypage.passwordChanged'))
			navigate('/')
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.status === 400) {
					updatePasswordForm.setError('currentPassword', {
						message: t('mypage.passwordMismatch')
					})
				}
			}
		}
	}

	return (
		<div className="mx-auto w-full max-w-[390px] p-5">
			<h2 className="mb-5 text-title-3 font-semibold">{t('mypage.title')}</h2>
			<Separator />
			<Form {...updatePasswordForm}>
				<form
					onSubmit={updatePasswordForm.handleSubmit(onSubmit)}
					noValidate
					className="pt-4"
				>
					<div className="mb-7">
						<label className="px-2 py-1 text-caption-1 font-medium text-grayscale-500">
							{t('mypage.name')}
						</label>
						<Input type="text" value={profile?.name} disabled />
					</div>
					<div className="mb-7">
						<label className="px-2 py-1 text-caption-1 font-medium text-grayscale-500">
							{t('mypage.email')}
						</label>
						<Input type="text" value={profile?.email} disabled />
					</div>
					<FormField
						control={updatePasswordForm.control}
						name="currentPassword"
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
					<FormField
						control={updatePasswordForm.control}
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
						control={updatePasswordForm.control}
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
					{/* TODO: 회원탈퇴 기능 추가 */}
					<Button
						type="submit"
						variant="primary"
						className="mt-4 w-full"
						disabled={
							!updatePasswordForm
								.watch(['currentPassword', 'password', 'confirmPassword'])
								.every(Boolean)
						}
					>
						{t('common.save')}
					</Button>
				</form>
			</Form>
			<div className="mt-4 flex gap-4">
				<p
					className="cursor-pointer text-body-1 font-semibold underline underline-offset-2"
					onClick={logout}
				>
					{t('common.logout')}
				</p>
				<p className="cursor-pointer text-body-1 font-semibold text-grayscale-600 underline underline-offset-2">
					{t('common.withdraw')}
				</p>
			</div>
		</div>
	)
}
