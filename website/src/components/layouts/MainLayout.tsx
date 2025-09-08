import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

import Footer from './Footer'
import Header from './Header'

export default function MainLayout() {
	const location = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location])

	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex flex-1 items-center justify-center">
				<Outlet />
			</main>
			<Footer />
		</div>
	)
}
