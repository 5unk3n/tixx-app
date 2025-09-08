import { formatISO, parse, addDays } from 'date-fns'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import type { CreateTicketForm as CreateTicketFormType } from '@/types'

import Plus from '@/assets/icons/plus.svg?react'
import CreateTicketForm from '@/components/tickets/CreateTicketForm'
import TicketItem from '@/components/tickets/TicketItem'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { useCreateCoupon } from '@/hooks/queries/coupons/useCreateCoupon'
import { useUpdateCoupon } from '@/hooks/queries/coupons/useUpdateCoupon'
import { useEvent } from '@/hooks/queries/events/useEvent'
import { useEvents } from '@/hooks/queries/events/useEvents'
import { useHosts } from '@/hooks/queries/hosts/useHosts'
import { useCreateTicket } from '@/hooks/queries/tickets/useCreateTicket'
import { useHostStore } from '@/stores/hostStore'
import { TicketDetail } from '@/types'

type TicketWithCoupons = TicketDetail

export default function CreateTicketPage() {
	const { t } = useTranslation()
	const { state } = useLocation()
	const [showForm, setShowForm] = useState(false)
	const [selectedTicket, setSelectedTicket] =
		useState<TicketWithCoupons | null>(null)
	const [errorMessage, setErrorMessage] = useState('')
	const [eventId, setEventId] = useState(state?.eventId || null)

	const { hostId } = useHostStore()

	const { data: hosts } = useHosts()
	const host = hosts!.find((host) => host.id === hostId)
	const { data: events } = useEvents(host!.id, 'all', 'all')
	const { data: event } = useEvent(eventId)
	const tickets = event?.tickets

	const { mutateAsync: createTicket } = useCreateTicket()
	const { mutateAsync: createCoupon } = useCreateCoupon()
	const { mutateAsync: updateCoupon } = useUpdateCoupon()

	function groupTickets(tickets: TicketDetail[] | undefined): TicketDetail[][] {
		if (!tickets) return []
		const getGroupKey = (ticket: TicketDetail) =>
			[
				ticket.eventId,
				ticket.name,
				ticket.createdAt?.slice(0, 16) // 'YYYY-MM-DDTHH:mm'
			].join('|')
		const groups: Record<string, TicketDetail[]> = {}
		tickets.forEach((ticket) => {
			const key = getGroupKey(ticket)
			if (!groups[key]) groups[key] = []
			groups[key].push(ticket)
		})
		return Object.values(groups)
	}

	const ticketsWithCoupons: TicketWithCoupons[] = (tickets ??
		[]) as TicketWithCoupons[]
	const groupedTickets: TicketDetail[][] = groupTickets(ticketsWithCoupons)

	function getInitialTicketFormData(selectedTicket: TicketDetail) {
		const isCustom =
			selectedTicket.type !== 'standard' &&
			selectedTicket.type !== 'guest' &&
			selectedTicket.type !== 'vip'

		let quantity = ''
		let price = ''
		if (selectedTicket.name === 'Standard') {
			quantity = String(selectedTicket.quantity) || ''
			price = String(selectedTicket.price) || ''
		} else if (selectedTicket.coupons?.[0]) {
			quantity = String(selectedTicket.coupons[0].quantity)
		}

		return {
			startDate: new Date(selectedTicket.startAt),
			endDate: new Date(selectedTicket.endAt),
			startTime: selectedTicket.startAt.slice(11, 16),
			endTime: selectedTicket.endAt.slice(11, 16),
			name:
				selectedTicket.name === 'Standard'
					? 'Standard'
					: selectedTicket.name === 'Guest'
						? 'Guest'
						: 'Guest',
			type: isCustom ? 'custom' : selectedTicket.type,
			customName: isCustom ? selectedTicket.type : undefined,
			entryDateType: 'period',
			quantity,
			price,
			guestCodes: selectedTicket.coupons?.map((c) => c.code) || []
		}
	}

	async function handleCreateSubmit(data: CreateTicketFormType) {
		if (!event) return
		try {
			const isAfterMidnightTicket =
				Number(data.startTime.slice(0, 2)) * 60 +
					Number(data.startTime.slice(3)) >
				Number(data.endTime.slice(0, 2)) * 60 + Number(data.endTime.slice(3))

			if (data.entryDateType === 'byDate') {
				const startDate = data.startDate
				const dayCount =
					data.startDate && data.endDate
						? (data.endDate.getTime() - data.startDate.getTime()) /
								(1000 * 60 * 60 * 24) +
							1
						: 1
				for (let i = 0; i < dayCount; i++) {
					const ticketStart = addDays(startDate, i)
					const startAt = formatISO(parse(data.startTime, 'HH:mm', ticketStart))
					const endAt = formatISO(
						parse(
							data.endTime,
							'HH:mm',
							addDays(ticketStart, isAfterMidnightTicket ? 1 : 0)
						)
					)
					const ticket = await createTicket({
						eventId: Number(event.id),
						name: data.name,
						type: data.type === 'custom' ? data.customName : data.type,
						startAt,
						endAt,
						description: null,
						imageUrl: null,
						memo: null,
						price: data.name === 'Standard' ? Number(data.price) : undefined,
						quantity:
							data.name === 'Standard' ? Number(data.quantity) : undefined
					})
					if (data.name === 'Guest') {
						await createCoupon({
							ticketId: ticket.id,
							code: data.guestCodes?.[i] || '',
							quantity: Number(data.quantity),
							expiredAt: endAt
						})
					}
				}
			} else {
				const startAt = formatISO(
					parse(data.startTime, 'HH:mm', data.startDate)
				)
				const endAt = formatISO(
					parse(
						data.endTime,
						'HH:mm',
						addDays(data.endDate, isAfterMidnightTicket ? 1 : 0)
					)
				)
				const ticket = await createTicket({
					eventId: Number(event.id),
					name: data.name,
					type: data.type === 'custom' ? data.customName : data.type,
					startAt,
					endAt,
					description: null,
					imageUrl: null,
					memo: null,
					price: data.name === 'Standard' ? Number(data.price) : undefined,
					quantity: data.name === 'Standard' ? Number(data.quantity) : undefined
				})
				if (data.name === 'Guest') {
					const codes = data.guestCodes || []
					for (const code of codes) {
						await createCoupon({
							ticketId: ticket.id,
							code: code,
							quantity: Number(data.quantity),
							expiredAt: endAt
						})
					}
				}
			}
			setShowForm(false)
		} catch (error) {
			console.error(error)
			// TODO: 에러 메시지 처리
		}
	}

	async function handleEditSubmit(data: CreateTicketFormType) {
		try {
			// selectedTicket의 couponId, code, quantity, expiredAt 등 활용
			if (selectedTicket && selectedTicket.coupons?.[0]) {
				await updateCoupon({
					couponId: selectedTicket.coupons[0].id,
					code: data.guestCodes?.[0],
					quantity: Number(data.quantity)
				})
			}
			setShowForm(false)
		} catch (error) {
			console.error(error)
			// TODO: 에러 메시지 처리
		}
	}

	const openForm = () => {
		if (!event) {
			setErrorMessage(t('ticket.selectEvent'))
			return
		}
		setShowForm(true)
	}

	return (
		<div className="mx-auto min-h-svh p-5">
			<h1 className="text-center text-title-1 font-semibold">
				{t('ticket.manageTicket')}
			</h1>

			{/* 데스크탑 */}
			<div className="mx-auto mt-12 hidden flex-1 justify-center md:flex md:gap-8">
				<section className="w-full max-w-[350px]">
					<Label className="text-grayscale-500' px-2 py-1 text-caption-1 font-medium">
						{t('ticket.selectEvent')}
					</Label>
					<Select
						onValueChange={(value) => {
							setErrorMessage('')
							setEventId(value)
						}}
						value={event?.id.toString()}
					>
						<SelectTrigger
							className={errorMessage ? 'border-status-destructive' : ''}
						>
							<SelectValue placeholder={t('common.select')} />
						</SelectTrigger>
						<SelectContent>
							{events?.map((event) => (
								<SelectItem key={event.id} value={String(event.id)}>
									{event.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="mt-1 h-7 text-right text-body-1 text-status-destructive">
						{errorMessage}
					</p>
					{/* <h2 className="mb-8 text-heading-2 font-semibold">
						{t('ticket.issueTicket')}
					</h2> */}
					<h2 className="text-title-3 font-medium">
						{t('ticket.issueTicket')}
					</h2>
					<p className="mt-3 text-caption-1 font-medium text-grayscale-500">
						{t('ticket.createTicketGuide')}
					</p>
					<ul className="mt-1 flex flex-col gap-3"></ul>
					<ul className="flex flex-col gap-3">
						<li
							onClick={() => {
								openForm()
								setSelectedTicket(null)
							}}
							className="flex h-[160px] cursor-pointer items-center justify-center rounded-2xl bg-grayscale-50"
						>
							<Plus className="mx-auto h-9 w-9 rounded-full bg-grayscale-900 p-2 text-grayscale-0" />
						</li>
						{groupedTickets.map((ticketGroup) => (
							<li key={ticketGroup[0].id}>
								<TicketItem
									eventName={event?.name || ''}
									isGrouped={ticketGroup.length > 1}
									tickets={ticketGroup}
									coupon={ticketGroup[0].coupons[0]}
									onEditClick={() => {
										openForm()
										setSelectedTicket(ticketGroup[0])
									}}
								/>
							</li>
						))}
					</ul>
				</section>
				{showForm && (
					<section className="max-w-[350px]">
						<h2 className="mb-8 text-heading-2 font-semibold">
							{t('ticket.ticketInfo')}
						</h2>
						{selectedTicket ? (
							<CreateTicketForm
								event={event!}
								mode="edit"
								initialData={getInitialTicketFormData(selectedTicket)}
								onSubmit={handleEditSubmit}
							/>
						) : (
							<CreateTicketForm event={event!} onSubmit={handleCreateSubmit} />
						)}
					</section>
				)}
			</div>

			{/* 모바일 */}
			<div className="mt-12 w-full md:hidden">
				{showForm ? (
					<section>
						<X
							onClick={() => setShowForm(false)}
							className="mb-2 ml-auto cursor-pointer"
						/>
						{selectedTicket ? (
							<CreateTicketForm
								event={event!}
								mode="edit"
								initialData={getInitialTicketFormData(selectedTicket)}
								onSubmit={handleEditSubmit}
							/>
						) : (
							<CreateTicketForm event={event!} onSubmit={handleCreateSubmit} />
						)}
					</section>
				) : (
					<section>
						<Label className="text-grayscale-500' px-2 py-1 text-caption-1 font-medium">
							{t('ticket.selectEvent')}
						</Label>
						<Select
							onValueChange={(value) => {
								setErrorMessage('')
								setEventId(value)
							}}
							value={event?.id.toString()}
						>
							<SelectTrigger
								className={errorMessage ? 'border-status-destructive' : ''}
							>
								<SelectValue placeholder={t('common.select')} />
							</SelectTrigger>
							<SelectContent>
								{events?.map((event) => (
									<SelectItem key={event.id} value={String(event.id)}>
										{event.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="mt-1 h-7 text-right text-body-1 text-status-destructive">
							{errorMessage}
						</p>
						<h2 className="text-title-3 font-medium">
							{t('ticket.issueTicket')}
						</h2>
						<p className="mt-3 text-caption-1 font-medium text-grayscale-500">
							{t('ticket.createTicketGuide')}
						</p>
						<ul className="mt-1 flex flex-col gap-3">
							<li
								onClick={() => {
									openForm()
									setSelectedTicket(null)
								}}
								className="flex h-[160px] cursor-pointer items-center justify-center rounded-2xl bg-grayscale-50"
							>
								<Plus className="mx-auto h-9 w-9 rounded-full bg-grayscale-900 p-2 text-grayscale-0" />
							</li>
							{groupedTickets.map((ticketGroup) => (
								<li key={ticketGroup[0].id}>
									<TicketItem
										eventName={event?.name || ''}
										tickets={ticketGroup}
										coupon={ticketGroup[0].coupons[0]}
										isGrouped={ticketGroup.length > 1}
										onEditClick={() => {
											openForm()
											setSelectedTicket(ticketGroup[0])
										}}
									/>
								</li>
							))}
						</ul>
					</section>
				)}
			</div>
		</div>
	)
}
