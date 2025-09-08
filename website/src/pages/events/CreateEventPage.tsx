import { useTranslation } from 'react-i18next'

import CreateEventForm from '@/components/events/CreateEventForm'
import { useCreateEvent } from '@/hooks/queries/events/useCreateEvent'

export default function CreateEventPage() {
	const { t } = useTranslation()

	const { mutateAsync: createEvent } = useCreateEvent()

	return (
		<div className="mx-auto mt-[66px] max-w-[700px] p-5">
			<div className="text-center">
				<p className="text-title-2 font-semibold text-grayscale-900">
					{t('event.createEvent')}
				</p>
				<p className="text-heading-2 font-regular text-grayscale-500">
					{t('event.createEventDesc')}
				</p>
			</div>
			<CreateEventForm onSubmit={createEvent} />
		</div>
	)
}
