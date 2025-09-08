import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import TicketStatusSummary from './TicketStatusSummary'
import { Button } from '../ui/button'
import {
	Table,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
	TableHeader
} from '../ui/table'

import MoreVertical from '@/assets/icons/more-vertical.svg?react'
import { useEventParticipants } from '@/hooks/queries/events/useEventParticipants'
import { cn } from '@/lib/utils'
import { EventParticipant, TicketDetail } from '@/types'

interface TicketStatusSectionProps {
	eventId: number
	ticketDetails: TicketDetail[]
}

export default function TicketStatusSection({
	eventId,
	ticketDetails
}: TicketStatusSectionProps) {
	const { data: eventParticipants } = useEventParticipants(eventId)
	const { t } = useTranslation()

	const columns = [
		{
			header: t('ticketStatus.number'),
			cell: (_: EventParticipant, idx: number) => idx + 1
		},
		{
			header: t('ticketStatus.nickname'),
			cell: (row: EventParticipant) => row.nickname
		},
		{
			header: t('ticketStatus.type'),
			cell: (row: EventParticipant) =>
				row.ticketType === 'Guest'
					? t('ticketStatus.guest')
					: row.ticketType === 'Standard'
						? t('ticketStatus.standard')
						: ''
		},
		{
			header: t('ticketStatus.status'),
			cell: (row: EventParticipant) => (
				<span className="inline-flex items-center rounded-md border border-[#D5D7DA] px-1.5 py-0.5 text-xs font-medium text-grayscale-600">
					<span
						className={cn(
							'mr-1 h-1.5 w-1.5 rounded-full',
							row.status === '미사용' ? 'bg-[#17B26A]' : 'bg-[#FF4242]'
						)}
					/>
					{row.status === '미사용'
						? t('ticketStatus.notEntered')
						: t('ticketStatus.entered')}
				</span>
			)
		},
		{
			header: t('ticketStatus.quantity'),
			cell: (row: EventParticipant) =>
				`${row.quantity}${t('ticketStatus.countSuffix')}`
		},
		{
			header: '',
			cell: () => (
				<Button size={'icon'} variant={'ghost'} className="size-5">
					<MoreVertical className="text-[#A4A7AE]" />
				</Button>
			)
		}
	]

	return (
		<section className="mx-auto my-8 w-full max-w-[794px] px-5">
			<div>
				<TicketStatusSummary ticketDetails={ticketDetails} />
			</div>
			<div className="mt-8 rounded-xl border">
				<div className="flex justify-between py-5 pl-6 pr-5">
					<p className="text-headline-1 font-semibold">
						{t('ticketStatus.participantList')}
					</p>
					<Link className="text-body1 font-regular text-grayscale-400" to={''}>
						{t('ticketStatus.viewAll')}
					</Link>
				</div>
				<Table>
					<TableHeader>
						<TableRow className="border-t">
							{columns.map((col, idx) => (
								<TableHead key={idx}>{col.header}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{eventParticipants && eventParticipants.length > 0 ? (
							eventParticipants.map((row, idx) => (
								<TableRow key={idx}>
									{columns.map((col, colIdx) => (
										<TableCell
											key={colIdx}
											className={
												[0, 1, 2, 4].includes(colIdx) ? 'bg-[#FAFAFA]' : ''
											}
										>
											{col.cell(row, idx)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="text-center">
									{t('ticketStatus.noParticipants')}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</section>
	)
}
