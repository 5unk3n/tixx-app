import React from 'react'
import { View, Keyboard, ViewProps, StyleSheet } from 'react-native'

const DismissKeyboardView = ({ children, ...props }: ViewProps) => {
	return (
		<View
			style={styles.container}
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

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})
