import React from 'react'
import { IconButton, IconButtonProps } from 'react-native-paper'

import CustomIcon, { IconName } from '../display/CustomIcon'

interface CustomIconButtonProps extends Omit<IconButtonProps, 'icon'> {
	name: IconName
	buttonSize?: number
}

export default function CustomIconButton({
	name,
	size = 26,
	buttonSize,
	...props
}: CustomIconButtonProps) {
	const buttonSizeStyle = buttonSize
		? { width: buttonSize, height: buttonSize, borderRadius: buttonSize * 1.5 }
		: {}

	return (
		<IconButton
			{...props}
			size={size}
			icon={(iconProps) => <CustomIcon name={name} {...iconProps} />}
			style={[buttonSizeStyle, props.style]}
		/>
	)
}
