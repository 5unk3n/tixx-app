import { format, isBefore } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { ClientTransfers } from '@/types'
import { formatPhone } from '@/utils/formatters'

interface InvitationListProps {
	clientTransfers: ClientTransfers
}

export default function InvitationList({
	clientTransfers
}: InvitationListProps) {
	const { t } = useTranslation()

	const getStatus = (transfer: ClientTransfers[number]) => {
		const eventTicket = transfer.eventTicket
		if (eventTicket.usedAt) {
			return t('invitation.status.used')
		}
		if (
			transfer.eventTicket.deletedAt ||
			isBefore(transfer.eventTicket.ticket.endAt, new Date())
		) {
			return t('invitation.status.noShowOrCanceled')
		}
		return t('invitation.status.pending')
	}

	return (
		<div>
			<ul className="flex flex-col gap-4">
				{clientTransfers.map((clientTransfer) => {
					return (
						<li
							key={clientTransfer.id}
							className="flex items-center rounded-xl border border-grayscale-100 px-4 py-3"
						>
							<div className="flex-1">
								<div className="flex items-center">
									<p className="text-heading-2 font-medium">
										{clientTransfer.toUser?.name}
									</p>
									<p className="ml-2 text-label-1 font-medium text-grayscale-600">
										{clientTransfer.toUser?.nickname}
									</p>
								</div>
								<p className="mt-2 text-body-1 font-regular text-grayscale-500">
									{formatPhone(
										(clientTransfer.toUser?.phone ||
											clientTransfer.toPhoneNumber)!
									)}
								</p>
							</div>
							<div className="flex-col justify-items-center">
								<Badge>{`${format(clientTransfer.eventTicket.ticket.startAt, 'M/dd')} ${clientTransfer.eventTicket.ticket.name}`}</Badge>
								<p className="text-grayscale-900">
									{getStatus(clientTransfer)}
								</p>
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
