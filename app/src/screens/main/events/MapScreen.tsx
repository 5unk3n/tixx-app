import {
	NaverMapMarkerOverlay,
	NaverMapView
} from '@mj-studio/react-native-naver-map'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'
import { PERMISSIONS, request } from 'react-native-permissions'

import activeMarker from '@/assets/images/active-marker.png'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'Map'>

export default function MapScreen({ route }: Props) {
	const { place } = route.params
	const { i18n } = useTranslation()

	useEffect(() => {
		if (Platform.OS === 'ios') {
			request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
		}
	}, [])

	return (
		<NaverMapView
			style={style.naverMap}
			initialCamera={{
				latitude: +place.latitude,
				longitude: +place.longitude,
				zoom: 16
			}}
			locale={i18n.language === 'ko' ? 'ko' : 'en'}
		>
			<NaverMapMarkerOverlay
				latitude={+place.latitude}
				longitude={+place.longitude}
				anchor={{ x: 0.5, y: 1 }}
				image={activeMarker}
			/>
		</NaverMapView>
	)
}

const style = StyleSheet.create({
	naverMap: {
		flex: 1
	}
})
