import { useTranslation } from 'react-i18next'

import { TicketDetail } from '@/types'

interface TicketStatusSummaryProps {
	ticketDetails: TicketDetail[]
}

export default function TicketStatusSummary({
	ticketDetails
}: TicketStatusSummaryProps) {
	const { t } = useTranslation()
	const ticketStatus = ticketDetails.reduce(
		(acc, ticket) => {
			if (acc[ticket.name]) {
				acc[ticket.name].quantity += ticket.totalQuantity
				acc[ticket.name].accepted += ticket.totalUsers
				acc[ticket.name].rejected += ticket.rejectedInvites
			} else {
				acc[ticket.name] = {
					quantity: ticket.totalQuantity,
					accepted: ticket.totalUsers,
					rejected: ticket.rejectedInvites
				}
			}

			return acc
		},
		{} as Record<
			string,
			{ accepted: number; quantity: number; rejected: number }
		>
	)

	return (
		<div className="flex w-full gap-8">
			<div>
				<h4 className="text-headline-1 font-semibold">
					{t('ticket.standard')}
				</h4>
				<div className="mt-4 min-w-[190px] rounded-xl p-6 shadow-[0_4px_100px_rgb(0,0,0,0.08)]">
					<div>
						<span className="text-label-1 font-medium text-grayscale-500">
							<strong className="mr-1 text-title-2 font-semibold text-[#7F8400]">
								{ticketStatus.Standard?.accepted || 0}
							</strong>
							{`/${ticketStatus.Standard?.quantity || 0}`}
						</span>
						<span className="mt-1 block text-body-1 font-medium">
							{t('ticketStatus.purchasePerson')}
						</span>
						<span className="mt-[66px] block text-label-1 font-medium text-grayscale-500">
							{`${ticketStatus.Standard?.rejected || 0} ${t('ticketStatus.cancelled')}`}
						</span>
					</div>
				</div>
			</div>
			<div>
				<h4 className="text-headline-1 font-semibold">{t('ticket.guest')}</h4>
				<div className="mt-4 min-w-[190px] rounded-xl p-6 shadow-[0_4px_100px_rgb(0,0,0,0.08)]">
					<div>
						<span className="text-label-1 font-medium text-grayscale-500">
							<strong className="mr-1 text-title-2 font-semibold text-[#7F8400]">
								{ticketStatus.Guest?.accepted || 0}
							</strong>
							{`/${ticketStatus.Guest?.quantity || 0}`}
						</span>
						<span className="mt-1 block text-body-1 font-medium">
							{t('ticketStatus.purchasePerson')}
						</span>
						<span className="mt-[66px] block text-label-1 font-medium text-grayscale-500">
							{`${ticketStatus.Guest?.rejected || 0} ${t('ticketStatus.cancelled')}`}
						</span>
					</div>
				</div>
			</div>
			<div>
				<h4 className="text-headline-1 font-semibold">{t('ticket.vip')}</h4>
				<div className="mt-4 min-w-[190px] rounded-xl p-6 shadow-[0_4px_100px_rgb(0,0,0,0.08)]">
					<div>
						<span className="text-label-1 font-medium text-grayscale-500">
							<strong className="mr-1 text-title-2 font-semibold text-[#7F8400]">
								{ticketStatus.VIP?.accepted || 0}
							</strong>
							{`/${ticketStatus.VIP?.quantity || 0}`}
						</span>
						<span className="mt-1 block text-body-1 font-medium">
							{t('ticketStatus.purchasePerson')}
						</span>
						<span className="mt-[66px] block text-label-1 font-medium text-grayscale-500">
							{`${ticketStatus.VIP?.rejected || 0} ${t('ticketStatus.cancelled')}`}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
