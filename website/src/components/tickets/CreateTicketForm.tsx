import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import {
	addDays,
	endOfDay,
	format,
	isAfter,
	isBefore,
	parseISO,
	startOfDay,
	subDays
} from 'date-fns'
import { ChangeEvent, useEffect } from 'react'
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import BubbleTooltip from '../ui/BubbleTooltip'

import Error from '@/assets/icons/error.svg?react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/DatePicker'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreateTicketFormSchema } from '@/lib/schemas/tickets'
import { cn } from '@/lib/utils'
import { CreateTicketForm as CreateTicketFormType, Event } from '@/types'

const ticketType = [
	{
		value: 'Standard',
		label: 'ticket.standard'
	},
	{
		value: 'Guest',
		label: 'ticket.guest'
	}
]

const standardTicketNames = [
	{ value: 'earlyBird', label: 'ticket.earlyBird' },
	{ value: 'standard', label: 'ticket.standard' },
	{ value: 'custom', label: 'ticket.custom' }
]

const guestTicketNames = [
	{ value: 'guest', label: 'ticket.guest' },
	{ value: 'vip', label: 'ticket.vip' },
	{ value: 'custom', label: 'ticket.custom' }
]

interface CreateTicketFormProps {
	event: Event
	mode?: 'create' | 'edit'
	initialData?: Partial<CreateTicketFormType>
	onSubmit?: (data: CreateTicketFormType) => Promise<void>
}

// Event Date, Time은 UTC 기준임. UTC+9로 변환해서 사용
// 날짜 시간 따로가 아니라 합쳐서 계산해야함...
export default function CreateTicketForm({
	event,
	mode = 'create',
	initialData,
	onSubmit: onSubmitProp
}: CreateTicketFormProps) {
	const navigate = useNavigate()
	const { t } = useTranslation()

	const fieldLabelMap = {
		startDate: t('event.date'),
		endDate: t('event.date'),
		startTime: t('event.time'),
		endTime: t('event.time'),
		name: t('ticket.type'),
		type: t('common.name'),
		customName: t('ticket.ticketType'),
		entryDateType: t('ticket.entryDate'),
		quantity: t('ticket.quantity'),
		price: t('ticket.price'),
		guestCodes: t('ticket.guestCode')
	}

	const createTicketForm = useForm<CreateTicketFormType>({
		resolver: zodResolver(CreateTicketFormSchema),
		defaultValues: {
			...initialData,
			type: initialData?.type,
			customName: initialData?.customName || '',
			quantity: initialData?.quantity || '',
			guestCodes: initialData?.guestCodes || undefined
		}
	})

	useEffect(() => {
		if (initialData) {
			createTicketForm.reset({
				...initialData,
				type:
					initialData.type === 'custom'
						? 'custom'
						: initialData.type || undefined,
				customName: initialData.customName || undefined,
				quantity: initialData.quantity || undefined,
				guestCodes: initialData.guestCodes || undefined
			})
		} else {
			createTicketForm.reset({
				startTime: undefined,
				endTime: undefined,
				quantity: undefined,
				guestCodes: undefined,
				name: undefined
			})
		}
	}, [createTicketForm, event, initialData])

	const startDateTimeUTC = parseISO(`${event.startDate}T${event.startTime}Z`)
	const endDateTimeUTC = parseISO(`${event.endDate}T${event.endTime}Z`)
	const isAfterMidnightEvent =
		startDateTimeUTC.getHours() * 60 + startDateTimeUTC.getMinutes() >
		endDateTimeUTC.getHours() * 60 + endDateTimeUTC.getMinutes()
	const displayEndDateTimeUTC = isAfterMidnightEvent
		? subDays(endDateTimeUTC, 1)
		: endDateTimeUTC

	const onSubmit: SubmitHandler<CreateTicketFormType> = async (data) => {
		try {
			if (onSubmitProp) {
				await onSubmitProp(data)
				return
			}
			navigate('/events/invite', {
				state: {
					eventId: event.id
				}
			})
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response?.data.message === 'Coupon code already exists') {
					createTicketForm.setError('guestCodes', {
						message: t('ticket.duplicateCode')
					})
				} else if (
					error.response?.data.message ===
					'The ticket usage time is outside the event period.'
				) {
					createTicketForm.setError('startTime', {
						message: t('ticket.timeOutOfEvent')
					})
					createTicketForm.setError('endTime', {
						message: t('ticket.timeOutOfEvent')
					})
				}
			}
			console.error(error)
		}
	}

	const onError: SubmitErrorHandler<CreateTicketFormType> = (errors) => {
		const errorFields = Object.keys(errors)
			.map((key) => fieldLabelMap[key as keyof typeof fieldLabelMap] || key)
			.filter(Boolean)

		if (errorFields.length > 0) {
			toast.error(
				t('common.formErrorFields', {
					fields: errorFields.join(', ')
				})
			)
		} else {
			toast.error(t('common.formError'))
		}
	}

	const handleTimeChange = (
		e: ChangeEvent<HTMLInputElement>,
		onChange: (value: string) => void
	) => {
		const value = e.target.value
		const numbersOnly = value.replace(/[^\d]/g, '')
		const truncated = numbersOnly.slice(0, 4)

		let formattedValue = ''

		if (truncated.length <= 2) {
			// 2자리 이하일 경우 그대로 표시 (시간 부분)
			formattedValue = truncated
		} else {
			// 3자리 이상일 경우 콜론 추가
			const hours = truncated.slice(0, 2)
			const minutes = truncated.slice(2)
			formattedValue = `${hours}:${minutes}`

			// 시간 유효성 체크 (옵션)
			const hoursNum = parseInt(hours, 10)
			const minutesNum = parseInt(minutes, 10)

			if (hoursNum > 23) {
				formattedValue = `23:${minutes}`
			}

			if (minutesNum > 59) {
				formattedValue = `${hours}:59`
			}
		}

		onChange(formattedValue)
	}

	const entryDateType = [
		{
			value: 'byDate',
			label: t('ticket.entryByDate'),
			description: t('ticket.entryByDateDesc')
		},
		{
			value: 'period',
			label: t('ticket.entryPeriod'),
			description: t('ticket.entryPeriodDesc')
		}
	]

	return (
		<Form {...createTicketForm}>
			<form
				onSubmit={createTicketForm.handleSubmit(onSubmit, onError)}
				noValidate
			>
				<div>
					<FormLabel>{t('event.date')}</FormLabel>
					<div className="flex gap-3">
						<FormField
							control={createTicketForm.control}
							name="startDate"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<div
											style={
												mode === 'edit'
													? { pointerEvents: 'none', opacity: 0.7 }
													: {}
											}
										>
											<DatePicker
												field={field}
												placeholder="YYYY-MM-DD"
												calendarProps={{
													disabled: (date) => {
														return (
															isBefore(
																date,
																subDays(startOfDay(startDateTimeUTC), 1)
															) ||
															isAfter(
																date,
																addDays(endOfDay(displayEndDateTimeUTC), 1)
															)
														)
													}
												}}
											/>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<p className="self-center text-body-1 font-medium text-grayscale-500">
							-
						</p>
						<FormField
							control={createTicketForm.control}
							name="endDate"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<div
											style={
												mode === 'edit'
													? { pointerEvents: 'none', opacity: 0.7 }
													: {}
											}
										>
											<DatePicker
												field={field}
												placeholder="YYYY-MM-DD"
												calendarProps={{
													disabled: (date) => {
														const watchedStartDate =
															createTicketForm.watch('startDate')
														return (
															isBefore(
																date,
																subDays(startOfDay(startDateTimeUTC), 1)
															) ||
															isBefore(
																date,
																subDays(
																	startOfDay(watchedStartDate || new Date()),
																	0
																)
															) ||
															isAfter(
																date,
																addDays(endOfDay(displayEndDateTimeUTC), 1)
															)
														)
													}
												}}
											/>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<FormMessage className="text-status-destructive">
						{createTicketForm.formState.errors.startDate?.message ||
							createTicketForm.formState.errors.endDate?.message}
					</FormMessage>
				</div>
				<div>
					<FormLabel>{t('event.time')}</FormLabel>
					<div className="flex gap-3">
						<FormField
							control={createTicketForm.control}
							name="startTime"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<Input
											type="text"
											placeholder="00:00"
											error={fieldState.invalid}
											{...field}
											onChange={(e) => handleTimeChange(e, field.onChange)}
											disabled={mode === 'edit'}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<p className="self-center text-body-1 font-medium text-grayscale-500">
							-
						</p>
						<FormField
							control={createTicketForm.control}
							name="endTime"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<Input
											type="text"
											placeholder="23:59"
											error={fieldState.invalid}
											{...field}
											onChange={(e) => handleTimeChange(e, field.onChange)}
											disabled={mode === 'edit'}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<FormMessage className="text-status-destructive">
						{createTicketForm.formState.errors.startTime?.message ||
							createTicketForm.formState.errors.endTime?.message}
					</FormMessage>
				</div>
				<FormField
					control={createTicketForm.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('ticket.type')}</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									value={field.value}
									className="flex"
									disabled={mode === 'edit'}
								>
									{ticketType.map((item) => (
										<FormItem
											key={item.value}
											className="flex-1 whitespace-nowrap"
										>
											<FormLabel
												className={cn(
													'flex flex-1 cursor-pointer items-center rounded-lg border-2 px-4 py-3 text-label-1 font-regular'
												)}
											>
												<FormControl>
													<RadioGroupItem value={item.value} />
												</FormControl>
												<span className="ml-2">{t(item.label)}</span>
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{createTicketForm.watch('name') && (
					<FormField
						control={createTicketForm.control}
						name="type"
						render={({ field }) => {
							const selectedTicketType = createTicketForm.watch('name')
							const ticketNames =
								selectedTicketType === 'Standard'
									? standardTicketNames
									: guestTicketNames

							return (
								<FormItem>
									<FormLabel>{t('common.name')}</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											value={field.value}
											className="flex"
											disabled={mode === 'edit'}
										>
											{ticketNames.map((ticketName) => (
												<FormItem
													key={ticketName.value}
													className="flex-1 whitespace-nowrap"
												>
													<FormLabel
														className={cn(
															'flex flex-1 cursor-pointer items-center rounded-lg border-2 px-4 py-3 text-label-1 font-regular'
														)}
													>
														<FormControl>
															<RadioGroupItem value={ticketName.value} />
														</FormControl>
														<span className="ml-2">{t(ticketName.label)}</span>
													</FormLabel>
												</FormItem>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)
						}}
					/>
				)}
				{createTicketForm.watch('type') === 'custom' && (
					<FormField
						control={createTicketForm.control}
						name="customName"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel>{t('ticket.ticketType')}</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder={t('ticket.ticketTypePlaceholder')}
										error={fieldState.invalid}
										{...field}
										disabled={mode === 'edit'}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
				<FormField
					control={createTicketForm.control}
					name="entryDateType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('ticket.entryDate')}</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									value={field.value}
									className="flex"
									disabled={mode === 'edit'}
								>
									{entryDateType.map((item) => (
										<FormItem
											key={item.value}
											className="flex-1 whitespace-nowrap"
										>
											<FormLabel
												className={cn(
													'flex flex-1 cursor-pointer items-center rounded-lg border-2 px-4 py-3 text-label-1 font-regular'
												)}
											>
												<FormControl>
													<RadioGroupItem value={item.value} />
												</FormControl>
												<span className="mx-2">{t(item.label)}</span>
												<BubbleTooltip content={item.description}>
													<Error />
												</BubbleTooltip>
											</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={createTicketForm.control}
					name="quantity"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel>{t('ticket.quantity')}</FormLabel>
							<FormControl>
								<Input
									type="text"
									inputMode="numeric"
									placeholder={t('ticket.quantityPlaceholder', { max: '0' })}
									error={fieldState.invalid}
									{...field}
									onChange={(e) => {
										const value = e.target.value.replace(/[^0-9]/g, '')
										field.onChange(value)
									}}
									disabled={
										mode === 'edit' &&
										createTicketForm.watch('name') === 'Standard'
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* 가격/게스트코드 입력 필드 조건부 렌더링 */}
				{
					(() => {
						if (createTicketForm.watch('name') === 'Standard') {
							return (
								<FormField
									control={createTicketForm.control}
									name="price"
									render={({ field, fieldState }) => (
										<FormItem>
											<FormLabel>{t('ticket.price')}</FormLabel>
											<FormControl>
												<Input
													type="string"
													placeholder={t('ticket.pricePlaceholder')}
													error={fieldState.invalid}
													{...field}
													onChange={(e) => {
														const value = e.target.value.replace(/[^0-9]/g, '')
														field.onChange(value)
													}}
													disabled={mode === 'edit'}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)
						}
						if (
							createTicketForm.watch('name') === 'Guest' &&
							createTicketForm.watch('entryDateType') === 'byDate'
						) {
							const startDate = createTicketForm.watch('startDate')
							const endDate = createTicketForm.watch('endDate')

							if (!startDate || !endDate) {
								toast.error(t('ticket.selectDate'))
								return null
							}

							const dayCount =
								startDate && endDate
									? (endDate.getTime() - startDate.getTime()) /
											(1000 * 60 * 60 * 24) +
										1
									: 1
							return (
								<div>
									{[...Array(dayCount)].map((_, idx) => (
										<FormField
											key={idx}
											control={createTicketForm.control}
											name={`guestCodes.${idx}`}
											render={({ field, fieldState }) => (
												<FormItem>
													<FormLabel>{`${idx + 1}일차 (${format(addDays(startDate, idx), 'MM.dd')}) 게스트코드 `}</FormLabel>
													<FormControl>
														<Input
															type="text"
															placeholder={t('ticket.guestCodePlaceholder')}
															error={fieldState.invalid}
															{...field}
															onChange={(e) => {
																const value = e.target.value
																	.replace(/[^a-z0-9]/g, '')
																	.toLowerCase()
																field.onChange(value)
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									))}
								</div>
							)
						}
						if (
							createTicketForm.watch('name') === 'Guest' &&
							createTicketForm.watch('entryDateType') !== 'byDate'
						) {
							return (
								<FormField
									control={createTicketForm.control}
									name="guestCodes.0"
									render={({ field, fieldState }) => (
										<FormItem>
											<FormLabel>{t('ticket.guestCode')}</FormLabel>
											<FormControl>
												<Input
													type="text"
													placeholder={t('ticket.guestCodePlaceholder')}
													error={fieldState.invalid}
													{...field}
													onChange={(e) => {
														const value = e.target.value
															.replace(/[^a-z0-9]/g, '')
															.toLowerCase()
														field.onChange(value)
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)
						}
						return null
					})() as React.ReactNode
				}
				<Button
					type="submit"
					variant="black"
					disabled={
						(mode === 'edit' &&
							createTicketForm.watch('name') === 'Standard') ||
						createTicketForm.formState.isSubmitting
					}
					className="mt-4 w-full"
				>
					{mode === 'edit' ? t('common.edit') : t('ticket.publish')}
				</Button>
			</form>
		</Form>
	)
}
