import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useHosts } from '@/hooks/queries/hosts/useHosts'
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

export default function HostSettingsPage() {
	const { t } = useTranslation()
	const [activeTab, setActiveTab] = useState('all')
	const navigate = useNavigate()

	const { hostId, setHostId } = useHostStore()

	const handleChannelChange = (
		e: React.MouseEvent<HTMLButtonElement>,
		id: number
	) => {
		e.stopPropagation()
		setHostId(id)
		toast.success(t('host.channelChanged'))
	}

	const { data: hosts, isPending, isError } = useHosts()

	if (isPending || isError) {
		return null
	}

	const filteredHosts = hosts.filter((host) => {
		if (activeTab === 'all') {
			return true
		}
		return host.category === activeTab
	})

	return (
		<div className="p-4 md:p-6">
			<h1 className="text-title-2 font-semibold">
				{t('channel.menu.settings')}
			</h1>
			<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
				<TabsList className="font-semibold *:text-heading-2 *:font-semibold">
					{hostCategory.map((category) => (
						<TabsTrigger key={category.value} value={category.value}>
							{t(category.label)}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
			<div className="mt-8">
				<ul className="grid grid-cols-[repeat(auto-fit,minmax(280px,400px))] gap-8">
					<li
						onClick={() => navigate('/channel/create')}
						className="flex h-[172px] cursor-pointer items-center justify-center rounded-2xl bg-grayscale-50"
					>
						<Plus className="mx-auto h-9 w-9 rounded-full bg-grayscale-400 p-2 text-grayscale-0" />
					</li>
					{filteredHosts.map((host) => (
						<li
							key={host.id}
							onClick={() => navigate(`/channel/update/${host.id}`)}
							className="h-[172px] cursor-pointer"
						>
							<div className="flex h-full w-full flex-col justify-between rounded-2xl border p-4">
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
									<div className="ml-auto self-start">
										<Checkbox
											checked={hostId === host.id}
											onClick={(e) => handleChannelChange(e, host.id)}
										/>
									</div>
								</div>
								<div>
									<p className="text-label-1 font-medium text-grayscale-600">
										{t('host.sales')}
									</p>
									<p className="text-label-1 font-medium text-grayscale-600">
										{t('host.channelViews')}
									</p>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
