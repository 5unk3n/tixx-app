import { format, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'

import CreateHostForm from '@/components/hosts/CreateHostForm'
import { useUpdateEvent } from '@/hooks/queries/events/useUpdateEvent'
import { useHosts } from '@/hooks/queries/hosts/useHosts'
import { useUpdateHost } from '@/hooks/queries/hosts/useUpdateHost'
import { CreateHostForm as CreateHostFormType } from '@/types'
import { fetchFileAsBlob } from '@/utils/fetchFileAsBlob'
import { formatPhone } from '@/utils/formatters'

export default function UpdateHostPage() {
	const { id } = useParams()
	const { t } = useTranslation()
	const [formHost, setFormHost] = useState<CreateHostFormType | undefined>(
		undefined
	)

	const { data: hosts, isPending, isError } = useHosts()
	const { mutateAsync: updateHost } = useUpdateHost()
	const { mutateAsync: updateEvent } = useUpdateEvent()

	const host = hosts?.find((host) => host.id === Number(id))

	useEffect(() => {
		if (!host) return

		const setFormData = async () => {
			let imageFile = null
			if (host.imageUrl) {
				imageFile = await fetchFileAsBlob(
					host.imageUrl,
					'image/png',
					'imageUrl'
				)
			}

			const venueEvent = host.events[0]
			const venueFormData: CreateHostFormType['venue'] = {}

			if (venueEvent) {
				const startDateTimeUTC = venueEvent.startTime
					? parseISO(
							`${format(new Date(), 'yyyy-MM-dd')}T${venueEvent.startTime}Z`
						)
					: null
				const endDateTimeUTC = venueEvent.endTime
					? parseISO(
							`${format(new Date(), 'yyyy-MM-dd')}T${venueEvent.endTime}Z`
						)
					: null

				const fetchedMedias = await Promise.all(
					venueEvent.eventMedias.map((media) =>
						fetchFileAsBlob(media.mediaUrl, media.mimeType, 'media')
					)
				)

				const medias = fetchedMedias.filter((file) => file !== undefined)

				venueFormData.placeRoadAddress = venueEvent.place.address
				venueFormData.placeName = venueEvent.place.name
				venueFormData.startTime = startDateTimeUTC
					? format(startDateTimeUTC, 'HH:mm')
					: undefined
				venueFormData.endTime = endDateTimeUTC
					? format(endDateTimeUTC, 'HH:mm')
					: undefined
				venueFormData.medias = medias
				venueFormData.hashtag = venueEvent.hashtags
					.map((hashtag) => `#${hashtag.tag}`)
					.join(' ')
				venueFormData.informations = venueEvent.informations[0]
				venueFormData.instagramUrl = venueEvent.instagramUrl || undefined
				venueFormData.tiktokUrl = venueEvent.tiktokUrl || undefined
				venueFormData.blogUrl = venueEvent.blogUrl || undefined
				venueFormData.youtubeUrl = venueEvent.youtubeUrl || undefined
				venueFormData.homepageUrl = venueEvent.homepageUrl || undefined
			}

			setFormHost({
				name: host.name,
				image: imageFile!,
				category: host.category,
				description: host.description || '',
				contactName: host.contactName || '',
				contactPhone: host.contactPhone ? formatPhone(host.contactPhone) : '',
				venue: venueFormData
			})
		}

		setFormData()
	}, [host])

	if (isPending || isError || !formHost) {
		return null
	}

	return (
		<div className="mx-auto mt-[66px] max-w-[700px] p-5">
			<h1 className="text-title-2 font-semibold text-grayscale-900">
				{t('host.updateHost')}
			</h1>
			<CreateHostForm
				mode="update"
				initialData={formHost}
				onSubmitHost={(payload) =>
					updateHost({ ...payload, hostId: Number(host?.id) })
				}
				onSubmitEvent={(payload) =>
					updateEvent({ eventId: String(host!.events[0].id), payload })
				}
			/>
		</div>
	)
}
