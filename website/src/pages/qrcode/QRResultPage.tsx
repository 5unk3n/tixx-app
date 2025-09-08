import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'

import SelectEventTicket from '@/components/tickets/SelectEventTicket'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useConsumeEventTicket } from '@/hooks/queries/tickets/useConsumeEventTicket'
import { EventTicket, Ticket } from '@/types'

export default function QRResultPage() {
	const { state } = useLocation()
	const { message, eventTickets } = state || {}

	if (!state) {
		return <NoState />
	}

	if (eventTickets) {
		return <MultipleTickets message={message} eventTickets={eventTickets} />
	}

	return <QRCodeChecklist message={message} />
}

// TODO: 재선택할 때만 페이지 이동 나머지 에러 및 컴포넌트 제거
function NoState() {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<div className="flex h-svh flex-col gap-5 px-5 py-14 md:gap-10 md:pt-40">
			<div className="flex flex-1 flex-col items-center justify-center">
				<p className="mb-2 text-title-2">{t('qr.invalidAccess')}</p>
			</div>
			<div className="mx-auto flex w-full max-w-[350px] gap-3 *:flex-1">
				<Button onClick={() => navigate('/', { replace: true })}>
					{t('common.goBack')}
				</Button>
			</div>
		</div>
	)
}

interface QRCodeChecklistProps {
	message: string
}

function QRCodeChecklist({ message }: QRCodeChecklistProps) {
	const { t } = useTranslation()
	const navigate = useNavigate()

	return (
		<div className="flex h-svh flex-col gap-5 px-5 py-14 md:gap-10 md:pt-40">
			<div className="flex flex-1 flex-col items-center justify-center gap-5">
				<p className="text-title-2">{message}</p>
				<ul className="mx-auto text-body-1 font-regular">
					{message === t('qr.errors.qrExpired') ? (
						<>
							<li>{t('qr.scanNewQr')}</li>
						</>
					) : (
						<>
							<li>{t('qr.checkDateAndPlace')}</li>
							<li>{t('qr.checkTicket')}</li>
						</>
					)}
				</ul>
			</div>
			<div className="mx-auto flex w-full max-w-[350px] gap-3 *:flex-1">
				<Button variant={'grayLine'} onClick={() => navigate(-1)}>
					{t('common.goBack')}
				</Button>
			</div>
		</div>
	)
}

interface MultipleTicketsProps {
	message: string
	eventTickets: (EventTicket & { ticket: Ticket })[]
}

function MultipleTickets({ message, eventTickets }: MultipleTicketsProps) {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const [selectedEventTicketId, setSelectedEventTicketId] = useState('')

	const { mutateAsync: consumeEventTicket } = useConsumeEventTicket()

	const onEventTicketSelection = async (eventTicketId: string) => {
		if (eventTicketId === '') {
			toast.error(t('qr.selectTicket'))
			return
		}

		try {
			await consumeEventTicket({ eventTicketId: Number(eventTicketId) })
			toast.success(t('qr.entryComplete'), { position: 'top-center' })
			navigate(-1)
		} catch (error) {
			if (isAxiosError(error)) {
				const status = error.response?.status
				const errorData = error.response?.data || {}
				let message = errorData.message

				// 에러 케이스별 처리
				switch (status) {
					case 404:
						message = t('qr.errors.ticketNotFound', { id: eventTicketId })
						break

					case 400:
						if (message.includes('token')) {
							message = t('qr.errors.authMismatch')
						} else if (message.includes('already used')) {
							message = t('qr.errors.ticketAlreadyUsed')
						}
						break

					default:
						message = t('common.tryAgainLater')
						console.error('Unexpected error:', error)
				}

				toast.error(message)
			}
		}
	}

	return (
		<div className="flex h-svh flex-col gap-5 px-5 py-14 md:gap-10 md:pt-40">
			<div className="text-center">
				<p className="text-title-2 md:mb-10">{message}</p>
			</div>
			<div className="flex max-w-[745px] flex-1">
				<ScrollArea className="flex-1">
					<SelectEventTicket
						eventTickets={eventTickets as (EventTicket & { ticket: Ticket })[]}
						selectedEventTicketId={selectedEventTicketId}
						setSelectedEventTicketId={(eventTicketId) =>
							setSelectedEventTicketId(eventTicketId)
						}
					/>
				</ScrollArea>
			</div>
			<div className="mx-auto flex w-full max-w-[350px] gap-3 *:flex-1">
				<Button variant={'grayLine'} onClick={() => navigate(-1)}>
					{t('common.cancel')}
				</Button>
				<Button onClick={() => onEventTicketSelection(selectedEventTicketId)}>
					{t('common.completeSelection')}
				</Button>
			</div>
		</div>
	)
}
