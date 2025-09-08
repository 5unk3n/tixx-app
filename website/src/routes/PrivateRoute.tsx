import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { Navigate, Outlet, useLocation } from 'react-router'

import { useHosts } from '@/hooks/queries/hosts/useHosts'
import { useAuth } from '@/hooks/queries/useAuth'
import { useHostStore } from '@/stores/hostStore'

const hostCategory = [
	{
		value: 'all',
		label: 'common.all'
	},
	{
		value: 'Brand',
		label: 'host.brand'
	},
	{
		value: 'Promote',
		label: 'host.promoter'
	},
	{
		value: 'Venue',
		label: 'host.venue'
	}
]

const getCategoryLabel = (categoryValue: string) => {
	return hostCategory.find((category) => categoryValue === category.value)
		?.label
}

export default function PrivateRoute() {
	const { t } = useTranslation()
	const { accessToken } = useAuth()
	const { hostId, setHostId } = useHostStore()
	const location = useLocation()

	const { data: hosts, isPending, isError, error } = useHosts()

	if (!accessToken) {
		return <Navigate to="/login" replace state={{ redirect: location }} />
	}

	if (isPending) {
		return <div>loading...</div>
	}

	if (isError && isAxiosError(error)) {
		if (error.status === 404 && location.pathname !== '/onboarding') {
			return (
				<Navigate to="/onboarding" replace state={{ redirect: location }} />
			)
		} else if (error.status === 404 && location.pathname === '/onboarding') {
			return <Outlet />
		} else {
			return <div>error</div>
		}
	}

	if (hosts && hosts.length > 0 && location.pathname === '/onboarding') {
		return <Navigate to="/" replace state={{ redirect: location }} />
	}

	if (!hostId || !hosts?.find((host) => host.id === hostId)) {
		return (
			<div className="m-10">
				<h1 className="text-heading-1 font-semibold text-grayscale-900">
					Select Channel
				</h1>
				<ul className="mt-5 flex flex-col gap-4">
					{hosts?.map((host) => (
						<li
							key={host.id}
							onClick={() => setHostId(host.id)}
							className="cursor-pointer"
						>
							<div className="flex flex-col justify-between rounded-2xl border p-4">
								<div className="flex items-center">
									<img
										src={host.imageUrl || undefined}
										width={50}
										height={50}
										className="h-[50px] w-[50px] rounded-[10px] border object-cover"
										alt="host logo"
									/>
									<div className="ml-4">
										<p className="text-body-1 font-medium">{host.name}</p>
										<p className="mt-1.5 text-body-1 font-medium text-grayscale-500">
											{t(getCategoryLabel(host.category) as string)}
										</p>
									</div>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		)
	}

	return <Outlet />
}
