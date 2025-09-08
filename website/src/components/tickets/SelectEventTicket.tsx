import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

import Calendar from '@/assets/icons/calendar-number.svg?react'
import Clock from '@/assets/icons/clock.svg?react'
import { EventTicket, Ticket } from '@/types'

interface SelectEventTicketProps {
	eventTickets: (EventTicket & { ticket: Ticket })[]
	selectedEventTicketId: string
	setSelectedEventTicketId: (eventTicketId: string) => void
}

export default function SelectEventTicket({
	eventTickets,
	selectedEventTicketId,
	setSelectedEventTicketId
}: SelectEventTicketProps) {
	const { t } = useTranslation()

	return (
		<div>
			<RadioGroup
				value={selectedEventTicketId}
				onValueChange={(eventTicketId) => {
					setSelectedEventTicketId(eventTicketId)
				}}
				className="flex flex-col"
			>
				{eventTickets.map((eventTicket) => (
					<Label className="flex items-center gap-4 rounded-2xl border p-4">
						<RadioGroupItem value={String(eventTicket.id)} />
						<div className="w-full">
							<div className="mb-2 flex items-center justify-between">
								<p className="text-headline-1 font-semibold">
									{t(`ticket.${eventTicket.ticket.name.toLowerCase()}`)}
								</p>
								<p>{`${t('common.id')}: ${eventTicket.id}`}</p>
							</div>
							<div className="w-full">
								<div className="mb-1 flex items-center gap-3">
									<Calendar />
									<span>
										{format(eventTicket.ticket.startAt, 'yyyy-MM-dd')}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<Clock />
									<span>{`${format(eventTicket.ticket.startAt, 'HH:mm')} - ${format(eventTicket.ticket.endAt, 'HH:mm')}`}</span>
								</div>
							</div>
						</div>
					</Label>
				))}
			</RadioGroup>
		</div>
	)
}
