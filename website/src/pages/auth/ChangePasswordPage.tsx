import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import ChangePasswordForm from '@/components/auth/ChangePasswordForm'
import { useProfile } from '@/hooks/queries/clientUser/useProfile'

export default function ChangePasswordPage() {
	const { t } = useTranslation()
	const [searchParams] = useSearchParams()
	const token = searchParams.get('token')
	const { data: profile, isPending, isError } = useProfile(token || undefined)

	if (isPending || !token) {
		return <div>Loading...</div>
	}

	if (isError) {
		return (
			<div className="mx-auto w-full max-w-[390px] p-5">
				<p className="text-center text-heading-1 font-semibold">
					{t('auth.changePasswordLinkExpired')}
				</p>
				<p className="mt-4 text-center text-body-2">
					{t('auth.changePasswordLinkExpiredGuide')}
				</p>
			</div>
		)
	}

	return (
		<div className="mx-auto w-full max-w-[390px] p-5">
			<h1 className="mb-20 text-center text-title-3 font-semibold">
				{t('auth.changePassword')}
			</h1>
			<ChangePasswordForm email={profile?.email} token={token} />
		</div>
	)
}
