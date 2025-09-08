import React from 'react'
import { View } from 'react-native'

import { CustomText } from '../ui/display/CustomText'

export default function BusinessInfo() {
	return (
		<View>
			<CustomText
				variant="caption1RegularLarge"
				className="mb-2 text-grayscale-400 text-center"
			>
				TiXX 사업자 정보
			</CustomText>
			<View>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-400"
				>
					상호: 아비치
				</CustomText>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-400"
				>
					대표: 김휘진
				</CustomText>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-400"
				>
					주소: 서울특별시 성동구 한림말길 35, B101호(옥수동, 상아빌라)
				</CustomText>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-400"
				>
					사업자 등록번호: 115-40-01461
				</CustomText>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-400"
				>
					대표번호: 050-6551-9787
				</CustomText>
			</View>
		</View>
	)
}
