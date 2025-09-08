import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import EventListItem from '@/components/events/EventListItem'
import { useEvents } from '@/hooks/queries/events/useEvents'
import { useHosts } from '@/hooks/queries/hosts/useHosts'
import { useHostStore } from '@/stores/hostStore'

export default function EditEventListPage() {
	const { t } = useTranslation()
	const { hostId } = useHostStore()

	const { data: hosts } = useHosts()
	const host = hosts!.find((host) => host.id === hostId)
	const { data: events } = useEvents(host!.id)

	return (
		<div className="mx-auto mt-[66px] p-5">
			<div className="text-center">
				<p className="text-title-2 font-semibold text-grayscale-900">
					{t('event.editEvent')}
				</p>
				<p className="text-heading-2 font-regular text-grayscale-500">
					{t('event.selectEventToEdit')}
				</p>
			</div>
			<ul className="mt-16 flex flex-col gap-4">
				{events?.map((event) => (
					<li key={event.id}>
						<Link to={String(event.id)}>
							<EventListItem event={event} />
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
