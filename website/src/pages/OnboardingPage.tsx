import { useTranslation } from 'react-i18next'

import CreateHostForm from '@/components/hosts/CreateHostForm'
import { useCreateEvent } from '@/hooks/queries/events/useCreateEvent'
import { useCreateHost } from '@/hooks/queries/hosts/useCreateHost'
import { useHostStore } from '@/stores/hostStore'

export default function Onboarding() {
	const { t } = useTranslation()
	const { setHostId } = useHostStore()

	const { mutateAsync: createHost } = useCreateHost()
	const { mutateAsync: createEvent } = useCreateEvent()

	return (
		<div className="w-[390px] p-5">
			<h1 className="text-title-2 font-semibold text-grayscale-900">
				{t('onboarding.welcome')}
			</h1>
			<p className="mt-2 text-heading-2 font-regular text-grayscale-500">
				{t('onboarding.description')}
			</p>
			<CreateHostForm
				mode="create"
				onSubmitHost={createHost}
				onSubmitEvent={createEvent}
				onSuccessSubmitHost={(host) => {
					setHostId(host.id)
				}}
			/>
		</div>
	)
}
