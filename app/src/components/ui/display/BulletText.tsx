import React from 'react'
import { View } from 'react-native'
import { TextProps } from 'react-native-paper'

import { typography } from '@/theme/fonts'

import { CustomText } from './CustomText'

interface BulletTextProps extends TextProps<keyof typeof typography> {}

export default function BulletText({ children, ...props }: BulletTextProps) {
	return (
		<View className="flex-row">
			<CustomText {...props}> • </CustomText>
			<CustomText className="flex-1" {...props}>
				{children}
			</CustomText>
		</View>
	)
}
