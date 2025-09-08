import { format, isBefore } from 'date-fns'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import InvitationList from '@/components/tickets/InvitationList'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useClientTransfers } from '@/hooks/queries/tickets/useClientTransfers'
import { formatPhone } from '@/utils/formatters'

export default function InvitationPage() {
	const { t } = useTranslation()
	const { id } = useParams()
	const [searchQuery, setSearchQuery] = useState('')
	const { data: clientTransfers } = useClientTransfers(Number(id))
	const [status, setStatus] = useState<
		'all' | 'pending' | 'used' | 'noShowOrCanceled'
	>('all')
	const [ticketId, setTicketId] = useState<string>('all')
	const searchedClientTransfers = clientTransfers?.filter(
		(transfer) =>
			transfer.toUser?.name.includes(searchQuery) ||
			formatPhone(
				(transfer.toPhoneNumber || transfer.toUser?.phone)!
			)?.includes(searchQuery)
	)
	const filteredClientTransfers = searchedClientTransfers?.filter(
		(transfer) => {
			const eventTicket = transfer.eventTicket
			if (status === 'all') {
				return true
			}
			if (status === 'used') {
				return !!eventTicket.usedAt
			}
			if (status === 'noShowOrCanceled') {
				return (
					transfer.eventTicket.deletedAt ||
					isBefore(transfer.eventTicket.ticket.endAt, new Date())
				)
			}
			if (status === 'pending') {
				return true
			}
		}
	)

	// 전송 목록에서 같은 티켓별로 필터링하고싶어. 그래서 어떤 티켓이 있는지 티켓의 아이디와 이름이 필요해
	const tickets =
		clientTransfers?.reduce(
			(acc, transfer) => {
				const ticketId = transfer.eventTicket.ticket.id
				const ticketName = transfer.eventTicket.ticket.name
				if (!acc.find((ticket) => ticket.id === ticketId)) {
					acc.push({
						id: ticketId,
						name: ticketName,
						date: format(transfer.eventTicket.ticket.startAt, 'M/dd')
					})
				}
				return acc
			},
			[] as { id: number; name: string; date: string }[]
		) || []

	return (
		<div className="h-full max-w-[630px] flex-1 self-stretch p-5 md:pt-16">
			<section>
				<h2 className="mb-3 text-heading-2 font-semibold">
					{t('invitation.list')}
					<span className="ml-4 text-primary-500">
						{filteredClientTransfers?.length}
					</span>
				</h2>
				<div className="flex flex-col items-center gap-4 md:flex-row">
					<Input
						placeholder={t('invitation.searchPlaceholder')}
						onChange={(e) => setSearchQuery(e.target.value)}
						value={searchQuery}
					/>
				</div>
			</section>
			<section className="mt-4">
				<div className="mb-4 flex flex-wrap gap-2">
					<Tabs
						value={status}
						onValueChange={(value) =>
							setStatus(
								value as 'all' | 'pending' | 'used' | 'noShowOrCanceled'
							)
						}
						className="mr-auto"
					>
						<TabsList>
							<TabsTrigger value="all">{t('common.all')}</TabsTrigger>
							<TabsTrigger value="pending">
								{t('invitation.status.pending')}
							</TabsTrigger>
							<TabsTrigger value="used">
								{t('invitation.status.used')}
							</TabsTrigger>
							<TabsTrigger value="noShowOrCanceled">
								{t('invitation.status.noShowOrCanceled')}
							</TabsTrigger>
						</TabsList>
					</Tabs>
					<Tabs value={ticketId} onValueChange={(value) => setTicketId(value)}>
						<TabsList>
							<TabsTrigger value="all">{t('common.all')}</TabsTrigger>
							{tickets.map((ticket) => (
								<TabsTrigger key={ticket.id} value={String(ticket.id)}>
									{`${ticket.date} ${ticket.name}`}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>
				<div>
					{filteredClientTransfers && (
						<InvitationList clientTransfers={filteredClientTransfers} />
					)}
				</div>
			</section>
		</div>
	)
}
