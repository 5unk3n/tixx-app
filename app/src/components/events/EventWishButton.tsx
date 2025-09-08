import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

import { useToggleWish } from '@/hooks/queries/events/useToggleWish'
import { useCustomTheme } from '@/hooks/useCustomTheme'

import CustomIcon from '../ui/display/CustomIcon'

interface EventWishButtonProps extends SvgProps {
	eventId: number
	isWished: boolean
	size?: number
}

export default function EventWishButton({
	eventId,
	isWished,
	size = 26,
	...props
}: EventWishButtonProps) {
	const { mutate: toggleWish } = useToggleWish()
	const { colors } = useCustomTheme()

	return (
		<TouchableWithoutFeedback onPress={() => toggleWish(eventId)}>
			<View>
				<CustomIcon
					name={isWished ? 'heartFill' : 'heartLine'}
					color={isWished ? colors.primary : colors.grayscale[0]}
					size={size}
					{...props}
				/>
			</View>
		</TouchableWithoutFeedback>
	)
}
