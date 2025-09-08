import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import SignupForm from '@/components/auth/SignupForm'

export default function SignupPage() {
	const { t } = useTranslation()

	return (
		<div className="w-[390px] p-5">
			<h1 className="mb-4 text-center text-title-2 font-semibold text-grayscale-900">
				{t('auth.enterSignupInfo')}
			</h1>
			<SignupForm />
			<Link
				to="/login"
				className="mt-6 block text-center text-body-2 text-grayscale-500 hover:text-grayscale-900"
			>
				{t('auth.login')}
			</Link>
		</div>
	)
}
