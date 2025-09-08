import { useTranslation } from 'react-i18next'

import Insight from '../tickets/Insight'
import TicketCard from '../tickets/TicketCard'

import LocalParking from '@/assets/icons/local-parking.svg?react'
import OtherHouses from '@/assets/icons/other-houses.svg?react'
import SmokeFree from '@/assets/icons/smoke-free.svg?react'
import SmokingRooms from '@/assets/icons/smoking-rooms.svg?react'
import { Event, TicketDetail } from '@/types'

const placeInfoMap = {
	noSmoking: 'isNoSmoking',
	smokingBooth: 'hasSmokingBooth',
	parkingSpace: 'hasParkingArea',
	waitingArea: 'hasWaitingArea'
} as const

type PlaceInfoValue = keyof typeof placeInfoMap

interface EventDetailSectionProps {
	event: Event
	ticketDetails: TicketDetail[]
}

export default function EventDetailSection({
	event,
	ticketDetails
}: EventDetailSectionProps) {
	const { t } = useTranslation()

	const activeInfoOptions = Object.entries(placeInfoMap).reduce<
		PlaceInfoValue[]
	>((acc, [key, value]) => {
		if (event.informations?.[0]?.[value]) {
			acc.push(key as PlaceInfoValue)
		}
		return acc
	}, [])

	return (
		<section>
			<section className="mx-auto w-full max-w-[794px] px-5 pt-8">
				<TicketCard event={event!} />
			</section>
			<section className="my-12">
				<div className="mx-auto flex w-full max-w-[794px] gap-20 px-5 pt-12">
					<h3 className="mb-7 shrink-0 text-title-3 font-semibold">
						{t('event.placeInfoTitle')}
					</h3>
					<div className="flex grow gap-6">
						{activeInfoOptions.map((option) => (
							<div key={option} className="flex flex-col items-center">
								<PlaceInfoIcon value={option} />
								<span className="mt-2 text-body-1 font-regular">
									{t('event.placeInfo.' + option)}
								</span>
							</div>
						))}
					</div>
				</div>
				<div className="mx-auto flex w-full max-w-[794px] gap-20 px-5 pt-12">
					<h3 className="mb-7 shrink-0 text-title-3 font-semibold">
						{t('event.eventNotice')}
					</h3>
					<p className="text-grayscale-900">{event.description}</p>
				</div>
				<div className="mx-auto flex w-full max-w-[794px] gap-20 px-5 pt-12">
					<h3 className="mb-7 shrink-0 text-title-3 font-semibold">
						{t('event.notice')}
					</h3>
					<div>
						{event.notice && (
							<p className="mb-16 text-grayscale-900">{event.notice}</p>
						)}
						{ticketDetails.length ? (
							<Insight ticketDetails={ticketDetails as TicketDetail[]} />
						) : (
							<div className="my-8 text-center text-heading-1 font-medium text-gray-600">
								{t('event.noTickets')}
							</div>
						)}
					</div>
				</div>
			</section>
		</section>
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
