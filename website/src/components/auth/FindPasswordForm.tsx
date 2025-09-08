import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'
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

import { useFindPassword } from '@/hooks/queries/clientUser/useFindPassword'
import { FindPasswordPayloadSchema } from '@/lib/schemas/clientUser'
import { FindPasswordPayload } from '@/types'

export default function FindPasswordForm() {
	const { t } = useTranslation()

	const findPasswordForm = useForm<FindPasswordPayload>({
		resolver: zodResolver(FindPasswordPayloadSchema)
	})

	const { mutateAsync: findPassword } = useFindPassword()

	const onSubmit: SubmitHandler<FindPasswordPayload> = async (data) => {
		try {
			await findPassword(data)
			toast.success(t('auth.changePasswordLinkSent'))
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.status === 400) {
					if (error.response?.data.message === 'Client user does not exist.') {
						findPasswordForm.setError('email', {
							type: 'manual',
							message: t('auth.errors.userNotFound')
						})
					}
				} else {
					toast.error(t('auth.changePasswordLinkFailed'))
				}
			}
		}
	}
	return (
		<Form {...findPasswordForm}>
			<form onSubmit={findPasswordForm.handleSubmit(onSubmit)} noValidate>
				<FormField
					control={findPasswordForm.control}
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
				<div className="rounded-lg bg-grayscale-50 px-5 py-4">
					<ul className="list-outside list-disc pl-5 text-label-1 text-grayscale-400">
						<li>{t('auth.changePasswordInfo1')}</li>
						<li>{t('auth.changePasswordInfo2')}</li>
						<li>{t('auth.changePasswordInfo3')}</li>
					</ul>
				</div>
				<Button
					type="submit"
					variant="gray"
					className="mt-14 w-full"
					disabled={
						!findPasswordForm.watch(['email']).every(Boolean) ||
						findPasswordForm.formState.isSubmitting
					}
				>
					{t('auth.changePasswordSubmit')}
				</Button>
			</form>
		</Form>
	)
}
