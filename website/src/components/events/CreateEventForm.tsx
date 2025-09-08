import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format, isAfter, isBefore, parse } from 'date-fns'
import { ChangeEvent, useRef, useState, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import AdminInstagramEventSelect from './AdminInstagramEventSelect'
import HashtagInput from './HashtagInput'
import RecentEventSelect from './RecentEventSelect'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { DatePicker } from '../ui/DatePicker'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import Postcode from '../ui/Postcode'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { ScrollArea } from '../ui/scroll-area'
import { Textarea } from '../ui/textarea'

import { uploadFile } from '@/apis/file/uploadFile'
import { getGeocode } from '@/apis/maps/getGeocode'
import LocalParking from '@/assets/icons/local-parking.svg?react'
import OtherHouses from '@/assets/icons/other-houses.svg?react'
import SmokeFree from '@/assets/icons/smoke-free.svg?react'
import SmokingRooms from '@/assets/icons/smoking-rooms.svg?react'
import Blog from '@/assets/images/sns-blog.png'
import Blog2 from '@/assets/images/sns-blog@2x.png'
import Blog3 from '@/assets/images/sns-blog@3x.png'
import Homepage from '@/assets/images/sns-homepage.png'
import Homepage2 from '@/assets/images/sns-homepage@2x.png'
import Homepage3 from '@/assets/images/sns-homepage@3x.png'
import Instagram from '@/assets/images/sns-instagram.png'
import Instagram2 from '@/assets/images/sns-instagram@2x.png'
import Instagram3 from '@/assets/images/sns-instagram@3x.png'
import Tiktok from '@/assets/images/sns-tiktok.png'
import Tiktok2 from '@/assets/images/sns-tiktok@2x.png'
import Tiktok3 from '@/assets/images/sns-tiktok@3x.png'
import Youtube from '@/assets/images/sns-youtube.png'
import Youtube2 from '@/assets/images/sns-youtube@2x.png'
import Youtube3 from '@/assets/images/sns-youtube@3x.png'
import CropModal from '@/components/ui/ImageCropDialog'
import { useProfile } from '@/hooks/queries/clientUser/useProfile'
import { usePaginatedEvents } from '@/hooks/queries/events/usePaginatedEvents'
import { useRequestPresignedUrl } from '@/hooks/queries/file/useRequestPresignedUrl'
import { useCreatePlace } from '@/hooks/queries/places/useCreatePlace'
import { useCaptureThumbnail } from '@/hooks/useCaptureThumbnail'
import { useDebounce } from '@/hooks/useDebounce'
import { CreateEventFormSchema } from '@/lib/schemas/events'
import { CreatePlacePayloadSchema } from '@/lib/schemas/places'
import { cn } from '@/lib/utils'
import { useHostStore } from '@/stores/hostStore'
import {
	CreateEventForm as CreateEventFormType,
	CreateEventPayload,
	CreateEventResponse,
	PaginatedEvents,
	UploadableMimeType
} from '@/types'

const SNS_LINKS = [
	'instagram',
	'tiktok',
	'blog',
	'youtube',
	'homepage'
] as const

const SNS_IMAGES: Record<string, { src: string; srcSet: string }> = {
	instagram: {
		src: Instagram,
		srcSet: `${Instagram} 1x, ${Instagram2} 2x, ${Instagram3} 3x`
	},
	tiktok: {
		src: Tiktok,
		srcSet: `${Tiktok} 1x, ${Tiktok2} 2x, ${Tiktok3} 3x`
	},
	blog: {
		src: Blog,
		srcSet: `${Blog} 1x, ${Blog2} 2x, ${Blog3} 3x`
	},
	youtube: {
		src: Youtube,
		srcSet: `${Youtube} 1x, ${Youtube2} 2x, ${Youtube3} 3x`
	},
	homepage: {
		src: Homepage,
		srcSet: `${Homepage} 1x, ${Homepage2} 2x, ${Homepage3} 3x`
	}
}

const placeInfoOptions = [
	'noSmoking',
	'smokingBooth',
	'parkingSpace',
	'waitingArea'
] as const

type PlaceInfoValue = (typeof placeInfoOptions)[number]

interface CreateEventFormProps {
	initialData?: CreateEventFormType
	onSubmit: (event: CreateEventPayload) => Promise<CreateEventResponse>
}

export default function CreateEventForm({
	initialData,
	onSubmit
}: CreateEventFormProps) {
	const navigate = useNavigate()
	const { t } = useTranslation()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)
	const [tempImage, setTempImage] = useState<File | null>(null)
	const [checkedSns, setCheckedSns] = useState<Record<string, boolean>>(
		SNS_LINKS.reduce((acc, link) => ({ ...acc, [link]: false }), {})
	)
	const [previousState, setPreviousState] =
		useState<CreateEventFormType | null>(null)

	const [venueSearchQuery, setVenueSearchQuery] = useState('')
	const [isVenueListOpen, setIsVenueListOpen] = useState(false)
	const debouncedVenueSearchQuery = useDebounce(venueSearchQuery, 500)

	const createEventForm = useForm<CreateEventFormType>({
		resolver: zodResolver(CreateEventFormSchema),
		defaultValues: initialData
	})
	const { unregister, watch } = createEventForm
	const isVideo = watch('media')?.type.startsWith('video')
	const mode = useRef<'media' | 'thumbnail'>('media')

	const { captureThumbnail, videoRef } = useCaptureThumbnail()

	const { data: profile } = useProfile()
	const { data: venues, isFetching } = usePaginatedEvents({
		isVenue: true,
		isActive: false,
		searchTerm: debouncedVenueSearchQuery
	})
	const flatListVenues = venues?.pages.flatMap((v) => v.items)

	const { mutateAsync: createPlace } = useCreatePlace()
	const { mutateAsync: requestPresignedUrl } = useRequestPresignedUrl()
	const hostId = useHostStore((host) => host.hostId)

	const fieldLabelMap = {
		media: t('event.eventImage'),
		thumbnail: t('event.thumbnailImage'),
		tags: t('event.eventType'),
		hashtag: t('event.hashtag'),
		name: t('event.eventName'),
		startDate: t('event.date'),
		endDate: t('event.date'),
		startTime: t('event.time'),
		endTime: t('event.time'),
		placeRoadAddress: t('event.location'),
		placeName: t('event.detailLocationDesc'),
		placeInfo: t('event.placeInfoLabel'),
		memo: t('event.benefits'),
		description: t('event.introduction'),
		notice: t('event.noticeLabel'),
		instagramUrl: t('event.snsLinks.instagram'),
		tiktokUrl: t('event.snsLinks.tiktok'),
		blogUrl: t('event.snsLinks.blog'),
		youtubeUrl: t('event.snsLinks.youtube'),
		homepageUrl: t('event.snsLinks.homepage')
	}

	const onError = (errors: Record<string, unknown>) => {
		const errorFields = Object.keys(errors)
			.map(
				(key) =>
					fieldLabelMap[key.split('.')[0] as keyof typeof fieldLabelMap] || key
			)
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

	const handleSubmit: SubmitHandler<CreateEventFormType> = async (data) => {
		try {
			if (!hostId) {
				throw new Error('Please select a channel first.')
			}

			const { x, y } = (await getGeocode({ query: data.placeRoadAddress }))
				.documents[0]

			const result = await CreatePlacePayloadSchema.safeParseAsync({
				name: data.placeName || ' ',
				address: data.placeRoadAddress,
				latitude: +y,
				longitude: +x
			})

			const isAfterMidnight = isBefore(
				parse(data.endTime, 'HH:mm', new Date()),
				parse(data.startTime, 'HH:mm', new Date())
			)

			const [mediaRes, thumbnailRes] = await Promise.all([
				requestPresignedUrl({
					folder: 'events',
					id: String(hostId),
					mimetype: data.media.type as UploadableMimeType
				}),
				data.thumbnail &&
					requestPresignedUrl({
						folder: 'events',
						id: String(hostId),
						mimetype: data.media.type as UploadableMimeType
					})
			])

			await Promise.all([
				uploadFile(
					mediaRes.presignedUrl,
					data.media.type as UploadableMimeType,
					data.media
				),
				thumbnailRes &&
					uploadFile(
						thumbnailRes.presignedUrl,
						data.thumbnail!.type as UploadableMimeType,
						data.thumbnail!
					)
			])

			if (result.success) {
				const place = await createPlace(result.data)

				const tags = data.tags ? [data.tags] : []
				const hashtags = data.hashtag || []
				const informations =
					data.placeInfo && data.placeInfo.length > 0
						? [
								{
									isNoSmoking: data.placeInfo.includes('noSmoking'),
									hasSmokingBooth: data.placeInfo.includes('smokingBooth'),
									hasParkingArea: data.placeInfo.includes('parkingSpace'),
									hasWaitingArea: data.placeInfo.includes('waitingArea')
								}
							]
						: undefined

				const medias = [
					{
						mediaUrl: mediaRes.mediaUrl,
						mimeType: data.media.type as UploadableMimeType,
						sortOrder: isVideo ? 1 : 0
					}
				]
				if (data.thumbnail) {
					medias.push({
						mediaUrl: thumbnailRes?.mediaUrl || '',
						mimeType: data.thumbnail?.type as UploadableMimeType,
						sortOrder: 0
					})
				}

				// 선택하지 않은 SNS는 undefined로 세팅
				const dataForSubmit: Record<string, unknown> = { ...data }
				SNS_LINKS.forEach((link) => {
					if (!checkedSns[link]) {
						dataForSubmit[link + 'Url'] = undefined
					}
				})

				const event = await onSubmit({
					description: data.description,
					startDate: format(data.startDate, 'yyyy-MM-dd'),
					endDate: format(
						addDays(data.endDate, isAfterMidnight ? 1 : 0),
						'yyyy-MM-dd'
					),
					startTime: data.startTime + ':00',
					endTime: data.endTime + ':00',
					hostId: hostId,
					name: data.name,
					placeId: place.id,
					tags,
					memo: data.memo || undefined,
					medias,
					instagramUrl: data.instagramUrl || undefined,
					tiktokUrl: data.tiktokUrl || undefined,
					blogUrl: data.blogUrl || undefined,
					youtubeUrl: data.youtubeUrl || undefined,
					homepageUrl: data.homepageUrl || undefined,
					hashtags,
					notice: data.notice,
					informations,
					isVenue: false
				})
				navigate('/events/ticket', { state: { eventId: event.id } })
			}
		} catch (error) {
			console.error(error)
			toast.error(t('common.serverError'))
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

	const onMediaChange = (
		e: ChangeEvent<HTMLInputElement>,
		onChange: (file: File) => void
	) => {
		const file = e.target.files?.[0]
		if (!file) {
			return
		}

		if (file.type.startsWith('image')) {
			mode.current = 'media'
			setIsDialogOpen(true)
			setTempImage(file)
		} else {
			onChange(file)
		}
	}

	const handlePressSnsCheckbox = (link: string) => {
		setCheckedSns((prev) => ({
			...prev,
			[link]: !prev[link]
		}))
	}

	const onChangeSelect = (event: Partial<CreateEventFormType>) => {
		Object.entries(event).forEach(([key, value]) => {
			createEventForm.setValue(key as keyof CreateEventFormType, value)
		})
	}

	const onMouseEnterSelect = (hoverEvent: Partial<CreateEventFormType>) => {
		setPreviousState(createEventForm.getValues())
		createEventForm.reset(hoverEvent)
	}

	const onMouseLeaveSelect = () => {
		if (previousState) {
			createEventForm.reset(previousState)
		}
	}

	const handleSelectVenue = (venue: PaginatedEvents['items'][number]) => {
		createEventForm.setValue('placeRoadAddress', venue.place.address, {
			shouldValidate: true
		})
		createEventForm.setValue('placeName', venue.place.name, {
			shouldValidate: true
		})
		setVenueSearchQuery(venue.name)
		setIsVenueListOpen(false)
	}

	// SNS 체크박스 상태가 바뀔 때마다 체크 해제된 SNS의 URL 필드를 unregister
	useEffect(() => {
		SNS_LINKS.forEach((link) => {
			if (!checkedSns[link]) {
				unregister(`${link}Url`)
			}
		})
	}, [checkedSns, unregister])

	useEffect(() => {
		if (!initialData) return

		const snsFields = [
			{ key: 'instagram', field: 'instagramUrl' },
			{ key: 'tiktok', field: 'tiktokUrl' },
			{ key: 'blog', field: 'blogUrl' },
			{ key: 'youtube', field: 'youtubeUrl' },
			{ key: 'homepage', field: 'homepageUrl' }
		] as const

		setCheckedSns((prev) => {
			const updated = { ...prev }
			snsFields.forEach(({ key, field }) => {
				const value = initialData[field]
				if (value) {
					updated[key] = true
					createEventForm.setValue(field, value)
				}
			})
			return updated
		})
	}, [createEventForm, initialData])

	return (
		<Form {...createEventForm}>
			<form
				onSubmit={createEventForm.handleSubmit(handleSubmit, onError)}
				noValidate
				className="mt-[54px] flex flex-col gap-2"
			>
				<FormField
					control={createEventForm.control}
					name="media"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('event.eventImage')}
							</FormLabel>
							<FormControl>
								<Input
									id="media"
									type="file"
									className="hidden"
									accept="image/jpeg,image/png,image/gif,image/webp, video/mp4, video/webm, video/mov"
									onChange={(e) => {
										onMediaChange(e, field.onChange)
										createEventForm.setValue('thumbnail', undefined)
									}}
								/>
							</FormControl>
							<div className="flex gap-5">
								<div
									className={cn(
										'aspect-[4/5] w-[275px] overflow-hidden rounded-xl bg-gray-100'
									)}
								>
									{createEventForm.getValues('media') && isVideo ? (
										<video
											ref={videoRef}
											src={
												(field.value && URL.createObjectURL(field.value)) ||
												undefined
											}
											className="h-full w-full object-cover"
											controls
											muted
										/>
									) : (
										<img
											src={
												(field.value && URL.createObjectURL(field.value)) ||
												undefined
											}
											alt=""
											className="h-full w-full object-cover"
										/>
									)}
								</div>
								<div className="mt-2 flex flex-col justify-end gap-3">
									<div className="flex w-[275px] flex-col gap-5">
										{(import.meta.env.DEV ||
											profile?.email === 'admin@tixx.im') && (
											<AdminInstagramEventSelect
												onChange={onChangeSelect}
												onMouseEnter={onMouseEnterSelect}
												onMouseLeave={onMouseLeaveSelect}
											/>
										)}
										{profile && (
											<div>
												<RecentEventSelect
													hostId={profile?.id}
													onChange={onChangeSelect}
													onMouseEnter={onMouseEnterSelect}
													onMouseLeave={onMouseLeaveSelect}
												/>
											</div>
										)}
										<Button variant="gray" className="w-full" asChild>
											<FormLabel className="cursor-pointer" htmlFor="media">
												{t('event.uploadImage')}
											</FormLabel>
										</Button>
										{/* <Button
											type="button"
											variant="grayLine"
											size={'sm'}
											className="h-8 flex-1"
											onClick={() => {
												createEventForm.resetField('media')
											}}
										>
											{t('event.reset')}
										</Button> */}
									</div>
									<div className="text-label-1 font-regular">
										<p>{t('event.imageRatioGuide')}</p>
										<p>{t('event.copyrightGuide')}</p>
									</div>
								</div>
							</div>
						</FormItem>
					)}
				/>
				{isVideo && (
					<FormField
						control={createEventForm.control}
						name="thumbnail"
						render={({ field }) => (
							<FormItem>
								<p className="p-0 text-heading-2 font-medium text-grayscale-900">
									{t('event.thumbnailImage')}
								</p>
								<FormControl>
									<Input
										id="image"
										type="file"
										className="hidden"
										accept="image/jpeg,image/png,image/gif,image/webp"
										onChange={(e) => {
											const file = e.target.files?.[0]
											if (!file) return
											mode.current = 'thumbnail'
											setTempImage(file)
											setIsDialogOpen(true)
										}}
										onClick={(e) => {
											const target = e.target as HTMLInputElement
											target.value = ''
										}}
									/>
								</FormControl>
								<div className="flex gap-5">
									<img
										src={
											(field.value &&
												URL.createObjectURL(
													createEventForm.getValues('thumbnail')!
												)) ||
											undefined
										}
										alt=""
										className={cn(
											'aspect-[4/5] w-[275px] rounded-xl bg-gray-100 object-cover'
										)}
									/>
									<div className="mt-2 flex w-[275px] flex-col gap-3 self-end">
										<Button variant="gray" asChild>
											<FormLabel className="cursor-pointer" htmlFor="image">
												{t('event.uploadImage')}
											</FormLabel>
										</Button>
										<Button
											type="button"
											variant="gray"
											onClick={async () => {
												const thumbnail = await captureThumbnail()
												if (thumbnail) {
													createEventForm.setValue('thumbnail', thumbnail)
												}
											}}
										>
											{t('event.useCurrentFrame')}
										</Button>
										<Button
											type="button"
											variant="grayLine"
											onClick={() => {
												createEventForm.resetField('thumbnail')
											}}
										>
											{t('event.reset')}
										</Button>
									</div>
								</div>
								<FormMessage className="text-status-destructive" />
							</FormItem>
						)}
					/>
				)}
				<CropModal
					image={tempImage}
					isOpen={isDialogOpen}
					aspectRatio={4 / 5}
					onOpenChange={setIsDialogOpen}
					onEditComplete={(imageFile) => {
						if (mode.current === 'thumbnail') {
							createEventForm.setValue('thumbnail', imageFile)
						} else {
							createEventForm.setValue('media', imageFile)
						}
					}}
				/>
				<FormField
					control={createEventForm.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('event.eventType')}
							</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									value={field.value}
									className="flex"
								>
									<FormItem className="flex-1">
										<FormLabel
											className={cn(
												'flex flex-1 cursor-pointer items-center rounded-lg border-2 px-4 py-3 text-label-1 font-regular',
												createEventForm.watch('tags') === 'event'
													? 'border-primary-500 text-primary-500'
													: 'border-grayscale-500 text-grayscale-500'
											)}
										>
											<FormControl>
												<RadioGroupItem value="event" />
											</FormControl>
											<span className="ml-2">{t('event.event')}</span>
										</FormLabel>
									</FormItem>
									<FormItem className="flex-1">
										<FormLabel
											className={cn(
												'flex flex-1 cursor-pointer items-center rounded-lg border-2 px-4 py-3 text-label-1 font-regular',
												createEventForm.watch('tags') === 'party'
													? 'border-primary-500 text-primary-500'
													: 'border-grayscale-500 text-grayscale-500'
											)}
										>
											<FormControl>
												<RadioGroupItem value="party" />
											</FormControl>
											<span className="ml-2">{t('event.party')}</span>
										</FormLabel>
									</FormItem>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={createEventForm.control}
					name="hashtag"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('event.hashtag')}
							</FormLabel>
							<FormDescription>{t('event.hashtagDesc')}</FormDescription>
							<FormControl>
								<HashtagInput
									value={field.value || []}
									onChange={field.onChange}
									placeholder={t('event.hashtagPlaceholder')}
									error={fieldState.invalid}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={createEventForm.control}
					name="name"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('event.eventName')}
							</FormLabel>
							<FormDescription>{t('event.eventNameDesc')}</FormDescription>
							<FormControl>
								<Input
									type="text"
									placeholder={t('event.eventNamePlaceholder')}
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
						{t('event.date')}
					</FormLabel>
					<FormDescription>{t('event.dateDesc')}</FormDescription>
					<div className="flex gap-3">
						<FormField
							control={createEventForm.control}
							name="startDate"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<DatePicker
											field={field}
											placeholder="YYYY-MM-DD"
											calendarProps={{
												disabled: (date) => {
													const today = new Date().setHours(0, 0, 0, 0)
													return (
														isBefore(date, today) ||
														isAfter(date, createEventForm.getValues('endDate'))
													)
												}
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<p className="self-center text-body-1 font-medium text-grayscale-500">
							-
						</p>
						<FormField
							control={createEventForm.control}
							name="endDate"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormControl>
										<DatePicker
											field={field}
											placeholder="YYYY-MM-DD"
											calendarProps={{
												disabled: (date) => {
													return isBefore(
														date,
														createEventForm.getValues('startDate')
													)
												}
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<FormMessage className="text-status-destructive">
						{createEventForm.formState.errors.startDate?.message ||
							createEventForm.formState.errors.endDate?.message}
					</FormMessage>
				</div>
				<div>
					<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
						{t('event.time')}
					</FormLabel>
					<FormDescription>{t('event.timeDesc')}</FormDescription>
					<div className="flex gap-3">
						<FormField
							control={createEventForm.control}
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
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<p className="self-center text-body-1 font-medium text-grayscale-500">
							-
						</p>
						<FormField
							control={createEventForm.control}
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
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<FormMessage className="text-status-destructive">
						{createEventForm.formState.errors.startTime?.message ||
							createEventForm.formState.errors.endTime?.message}
					</FormMessage>
				</div>
				<FormItem className="mb-4">
					<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
						{t('event.venueSearch')}
					</FormLabel>
					<FormDescription>{t('event.venueSearchDesc')}</FormDescription>
					<FormControl>
						<Input
							type="text"
							placeholder={t('event.venueSearchPlaceholder')}
							value={venueSearchQuery}
							onChange={(e) => {
								setIsVenueListOpen(true)
								setVenueSearchQuery(e.target.value)
							}}
						/>
					</FormControl>
					{isVenueListOpen && venueSearchQuery && (
						<ScrollArea className="mt-2 h-52 rounded-md border border-gray-200">
							{isFetching ? (
								<p className="mt-4 text-center">{t('event.venueSearching')}</p>
							) : flatListVenues?.length ? (
								flatListVenues.map((venue) => (
									<div
										key={venue.id}
										className="flex cursor-pointer items-center gap-4 p-2 hover:bg-gray-100"
										onClick={() => handleSelectVenue(venue)}
									>
										<img
											src={venue.host.imageUrl!}
											className="h-10 w-10 rounded-full"
										/>
										<div>
											<p className="font-semibold">{venue.name}</p>
											<p className="text-sm text-gray-500">
												{venue.place.address + ' ' + venue.place.name}
											</p>
										</div>
									</div>
								))
							) : (
								<p className="mt-4 text-center">
									{t('event.venueSearchNoResults')}
								</p>
							)}
						</ScrollArea>
					)}
				</FormItem>
				<FormField
					control={createEventForm.control}
					name="placeRoadAddress"
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
									createEventForm.setValue('placeRoadAddress', address)
								}}
							/>
						</FormItem>
					)}
				/>
				<FormField
					control={createEventForm.control}
					name="placeName"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormDescription>{t('event.detailLocationDesc')}</FormDescription>
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
				<FormField
					control={createEventForm.control}
					name="placeInfo"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('event.placeInfoLabel')}
							</FormLabel>
							<FormDescription>{t('event.placeInfoDesc')}</FormDescription>
							<FormControl>
								<div className="mb-4 mt-2 flex flex-row flex-wrap gap-6">
									{placeInfoOptions.map((option) => (
										<label
											key={option}
											className="flex flex-row items-center gap-4"
										>
											<Checkbox
												checked={
													Array.isArray(field.value) &&
													field.value.includes(option)
												}
												onCheckedChange={(checked) => {
													const value: PlaceInfoValue[] = Array.isArray(
														field.value
													)
														? field.value
														: []
													if (checked) {
														field.onChange([...value, option])
													} else {
														field.onChange(value.filter((v) => v !== option))
													}
												}}
											/>
											<div className="flex flex-col items-center hover:cursor-pointer">
												<PlaceInfoIcon value={option} />
												<span className="mt-2 text-body-1 font-regular">
													{t('event.placeInfo.' + option)}
												</span>
											</div>
										</label>
									))}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={createEventForm.control}
					name="memo"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('event.benefits')}
							</FormLabel>
							<FormDescription>{t('event.benefitsDesc')}</FormDescription>
							<FormControl>
								<Input
									type="text"
									placeholder={t('event.benefitsPlaceholder')}
									error={fieldState.invalid}
									{...field}
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
						{t('event.sns')}
					</FormLabel>
					<FormDescription>{t('event.snsDesc')}</FormDescription>
					<div className="mb-4 mt-2 flex flex-row flex-wrap gap-6">
						{SNS_LINKS.map((link) => {
							return (
								<label key={link} className="flex flex-row items-center gap-4">
									<Checkbox
										checked={checkedSns[link]}
										onCheckedChange={() => handlePressSnsCheckbox(link)}
									/>
									<div className="flex flex-col items-center hover:cursor-pointer">
										<img
											src={SNS_IMAGES[link].src}
											srcSet={SNS_IMAGES[link].srcSet}
											width={36}
											height={36}
											alt={link}
										/>
										<span className="mt-2 text-body-1 font-regular">
											{t('event.snsLinks.' + link)}
										</span>
									</div>
								</label>
							)
						})}
					</div>
				</div>
				{SNS_LINKS.map((link) => {
					if (!checkedSns[link]) return null
					return (
						<FormField
							key={link}
							control={createEventForm.control}
							name={`${link}Url`}
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<Input
											type="text"
											placeholder={t('event.snsLinksPlaceholder', {
												platform: t('event.snsLinks.' + link)
											})}
											error={fieldState.invalid}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)
				})}
				<FormField
					control={createEventForm.control}
					name="description"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('event.introduction')}
							</FormLabel>
							<FormDescription>{t('event.introductionDesc')}</FormDescription>
							<FormControl>
								<Textarea
									placeholder={t('event.introductionPlaceholder')}
									className="h-[183px] resize-none"
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={createEventForm.control}
					name="notice"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormLabel className="p-0 text-heading-2 font-medium text-grayscale-900">
								{t('event.noticeLabel')}
							</FormLabel>
							<FormDescription>{t('event.noticeDesc')}</FormDescription>
							<FormControl>
								<Textarea
									placeholder={t('event.noticePlaceholder')}
									className="h-[183px] resize-none"
									error={fieldState.invalid}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="mx-auto mt-11 flex gap-3">
					<Button type="button" variant="gray" className="w-[216px] px-4">
						{t('event.temporarySave')}
					</Button>
					<Button
						type="submit"
						variant="black"
						className="w-[216px] px-4"
						disabled={createEventForm.formState.isSubmitting}
					>
						{t('event.register')}
					</Button>
				</div>
			</form>
		</Form>
	)
}

interface PlaceInfoIconProps {
	value: PlaceInfoValue
}

function PlaceInfoIcon({ value }: PlaceInfoIconProps) {
	const IconMap = {
		noSmoking: SmokeFree,
		smokingBooth: SmokingRooms,
		parkingSpace: LocalParking,
		waitingArea: OtherHouses
	} as const

	const IconComponent = IconMap[value]

	return (
		<div className="justify-center rounded-full bg-grayscale-100 p-3">
			<IconComponent />
		</div>
	)
}
