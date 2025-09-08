import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import EventBadges from './EventBadges'
import EventInfo from './EventInfo'
import { Button } from '../ui/button'

import QrCode from '@/assets/icons/qrcode.svg?react'
import Users from '@/assets/icons/users.svg?react'
import { Events } from '@/types'

interface EventListItemProps {
	event: Events[0]
}

export default function EventListItem({ event }: EventListItemProps) {
	const { t } = useTranslation()

	return (
		<div className="md: flex flex-col items-center rounded-2xl border border-grayscale-100 px-3 py-5 md:flex-row md:px-6 md:py-5">
			<img
				src={event.imageUrl}
				alt=""
				className="aspect-[4/5] h-[128px] rounded-lg object-cover md:h-[214px]"
			/>
			<div className="ml-5 flex flex-1 flex-col justify-between self-stretch py-4">
				<div>
					<EventBadges event={event} />
					<p className="mt-2 text-body-1 font-semibold md:text-title-3">
						{event.name}
					</p>
				</div>
				<EventInfo event={event} />
			</div>
			<div className="flex w-[216px] gap-3 py-3 md:flex-col">
				<Button variant={'grayLine'} className="border-2" asChild>
					<Link to={'/scan'} state={event}>
						<QrCode className="text-black" />
						{t('event.qrScan')}
					</Link>
				</Button>
				<Button variant={'gray'} asChild>
					<Link to={`/events/${event.id}/invitation`}>
						<Users className="text-black" />
						{t('event.participantList')}
					</Link>
				</Button>
			</div>
		</div>
	)
}
