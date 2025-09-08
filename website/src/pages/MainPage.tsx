import { parse } from 'date-fns'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import EventListItem from '@/components/events/EventListItem'
import SearchInput from '@/components/ui/SearchInput'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEvents } from '@/hooks/queries/events/useEvents'
import { useHosts } from '@/hooks/queries/hosts/useHosts'
import { useHostStore } from '@/stores/hostStore'
import { Category, Status } from '@/types'

export default function MainPage() {
	const [category, setCategory] = useState<Category>('all')
	const [status, setStatus] = useState<Status>('all')
	const [searchQuery, setSearchQuery] = useState('')
	const { t } = useTranslation()

	const { hostId } = useHostStore()

	const { data: hosts } = useHosts()
	const host = hosts!.find((host) => host.id === hostId)
	const { data: events } = useEvents(host!.id, category, status)

	const now = new Date()

	const getDateTime = (date: string, time: string) =>
		parse(`${date}${time}`, 'yyyy-MM-ddHH:mm:ss', new Date())

	const count = events?.reduce(
		(acc, event) => {
			const start = getDateTime(event.startDate, event.startTime)
			const end = getDateTime(event.endDate, event.endTime)

			if (now < start) {
				acc.notStartedCount++
			} else if (now >= start && now <= end) {
				acc.inProgressCount++
			} else if (now > end) {
				acc.completedCount++
			}
			return acc
		},
		{ notStartedCount: 0, inProgressCount: 0, completedCount: 0 }
	)

	const filteredEvents = events?.filter((event) => {
		if (!searchQuery) return true
		return event.name.toLowerCase().includes(searchQuery.toLowerCase())
	})

	return (
		<div className="mx-auto max-w-[794px] flex-1 px-5 pb-5 pt-12">
			<p className="text-title-1 font-semibold">{t('main.eventList')}</p>
			<div className="mb-4 mt-6 flex flex-row justify-between rounded-2xl px-5 py-6 shadow-[0_4px_117px_rgba(0,0,0,0.08)]">
				<div>
					<p className="text-headline-2 font-medium">{t('main.recruiting')}</p>
					<p className="text-display-2 font-semibold">
						{(count && count.notStartedCount) || '-'}
					</p>
				</div>
				<Separator orientation="vertical" className="h-auto" />
				<div>
					<p className="text-headline-2 font-medium">{t('main.inProgress')}</p>
					<p className="text-display-2 font-semibold">
						{(count && count.inProgressCount) || '-'}
					</p>
				</div>
				<Separator orientation="vertical" className="h-auto" />
				<div>
					<p className="text-headline-2 font-medium">{t('main.completed')}</p>
					<p className="text-display-2 font-semibold">
						{(count && count.completedCount) || '-'}
					</p>
				</div>
				<Separator orientation="vertical" className="h-auto" />
				<div className='className="text-headline-2 font-medium"'>
					<p className="text-headline-2 font-medium">
						{t('main.totalVisitors')}
					</p>
					<p className="text-display-2 font-semibold">-</p>
				</div>
			</div>
			<SearchInput
				placeholder={t('main.searchEventName')}
				value={searchQuery}
				onChange={(value) => setSearchQuery(value)}
			/>
			<div className="mt-[60px] flex flex-wrap justify-between gap-6">
				<Tabs
					value={status}
					onValueChange={(value) => setStatus(value as Status)}
				>
					<TabsList>
						<TabsTrigger value="all">{t('common.all')}</TabsTrigger>
						{/* TODO: 상태별 이벤트 숫자 트리거 우측에 표시 */}
						<TabsTrigger value="notStarted">
							{t('status.notStarted')}
						</TabsTrigger>
						<TabsTrigger value="inProgress">
							{t('status.inProgress')}
						</TabsTrigger>
						<TabsTrigger value="completed">{t('status.completed')}</TabsTrigger>
					</TabsList>
				</Tabs>
				<Select
					value={category}
					onValueChange={(value) => setCategory(value as Category)}
				>
					<SelectTrigger className="w-[220px]">
						<SelectValue placeholder={t('common.all')} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t('common.all')}</SelectItem>
						<SelectItem value="party">{t('category.party')}</SelectItem>
						<SelectItem value="venue">{t('category.venue')}</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<ul className="flex flex-col gap-4 pt-7">
				{filteredEvents?.map((event) => (
					<li key={event.id}>
						<Link to={`/events/${event.id}`}>
							<EventListItem event={event} />
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
