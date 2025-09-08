import React from 'react'
import { StyleSheet } from 'react-native'
import { IconButton, IconButtonProps } from 'react-native-paper'

import CustomIcon, { IconName } from '../display/CustomIcon'

interface CustomIconButtonProps extends Omit<IconButtonProps, 'icon'> {
	name: IconName
	buttonSize?: number
}

const createIconComponent = (iconName: IconName) => (iconProps: any) => (
	<CustomIcon name={iconName} {...iconProps} />
)

export default function CustomIconButton({
	name,
	size = 26,
	buttonSize,
	...props
}: CustomIconButtonProps) {
	const buttonSizeStyle = buttonSize
		? [
				styles.base,
				{
					width: buttonSize,
					height: buttonSize,
					borderRadius: buttonSize * 1.5
				}
			]
		: styles.base

	return (
		<IconButton
			{...props}
			size={size}
			icon={createIconComponent(name)}
			style={[buttonSizeStyle, props.style]}
		/>
	)
}

const styles = StyleSheet.create({
	base: {
		// keeping a base style object for consistency
	}
})
