import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useProfile } from '@/hooks/queries/clientUser/useProfile'
import { useCreateClientInquiry } from '@/hooks/queries/inquiries/useCreateClientInquiry'
import { InquireFormSchema } from '@/lib/schemas/inquiries'
import { InquireForm as InquireFormType } from '@/types'

export default function InquiryPage() {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const { data: profile } = useProfile()

	const { mutateAsync: createClientInquiry } = useCreateClientInquiry()

	const inquireForm = useForm<InquireFormType>({
		resolver: zodResolver(InquireFormSchema),
		defaultValues: { name: profile?.name, email: profile?.email }
	})
	const onSubmitInquiry: SubmitHandler<InquireFormType> = async (data) => {
		const { name, email, title, description } = data
		try {
			await createClientInquiry({
				type: '4',
				name,
				email,
				title,
				content: description
			})
			toast.success(t('inquiry.success'))
			navigate(-1)
		} catch {
			toast.error(t('inquiry.fail'))
		}
	}

	return (
		<div className="my-20 px-5">
			<h2 className="text-center text-title-1 font-semibold text-grayscale-900">
				{t('inquiry.title')}
			</h2>
			<Form {...inquireForm}>
				<form onSubmit={inquireForm.handleSubmit(onSubmitInquiry)} noValidate>
					<div className="flex gap-5">
						<FormField
							control={inquireForm.control}
							name="name"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel>{t('inquiry.name')}</FormLabel>
									<FormControl>
										<Input type="text" error={fieldState.invalid} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={inquireForm.control}
							name="email"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel>{t('inquiry.email')}</FormLabel>
									<FormControl>
										<Input
											type="email"
											error={fieldState.invalid}
											placeholder="example@mail.co.kr"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={inquireForm.control}
						name="title"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel>{t('inquiry.subject')}</FormLabel>
								<FormControl>
									<Input
										type="text"
										error={fieldState.invalid}
										placeholder={t('inquiry.subject')}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={inquireForm.control}
						name="description"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel>{t('inquiry.content')}</FormLabel>
								<FormControl>
									<Textarea
										placeholder={t('inquiry.content')}
										className="h-[213px] resize-none"
										error={fieldState.invalid}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={inquireForm.control}
						name="privacyConsent"
						render={({ field }) => (
							<FormItem className="rounded-lg bg-[#F6F6F6] p-3">
								<div className="">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<FormLabel className="text-headline-2 font-semibold text-grayscale-900">
										{t('inquiry.privacyConsent')}
									</FormLabel>
								</div>
								<FormDescription className="mt-3">
									<ol className="list-decimal pl-8 text-body-1 font-medium text-grayscale-700">
										{t('inquiry.privacyConsentDesc')
											.split('\n')
											.map((line, idx) => (
												<li key={idx}>{line}</li>
											))}
									</ol>
								</FormDescription>
							</FormItem>
						)}
					/>
					<div className="mt-24 flex justify-center gap-5">
						<Button
							type="button"
							variant={'gray'}
							className="w-[216px]"
							onClick={() => navigate(-1)}
						>
							{t('inquiry.cancel')}
						</Button>
						<Button
							type="submit"
							variant={'black'}
							className="w-[216px]"
							disabled={!inquireForm.watch('privacyConsent')}
						>
							{t('inquiry.submit')}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
