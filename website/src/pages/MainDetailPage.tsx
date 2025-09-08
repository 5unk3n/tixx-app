import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import EventBadges from '@/components/events/EventBadges'
import EventDetailSection from '@/components/events/EventDetailSection'
import TicketStatusSection from '@/components/tickets/TicketStatusSection'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEvent } from '@/hooks/queries/events/useEvent'
import { useTicketDetails } from '@/hooks/queries/tickets/useTicketDetails'
import { cn } from '@/lib/utils'

export default function MainDetailPage() {
	const { t } = useTranslation()
	const { id } = useParams()
	const [currentTab, setCurrentTab] = useState('summary')
	const [date, setDate] = useState<
		{ from: Date | undefined; to?: Date | undefined } | undefined
	>(undefined)

	const {
		data: event,
		isPending: isEventPending,
		isError: isEventError
	} = useEvent(id!)
	const {
		data: ticketDetails,
		isFetching: isTicketDetailsFetching,
		isLoading: isTicketDetailsLoading,
		isPending: isTicketDetailsPending,
		isError: isTicketDetailsError,
		isReady: isTicketDetailsReady
	} = useTicketDetails(event?.tickets.map((ticket) => ticket.id) || [])

	if (
		isEventPending ||
		isEventError ||
		isTicketDetailsFetching ||
		isTicketDetailsLoading ||
		isTicketDetailsPending ||
		isTicketDetailsError ||
		!isTicketDetailsReady
	) {
		return null
	}

	return (
		<div className="w-full">
			<div className="mx-auto mt-[65px] flex w-full max-w-[794px] flex-col gap-4 px-5 sm:flex-row">
				<div className="flex-1">
					<EventBadges event={event!} />
					<h2 className="text-title-1 font-semibold">{event?.name + ''}</h2>
				</div>
			</div>
			<div className="mx-auto mt-12 flex max-w-[794px] flex-row justify-between px-5">
				<Tabs value={currentTab}>
					<TabsList>
						<TabsTrigger
							value={'summary'}
							onClick={() => {
								setCurrentTab('summary')
							}}
						>
							{t('common.overview')}
						</TabsTrigger>
						<TabsTrigger
							value={'tickets'}
							onClick={() => {
								setCurrentTab('tickets')
							}}
						>
							{t('event.ticketStatus')}
						</TabsTrigger>
					</TabsList>
				</Tabs>
				{currentTab === 'tickets' && (
					<div className="flex flex-row gap-9">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={'grayLine'}
									className={cn('w-full justify-start text-left font-normal')}
								>
									{date ? (
										`${date.from && format(date.from, 'PP(E)', { locale: ko })} - ${date.to ? format(date.to, 'PP(E)', { locale: ko }) : ''}`
									) : (
										<span className="text-grayscale-500">
											{t('event.selectDate')}
										</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="range"
									selected={date}
									onSelect={setDate}
									initialFocus
									locale={ko}
								/>
							</PopoverContent>
						</Popover>
						<Button type="button" variant={'gray'}>
							{t('event.insight')}
						</Button>
					</div>
				)}
			</div>
			{currentTab === 'summary' ? (
				<EventDetailSection event={event} ticketDetails={ticketDetails!} />
			) : (
				<TicketStatusSection
					eventId={event.id}
					ticketDetails={ticketDetails!}
				/>
			)}
		</div>
	)
}
