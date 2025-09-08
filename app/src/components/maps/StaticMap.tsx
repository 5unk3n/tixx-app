import { NCP_CLIENT_ID, NCP_CLIENT_SECRET } from '@env'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Image, useWindowDimensions } from 'react-native'

import { getStaticMapUrl, StaticMapParams } from '@/apis/maps/getStaticMapUrl'
import activeMarker from '@/assets/images/active-marker.png'

interface StaticMapProps {
	longitude: string
	latitude: string
	width?: number
	height?: number
}

export default function StaticMap({
	longitude,
	latitude,
	width,
	height
}: StaticMapProps) {
	const { i18n } = useTranslation()
	const { width: screenWidth } = useWindowDimensions()
	const mapWidth = width || screenWidth - 16 * 2
	const mapHeight = height || 160

	const mapParams = {
		center: `${longitude} ${latitude}`,
		w: Math.floor(mapWidth).toString(),
		h: Math.floor(mapHeight).toString(),
		lang: i18n.language
	} satisfies StaticMapParams

	return (
		<>
			<Image
				width={mapWidth}
				height={mapHeight}
				source={{
					uri: getStaticMapUrl(mapParams),
					headers: {
						'x-ncp-apigw-api-key-id': NCP_CLIENT_ID,
						'x-ncp-apigw-api-key': NCP_CLIENT_SECRET
					}
				}}
			/>
			{/* HACK: 마커를 포함한 이미지는 외부에서 접속가능한 마커의 url이 필요해 임시로 절대 위치로 표시함*/}
			<Image
				source={activeMarker}
				className="absolute top-1/2 left-1/2 transform -translate-x-4 -translate-y-8"
			/>
		</>
	)
}
