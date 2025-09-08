import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '@/hooks/queries/useAuth'

export default function PublicRoute() {
	const { accessToken } = useAuth()
	const location = useLocation()

	return accessToken ? (
		<Navigate to="/" replace state={{ redirect: location }} />
	) : (
		<Outlet />
	)
}
