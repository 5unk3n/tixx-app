import {
	NaverMapMarkerOverlay,
	NaverMapView
} from '@mj-studio/react-native-naver-map'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { PERMISSIONS, request } from 'react-native-permissions'

import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'Map'>

export default function MapScreen({ route }: Props) {
	const place = route.params

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
		>
			<NaverMapMarkerOverlay
				latitude={+place.latitude}
				longitude={+place.longitude}
				anchor={{ x: 0.5, y: 1 }}
				image={require('@/assets/icons/marker.png')}
				width={36}
				height={44}
			/>
		</NaverMapView>
	)
}

const style = StyleSheet.create({
	naverMap: {
		flex: 1
	}
})
