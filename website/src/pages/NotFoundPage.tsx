import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import Footer from '@/components/layouts/Footer'
import Header from '@/components/layouts/Header'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex flex-1 flex-col items-center justify-center p-5 text-center">
				<h1 className="text-9xl font-semibold text-grayscale-300">404</h1>
				<h2 className="mt-4 text-title-1 font-semibold text-grayscale-900">
					{t('notFound.title')}
				</h2>
				<p className="mt-2 text-body-1 text-grayscale-500">
					{t('notFound.description')}
				</p>
				<Button
					variant="black"
					onClick={() => navigate('/')}
					className="mt-8 w-[200px]"
				>
					{t('notFound.goHome')}
				</Button>
			</main>
			<Footer />
		</div>
	)
}
