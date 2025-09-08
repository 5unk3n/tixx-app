import { useTranslation } from 'react-i18next'

import { Button } from '../ui/button'

import Heart from '@/assets/icons/heart.svg?react'
import Share from '@/assets/icons/share.svg?react'
import EventInfo from '@/components/events/EventInfo'
import { Event } from '@/types'

interface TicketCardProps {
	event: Event
}

export default function TicketCard({ event }: TicketCardProps) {
	const { t } = useTranslation()

	const handleShare = () => {
		if (navigator.share) {
			navigator
				.share({
					title: event.name,
					text: event.description || ''
					// TODO: 딥링크 url 추가
					// url: ''
				})
				.catch(() => {})
		} else {
			alert(t('event.shareNotSupported'))
		}
	}

	return (
		<div className="flex w-full flex-wrap items-center gap-[60px] rounded-xl p-7 shadow-[4px_4px_48px_rgb(0,0,0,0.12)]">
			<div className="grow basis-52">
				<img
					src={event.imageUrl}
					className="aspect-[4/5] rounded-xl object-cover"
					alt={t('event.eventImage')}
				/>
			</div>
			<div className="grow basis-52">
				<EventInfo event={event} isExtend />
				<div className="mt-12 flex w-full gap-4">
					<Button
						variant={'black'}
						className="max-w-[216px] flex-1"
						onClick={handleShare}
					>
						<Share />
						{t('event.share')}
					</Button>
					<Button variant={'black'} className="max-w-[216px] flex-1">
						<Heart />
						{`${event.wishCount} ${t('event.interest')}`}
					</Button>
				</div>
			</div>
		</div>
	)
}
