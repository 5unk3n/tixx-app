import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ParseError, parsePhoneNumberWithError } from 'libphonenumber-js'
import { ChangeEvent, useRef, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form'
import CropModal from '../ui/ImageCropDialog'
import { Input } from '../ui/input'
import Postcode from '../ui/Postcode'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

import { uploadFile } from '@/apis/file/uploadFile'
import { getGeocode } from '@/apis/maps/getGeocode'
import LocalParking from '@/assets/icons/local-parking.svg?react'
import OtherHouses from '@/assets/icons/other-houses.svg?react'
import SmokeFree from '@/assets/icons/smoke-free.svg?react'
import SmokingRooms from '@/assets/icons/smoking-rooms.svg?react'
import { useProfile } from '@/hooks/queries/clientUser/useProfile'
import { useRequestPresignedUrl } from '@/hooks/queries/file/useRequestPresignedUrl'
import { useDeleteHost } from '@/hooks/queries/hosts/useDeleteHost'
import { useCreatePlace } from '@/hooks/queries/places/useCreatePlace'
import { CreateHostFormSchema } from '@/lib/schemas/hosts'
import { CreatePlacePayloadSchema } from '@/lib/schemas/places'
import { cn } from '@/lib/utils'
import {
	CreateEventPayload,
	CreateEventResponse,
	CreateHostForm as CreateHostFormType,
	CreateHostPayload,
	CreateHostResponse,
	UploadableMimeType
} from '@/types'
import { formatPhoneNumberOnTyping } from '@/utils/formatters'

const hostCategory = [
	{
		value: 'Brand',
		label: 'host.brand'
	},
	{
		value: 'Promote',
		label: 'host.promoter'
	},
	{
		value: 'Venue',
		label: 'host.venue'
	}
]

// 체크박스로 표시할 정보 항목들을 정의합니다.
const informationItems = [
	{
		value: 'isNoSmoking',
		label: 'noSmoking'
	},
	{
		value: 'hasSmokingBooth',
		label: 'smokingBooth'
	},
	{
		value: 'hasParkingArea',
		label: 'parkingSpace'
	},
	{
		value: 'hasWaitingArea',
		label: 'waitingArea'
	}
] as const

interface CreateHostFormProps {
	mode: 'create' | 'update'
	initialData?: CreateHostFormType
	onSubmitHost: (payload: CreateHostPayload) => Promise<CreateHostResponse>
	onSubmitEvent: (payload: CreateEventPayload) => Promise<CreateEventResponse>
	onSuccessSubmitHost?: (host: CreateHostResponse) => void
}

export default function CreateHostForm({
	mode,
	initialData,
	onSubmitHost,
	onSubmitEvent,
	onSuccessSubmitHost
}: CreateHostFormProps) {
	const navigate = useNavigate()
	const { t } = useTranslation()
	const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [tempImage, setTempImage] = useState<File | null>(null)
	const imageFieldToEdit = useRef<'image' | 'venue.medias'>('image')

	const createHostForm = useForm<CreateHostFormType>({
		resolver: zodResolver(CreateHostFormSchema),
		defaultValues: initialData
	})

	const { data: profile } = useProfile()
	const { mutateAsync: requestPresignedUrl } = useRequestPresignedUrl()
	const { mutateAsync: createPlace } = useCreatePlace()
	const { mutateAsync: deleteHost } = useDeleteHost()

	const onFileChange = (
		e: ChangeEvent<HTMLInputElement>,
		field: 'image' | 'venue.medias'
	) => {
		const file = e.target.files?.[0]
		if (!file) {
			return
		}

		if (file.type.startsWith('image')) {
			imageFieldToEdit.current = field
			setTempImage(file)
			setIsDialogOpen(true)
		}
	}

	const onSubmit: SubmitHandler<CreateHostFormType> = async (data) => {
		try {
			let hostImageRes = null

			if (data.image) {
				hostImageRes = await requestPresignedUrl({
					folder: 'hosts',
					id: String(profile!.id),
					mimetype: data.image.type as UploadableMimeType
				})

				await uploadFile(
					hostImageRes.presignedUrl,
					data.image.type as UploadableMimeType,
					data.image
				)
			}

			const parsedPhone = parsePhoneNumberWithError(data.contactPhone, 'KR')

			const hostPayload: CreateHostPayload = {
				name: data.name,
				imageUrl: hostImageRes?.mediaUrl,
				category: data.category,
				description: data.description,
				contactName: data.contactName,
				contactPhone: parsedPhone.number
			}

			const hostResponse = await onSubmitHost(hostPayload)
			if (onSuccessSubmitHost) {
				onSuccessSubmitHost(hostResponse)
			}

			const isAllVenueFieldFilled =
				data.venue &&
				data.venue.placeRoadAddress &&
				data.venue.medias &&
				data.venue.medias.length > 0 &&
				data.venue.startTime &&
				data.venue.endTime

			if (data.category === 'Venue' && data.venue && isAllVenueFieldFilled) {
				const { x, y } = (
					await getGeocode({ query: data.venue.placeRoadAddress! })
				).documents[0]

				const result = await CreatePlacePayloadSchema.safeParseAsync({
					name: data.venue.placeName || ' ',
					address: data.venue.placeRoadAddress,
					latitude: +y,
					longitude: +x
				})

				if (result.success) {
					const mediaRes = await Promise.all(
						data.venue.medias!.map((file) =>
							requestPresignedUrl({
								folder: 'events',
								id: String(profile!.id),
								mimetype: file.type as UploadableMimeType
							})
						)
					)

					await Promise.all(
						mediaRes.map((res, index) =>
							uploadFile(
								res.presignedUrl,
								data.venue!.medias![index].type as UploadableMimeType,
								data.venue!.medias![index]
							)
						)
					)

					const medias = mediaRes.map((res, index) => ({
						mediaUrl: res.mediaUrl,
						mimeType: data.venue!.medias![index].type as UploadableMimeType,
						sortOrder: index
					}))

					const informations = [
						{
							isNoSmoking: data.venue.informations?.isNoSmoking || false,
							hasSmokingBooth:
								data.venue.informations?.hasSmokingBooth || false,
							hasParkingArea: data.venue.informations?.hasParkingArea || false,
							hasWaitingArea: data.venue.informations?.hasWaitingArea || false
						}
					]

					const place = await createPlace(result.data)
					const hashtags = data.venue.hashtag
						? data.venue.hashtag
								.split('#')
								.map((tag) => tag.trim())
								.filter(Boolean)
						: []

					const payload: CreateEventPayload = {
						name: data.name,
						description: data.description || '',
						startDate: format(new Date('1000-01-01'), 'yyyy-MM-dd'),
						endDate: format(new Date('9999-12-31'), 'yyyy-MM-dd'),
						startTime: data.venue.startTime! + ':00',
						endTime: data.venue.endTime! + ':00',
						medias,
						hostId: hostResponse.id,
						placeId: place.id,
						hashtags,
						informations,
						isVenue: true
					}
					try {
						await onSubmitEvent(payload)
						navigate(`/channel/settings`)
					} catch (error) {
						if (mode === 'create') {
							console.error(error)
							toast.error(t('host.venueCreateFail'))
							await deleteHost(hostResponse.id)
						} else {
							toast.error(t('host.venueUpdateFail'))
						}
					}
				}
			}
		} catch (error) {
			if (error instanceof ParseError) {
				toast.error(t('common.invalidPhone'))
				return
			}

			console.error(error)
			toast.error(t('common.serverError'))
		}
	}

	const onError = (errors: Record<string, unknown>) => {
		const fieldLabelMap: Record<string, string> = {
			image: t('host.profileImage'),
			name: t('host.name'),
			category: t('host.category'),
			description: t('host.description'),
			contactName: t('host.contactName'),
			contactPhone: t('host.contactPhone'),
			placeRoadAddress: t('event.location'),
			placeName: t('event.detailLocation'),
			startTime: t('event.time'),
			endTime: t('event.time'),
			medias: t('event.eventImage')
		}

		const errorFields = Object.keys(errors).map((key) => {
			if (key === 'venue') {
				return Object.keys(errors.venue!)
					.map((key) => fieldLabelMap[key])
					.flat()
			}
			return fieldLabelMap[key]
		})

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

	return (
		<Form {...createHostForm}>
			<form
				onSubmit={createHostForm.handleSubmit(onSubmit, onError)}
				noValidate
				className="mt-[54px] flex flex-col gap-2"
			>
				<FormField
					control={createHostForm.control}
					name="image"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									id="profileImage"
									type="file"
									className="hidden"
									accept="image/jpeg,image/png,image/gif,image/webp"
									onChange={(e) => {
										onFileChange(e, 'image')
									}}
									onClick={(e) => {
										const target = e.target as HTMLInputElement
										target.value = ''
									}}
								/>
							</FormControl>
							<div className="flex gap-5">
								<div
									className={cn(
										'aspect-square w-[275px] overflow-hidden rounded-full bg-gray-100'
									)}
								>
									<img
										src={
											(field.value && URL.createObjectURL(field.value)) ||
											undefined
										}
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="mt-2 flex flex-col justify-end gap-3">
									<div className="flex w-[275px] flex-col gap-5">
										<Button variant="gray" className="w-full" asChild>
											<FormLabel
												className="cursor-pointer"
												htmlFor="profileImage"
											>
												{t('event.uploadImage')}
											</FormLabel>
										</Button>
									</div>
								</div>
							</div>
						</FormItem>
					)}
				/>
				<FormField
					control={createHostForm.control}
					name="name"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('host.name')}
							</FormLabel>
							<FormDescription>{t('host.nameDesc')}</FormDescription>
							<FormControl>
								<Input
									type="text"
									placeholder={t('host.namePlaceholder')}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={createHostForm.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('host.category')}
							</FormLabel>
							<FormDescription>{t('host.categoryDesc')}</FormDescription>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									value={field.value}
									className="flex"
								>
									{hostCategory.map((item) => (
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
				{createHostForm.watch('category') === 'Venue' && (
					<div>
						<FormField
							control={createHostForm.control}
							name="venue.placeRoadAddress"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
										{t('event.location')}
									</FormLabel>
									<FormDescription>{t('event.locationDesc')}</FormDescription>
									<FormControl>
										<Input
											type="text"
											placeholder={t('event.locationPlaceholder')}
											error={fieldState.invalid}
											{...field}
											onFocus={() => setIsPostcodeOpen(true)}
											readOnly
										/>
									</FormControl>
									<FormMessage />
									<Postcode
										isOpen={isPostcodeOpen}
										setIsOpen={setIsPostcodeOpen}
										onSelect={(address) => {
											createHostForm.setValue('venue.placeRoadAddress', address)
										}}
									/>
								</FormItem>
							)}
						/>
						<FormField
							control={createHostForm.control}
							name="venue.placeName"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormDescription>
										{t('event.detailLocationDesc')}
									</FormDescription>
									<FormControl>
										<Input
											type="text"
											placeholder={t('event.detailLocationPlaceholder')}
											error={fieldState.invalid}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
							{t('event.placeInfoLabel')}
						</FormLabel>
						<FormDescription>{t('event.placeInfoDesc')}</FormDescription>
						<div className="mb-4 mt-2 flex flex-row flex-wrap gap-6">
							{informationItems.map((item) => (
								<FormField
									key={item.value}
									control={createHostForm.control}
									name={`venue.informations.${item.value}`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<label
													key={item.value}
													className="flex flex-row items-center gap-4"
												>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
													<div className="flex flex-col items-center hover:cursor-pointer">
														<PlaceInfoIcon value={item.value} />
														<span className="mt-2 text-body-1 font-regular">
															{t('event.placeInfo.' + item.label)}
														</span>
													</div>
												</label>
											</FormControl>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormMessage />
						<FormField
							control={createHostForm.control}
							name="venue.hashtag"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
										{t('event.hashtag')}
									</FormLabel>
									<FormDescription>{t('event.hashtagDesc')}</FormDescription>
									<FormControl>
										<Input
											type="text"
											placeholder={t('event.hashtagPlaceholder')}
											error={fieldState.invalid}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('event.time')}
							</FormLabel>
							<FormDescription>{t('event.timeDesc')}</FormDescription>
							<div className="flex gap-3">
								<FormField
									control={createHostForm.control}
									name="venue.startTime"
									render={({ field, fieldState }) => (
										<FormItem>
											<FormControl>
												<Input
													type="text"
													placeholder="00:00"
													error={fieldState.invalid}
													{...field}
													onChange={(e) => handleTimeChange(e, field.onChange)}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<p className="self-center text-body-1 font-medium text-grayscale-500">
									-
								</p>
								<FormField
									control={createHostForm.control}
									name="venue.endTime"
									render={({ field, fieldState }) => (
										<FormItem>
											<FormControl>
												<Input
													type="text"
													placeholder="23:59"
													error={fieldState.invalid}
													{...field}
													onChange={(e) => handleTimeChange(e, field.onChange)}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<FormMessage className="text-status-destructive">
								{createHostForm.formState.errors.venue?.startTime?.message ||
									createHostForm.formState.errors.venue?.endTime?.message}
							</FormMessage>
						</div>
						<FormField
							control={createHostForm.control}
							name="venue.medias"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
										{t('event.venueImage')}
									</FormLabel>
									<FormDescription>{t('event.venueImageDesc')}</FormDescription>
									<FormControl>
										<Input
											id="medias"
											type="file"
											className="hidden"
											accept="image/jpeg,image/png,image/gif,image/webp"
											onChange={(e) => {
												onFileChange(e, 'venue.medias')
											}}
											onClick={(e) => {
												const target = e.target as HTMLInputElement
												target.value = ''
											}}
										/>
									</FormControl>
									<div className="">
										<div className="flex items-end gap-3">
											<div className="flex w-[275px] flex-col gap-5">
												<Button variant="gray" className="w-full" asChild>
													<FormLabel
														className="cursor-pointer"
														htmlFor="medias"
													>
														{t('event.uploadImage')}
													</FormLabel>
												</Button>
											</div>
										</div>
										<ScrollArea className="mt-2">
											<div className="flex gap-4 pb-4">
												{field.value?.map((file, index) => {
													return (
														<div
															key={file.name + index}
															className={cn(
																'scroll relative aspect-square w-[275px] rounded-lg border'
															)}
														>
															<img
																src={
																	(field.value && URL.createObjectURL(file)) ||
																	undefined
																}
																className="h-full w-full object-contain"
															/>
															{index === 0 && (
																<p className="absolute left-1 top-1 rounded-sm bg-black/40 px-2 py-1 text-label-1 font-medium text-primary-500">
																	{t('event.mainImage')}
																</p>
															)}
															<Button
																type="button"
																onClick={() => {
																	field.onChange(
																		field.value?.filter((f) => f !== file)
																	)
																}}
																variant={'grayLine'}
																size={'sm'}
																className="absolute right-1 top-1"
															>
																{t('common.delete')}
															</Button>
														</div>
													)
												})}
											</div>
											<ScrollBar orientation="horizontal" />
										</ScrollArea>
									</div>
								</FormItem>
							)}
						/>
					</div>
				)}
				<FormField
					control={createHostForm.control}
					name="description"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('host.description')}
							</FormLabel>
							<FormDescription>{t('host.descriptionDesc')}</FormDescription>
							<FormControl>
								<Input
									type="text"
									placeholder={t('host.descriptionPlaceholder')}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={createHostForm.control}
					name="contactName"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('host.contactName')}
							</FormLabel>
							<FormDescription>{t('host.contactNameDesc')}</FormDescription>
							<FormControl>
								<Input
									type="text"
									placeholder={t('host.contactNamePlaceholder')}
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={createHostForm.control}
					name="contactPhone"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('host.contactPhone')}
							</FormLabel>
							<FormDescription>{t('host.contactPhoneDesc')}</FormDescription>
							<FormControl>
								<Input
									type="text"
									placeholder={t('host.contactPhonePlaceholder')}
									error={fieldState.invalid}
									{...field}
									onChange={(e) => {
										const value = e.target.value
										field.onChange(formatPhoneNumberOnTyping(value))
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					variant={'black'}
					className="w-[315px] self-center"
					type="submit"
					disabled={createHostForm.formState.isSubmitting}
				>
					{t('common.save')}
				</Button>
			</form>
			<CropModal
				image={tempImage}
				isOpen={isDialogOpen}
				aspectRatio={imageFieldToEdit.current === 'image' ? 1 : 16 / 9}
				onOpenChange={setIsDialogOpen}
				onEditComplete={(imageFile) => {
					if (imageFieldToEdit.current === 'image') {
						createHostForm.setValue('image', imageFile)
					} else {
						const currentMedias = createHostForm.getValues('venue.medias') || []
						createHostForm.setValue('venue.medias', [
							...currentMedias,
							imageFile
						])
					}
				}}
			/>
		</Form>
	)
}

interface PlaceInfoIconProps {
	value: (typeof informationItems)[number]['value']
}

function PlaceInfoIcon({ value }: PlaceInfoIconProps) {
	const IconMap = {
		isNoSmoking: SmokeFree,
		hasSmokingBooth: SmokingRooms,
		hasParkingArea: LocalParking,
		hasWaitingArea: OtherHouses
	}

	const IconComponent = IconMap[value]

	return (
		<div className="justify-center rounded-full bg-grayscale-100 p-3">
			<IconComponent />
		</div>
	)
}
