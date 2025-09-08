import { useTranslation } from 'react-i18next'

import { useGeocode } from './queries/maps/useGeocode'

interface useTranslateAddressProps {
	longitude: string
	latitude: string
	address: string
	name: string
}

export const useTranslateAddress = (props: useTranslateAddressProps | null) => {
	const { i18n } = useTranslation()

	const {
		data: englishAddress,
		isPending,
		isError
	} = useGeocode(
		i18n.language !== 'ko' && props
			? {
					query: props.address,
					coordinate: `${props.longitude},${props.latitude}`
				}
			: null
	)

	if (isPending || isError) {
		return `${props?.address} ${props?.name}`
	}

	if (i18n.language !== 'ko' && englishAddress) {
		return props?.name.trim()
			? `${props.name}, ${englishAddress}`
			: englishAddress
	}

	return `${props?.address} ${props?.name}`
}
