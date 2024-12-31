import React from 'react'
import { View, Keyboard, ViewProps } from 'react-native'

const DismissKeyboardView = ({ children, ...props }: ViewProps) => {
	return (
		<View
			style={{ flex: 1 }}
			{...props}
			onStartShouldSetResponder={() => {
				Keyboard.dismiss()
				return false
			}}
		>
			{children}
		</View>
	)
}

export default DismissKeyboardView
