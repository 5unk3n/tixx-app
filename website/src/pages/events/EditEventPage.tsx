import { parseISO, subDays, format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import CreateEventForm from '@/components/events/CreateEventForm'
import { useEvent } from '@/hooks/queries/events/useEvent'
import { useUpdateEvent } from '@/hooks/queries/events/useUpdateEvent'
import { CreateEventForm as CreateEventFormType } from '@/types'
import { fetchFileAsBlob } from '@/utils/fetchFileAsBlob'

export default function EditEventPage() {
	const { t } = useTranslation()
	const { id } = useParams()

	const { data: event, isPending, isError } = useEvent(id || '')
	const { mutateAsync: updateEvent } = useUpdateEvent()

	const [formEvent, setFormEvent] = useState<CreateEventFormType | undefined>(
		undefined
	)

	useEffect(() => {
		if (!event) return

		const setFormData = async () => {
			const startDateTimeUTC = parseISO(
				`${event.startDate}T${event.startTime}Z`
			)
			const endDateTimeUTC = parseISO(`${event.endDate}T${event.endTime}Z`)
			const isAfterMidnightEvent =
				startDateTimeUTC.getHours() * 60 + startDateTimeUTC.getMinutes() >
				endDateTimeUTC.getHours() * 60 + endDateTimeUTC.getMinutes()
			const displayEndDateTimeUTC = isAfterMidnightEvent
				? subDays(endDateTimeUTC, 1)
				: endDateTimeUTC

			const mainMedia = event.eventMedias[1]
				? event.eventMedias.find((m) => m.sortOrder === 1)
				: event.eventMedias.find((m) => m.sortOrder === 0)
			const thumbnailMedia =
				event.eventMedias[1] && event.eventMedias.find((m) => m.sortOrder === 0)

			const [media, thumbnail] = await Promise.all([
				fetchFileAsBlob(mainMedia!.mediaUrl, mainMedia!.mimeType, 'media'),
				thumbnailMedia &&
					fetchFileAsBlob(
						thumbnailMedia.mediaUrl,
						thumbnailMedia.mimeType,
						'thumbnail'
					)
			])

			const infoKeyMap = {
				isNoSmoking: 'noSmoking',
				hasSmokingBooth: 'smokingBooth',
				hasParkingArea: 'parkingSpace',
				hasWaitingArea: 'waitingArea'
			} as const

			const placeInfo =
				event.informations && event.informations.length > 0
					? (
							Object.entries(event.informations[0]) as [
								keyof typeof infoKeyMap,
								boolean
							][]
						)
							.filter(([key, value]) => (key as string) !== 'id' && value)
							.map(([key]) => infoKeyMap[key])
					: []

			setFormEvent({
				name: event.name,
				description: event.description,
				startDate: startDateTimeUTC,
				endDate: displayEndDateTimeUTC,
				startTime: format(startDateTimeUTC, 'HH:mm'),
				endTime: format(displayEndDateTimeUTC, 'HH:mm'),
				placeName: event.place.name,
				placeRoadAddress: event.place.address,
				tags: event.tags[0]?.tag ?? '',
				memo: event.memo || '',
				media: media!,
				thumbnail: thumbnail,
				placeInfo: placeInfo,
				hashtag: event.eventHashtags.map((hashtag) =>
					hashtag.hashtag ? hashtag.hashtag.key : hashtag.tag
				),
				blogUrl: event.blogUrl || undefined,
				homepageUrl: event.homepageUrl || undefined,
				instagramUrl: event.instagramUrl || undefined,
				tiktokUrl: event.tiktokUrl || undefined,
				youtubeUrl: event.youtubeUrl || undefined,
				notice: event.notice || ''
			})
		}

		setFormData()
	}, [event])

	if (isPending || isError || !formEvent) {
		return null
	}

	return (
		<div className="mx-auto mt-[66px] max-w-[700px] p-5">
			<div className="text-center">
				<p className="text-title-2 font-semibold text-grayscale-900">
					{t('event.editEvent')}
				</p>
				<p className="text-heading-2 font-regular text-grayscale-500">
					{t('event.editEventDesc')}
				</p>
			</div>
			<CreateEventForm
				initialData={formEvent}
				onSubmit={(event) => updateEvent({ eventId: id!, payload: event })}
			/>
		</div>
	)
}
