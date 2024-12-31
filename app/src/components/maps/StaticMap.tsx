import { NCP_CLIENT_ID, NCP_CLIENT_SECRET } from '@env'
import React from 'react'
import { Image, useWindowDimensions } from 'react-native'

import { getStaticMapUrl } from '@/apis/maps/getStaticMapUrl'

import CustomIcon from '../ui/display/CustomIcon'

interface StaticMapParams {
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
}: StaticMapParams) {
	const { width: screenWidth } = useWindowDimensions()
	const mapWidth = width || screenWidth - 20 * 2
	const mapHeight = height || 160

	const mapParams = {
		center: `${longitude} ${latitude}`,
		w: mapWidth.toString(),
		h: mapHeight.toString()
	}

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
			<CustomIcon
				name="marker"
				width={32}
				height={32}
				className="absolute top-1/2 left-1/2 transform -translate-x-4 -translate-y-8"
			/>
		</>
	)
}
