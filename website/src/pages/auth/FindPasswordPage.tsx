import { useTranslation } from 'react-i18next'

import FindPasswordForm from '@/components/auth/FindPasswordForm'

export default function FindPasswordPage() {
	const { t } = useTranslation()
	return (
		<div className="mx-auto w-full max-w-[390px] p-5">
			<div className="mb-12 text-center">
				<h1 className="text-title-3 font-semibold">{t('auth.findPassword')}</h1>
				<p className="mt-5 text-body-1 font-regular text-gray-400">
					{t('auth.findPasswordGuide')}
				</p>
			</div>
			<FindPasswordForm />
		</div>
	)
}
