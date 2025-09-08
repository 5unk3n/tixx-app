import { useTranslation } from 'react-i18next'

import { Separator } from '@/components/ui/separator'
import { TicketDetail } from '@/types'
import { formatDDay } from '@/utils/formatters'

interface InsightProps {
	ticketDetails: TicketDetail[]
}

export default function Insight({ ticketDetails }: InsightProps) {
	const { t } = useTranslation()

	return (
		<div className="grid grid-cols-3 place-items-center gap-y-8 whitespace-nowrap rounded-xl bg-white px-16 py-9 text-center shadow-[0_4px_60px_rgba(0,0,0,0.08)] md:grid-cols-7 md:px-24">
			<div>
				<p className="text-headline-1 font-semibold text-grayscale-900">
					{t('event.openDate')}
				</p>
				<p className="text-display-2 font-semibold text-[#7F8400]">
					{formatDDay(
						ticketDetails[0].event.startDate,
						ticketDetails[0].event.startTime
					)}
				</p>
			</div>
			<Separator orientation="vertical" />
			<div className="text-[#7F8400]">
				<p className="text-headline-1 font-semibold text-grayscale-900">
					{t('event.participants')}
				</p>
				<p className="break-keep text-display-2 font-semibold">
					{ticketDetails.reduce((acc, cur) => acc + cur.usedTickets, 0)}
					<span className="text-body-1 font-semibold">{t('event.people')}</span>
				</p>
			</div>
			<Separator orientation="vertical" className="hidden md:block" />
			<div className="text-[#7F8400]">
				<p className="text-headline-1 font-semibold text-grayscale-900">
					{t('ticket.issuedQuantity')}
				</p>
				<p className="break-keep text-display-2 font-semibold">
					{ticketDetails.reduce((acc, cur) => acc + cur.totalUsers, 0)}
					<span className="text-body-1 font-semibold">{t('event.people')}</span>
				</p>
			</div>
			<Separator orientation="vertical" />
			<div className="text-[#7F8400]">
				<p className="text-headline-1 font-semibold text-grayscale-900">
					{t('ticket.unissuedQuantity')}
				</p>
				<p className="break-keep text-display-2 font-semibold">
					{ticketDetails.reduce(
						(acc, cur) => acc + cur.totalQuantity - cur.totalUsers,
						0
					)}
					<span className="text-body-1 font-semibold">{t('event.people')}</span>
				</p>
			</div>
		</div>
	)
}
