import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import TicketInfo from './TicketInfo'
import { Button } from '../ui/button'

import FileCopy from '@/assets/icons/file-copy.svg?react'
import { Coupon, Ticket } from '@/types'

interface TicketItemProps {
	eventName: string
	tickets: Ticket[]
	coupon: Coupon
	isGrouped?: boolean
	onEditClick?: () => void
}

export default function TicketItem({
	eventName,
	tickets,
	coupon,
	isGrouped = false,
	onEditClick
}: TicketItemProps) {
	const { t } = useTranslation()

	const copyGuestCode = async (code: string) => {
		try {
			await navigator.clipboard.writeText(code)
			toast.success(t('ticket.guestCodeCopied'))
		} catch (err) {
			console.error('복사 실패:', err)
		}
	}

	return (
		<div
			className="flex w-full cursor-pointer flex-col rounded-2xl bg-grayscale-50 px-6 py-4 text-grayscale-900"
			onClick={onEditClick}
		>
			<div className="flex items-center justify-between">
				<div className="rounded-lg bg-grayscale-900 px-4 py-1">
					<span className="text-label-1 font-medium text-primary-500">
						{t(`ticket.${tickets[0].name.toLowerCase()}`)}
					</span>
				</div>
				{isGrouped && <p>{tickets.length + t('ticket.countUnit')}</p>}
			</div>
			<p className="mt-2.5 flex-1 text-headline-1 font-semibold">{eventName}</p>
			<div className="mt-2.5">
				{isGrouped ? (
					<TicketInfo
						ticket={tickets[0]}
						startAt={tickets[0].startAt}
						endAt={tickets[tickets.length - 1].endAt}
					/>
				) : (
					<TicketInfo ticket={tickets[0]} />
				)}
			</div>
			<div className="mt-8 flex items-center justify-between">
				<p className="text-body-3 font-regular text-grayscale-500">
					{`${t('ticket.ticketNumber')} : ${tickets[0].id} ${isGrouped ? `- ${tickets[tickets.length - 1].id}` : ''}`}
				</p>
				{coupon && (
					<Button
						type="button"
						size={'sm'}
						variant={'ghost'}
						onClick={(e) => {
							e.stopPropagation()
							copyGuestCode(coupon.code)
						}}
						className="hover:bg-gray-200 [&_svg]:size-5"
					>
						<FileCopy className="size" />
					</Button>
				)}
			</div>
		</div>
	)
}
