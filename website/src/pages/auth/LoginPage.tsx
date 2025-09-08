import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
	const { t } = useTranslation()

	return (
		<div className="w-[390px] p-5">
			<div className="mb-4 text-center">
				<h1 className="text-title-2 font-semibold text-grayscale-900">
					{t('auth.startWithTixx')}
				</h1>
				<p className="mt-2 text-heading-2 font-regular text-grayscale-500">
					{t('auth.manageEventEasily')}
				</p>
			</div>
			<main>
				<LoginForm />
				<div className="mt-6 flex justify-center space-x-3 text-body-2 text-grayscale-500">
					{/* HACK: 베타 버전에서 생략 */}
					{/* <Link to="/find-id" className="hover:text-grayscale-900">
						아이디 찾기
					</Link>
					<span>|</span> */}
					<Link to="/find-password" className="hover:text-grayscale-900">
						{t('auth.findPassword')}
					</Link>
					<span>|</span>
					<Link to="/signup" className="hover:text-grayscale-900">
						{t('auth.signup')}
					</Link>
				</div>
			</main>
		</div>
	)
}
