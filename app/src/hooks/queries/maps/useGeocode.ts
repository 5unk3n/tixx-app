import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GeocodeParams, getGeocode } from '@/apis/maps/getGeocode'

const ONE_HOUR = 1000 * 60 * 60

export const useGeocode = (props: GeocodeParams | null) => {
	const { i18n } = useTranslation()

	return useQuery({
		queryKey: ['maps', 'geocode', props],
		queryFn: () =>
			getGeocode({ query: props!.query, coordinate: props!.coordinate }),
		enabled: i18n.language !== 'ko' && !!props,
		select: (data) => {
			if (data.addresses.length === 0) {
				return null
			}

			const englishAddress = data.addresses[0].englishAddress
			const addressWithoutCountry = englishAddress
				.split(', ')
				.slice(0, -1)
				.join(', ')
			return addressWithoutCountry
		},
		staleTime: ONE_HOUR,
		gcTime: ONE_HOUR
	})
}
