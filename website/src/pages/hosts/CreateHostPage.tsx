import { useTranslation } from 'react-i18next'

import CreateHostForm from '@/components/hosts/CreateHostForm'
import { useCreateEvent } from '@/hooks/queries/events/useCreateEvent'
import { useCreateHost } from '@/hooks/queries/hosts/useCreateHost'

export default function CreateHostPage() {
	const { t } = useTranslation()

	const { mutateAsync: createHost } = useCreateHost()
	const { mutateAsync: createEvent } = useCreateEvent()

	return (
		<div className="mx-auto mt-[66px] max-w-[700px] p-5">
			<h1 className="text-title-2 font-semibold text-grayscale-900">
				{t('host.createHost')}
			</h1>
			<CreateHostForm
				mode="create"
				onSubmitHost={createHost}
				onSubmitEvent={createEvent}
			/>
		</div>
	)
}
