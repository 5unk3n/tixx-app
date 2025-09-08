import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView
} from '@gorhom/bottom-sheet'
import { styled } from 'nativewind'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Keyboard, StyleSheet, ViewStyle } from 'react-native'

import { useCustomTheme } from '@/hooks/useCustomTheme'

interface CustomBottomSheetProps {
	snapPoints?: (string | number)[]
	children: React.ReactNode
	onChange?: (index: number) => void
	onDismiss?: () => void
	onBackDropPress?: () => void
	isDraggable?: boolean
	enablePanDownToClose?: boolean
	style?: ViewStyle
	backgroundStyle?: ViewStyle
}

export interface BottomSheetRef {
	present: () => void
	dismiss: () => void
}

const CustomBottomSheet = forwardRef<BottomSheetRef, CustomBottomSheetProps>(
	(
		{
			snapPoints = ['25%', '50%'],
			onChange,
			onBackDropPress,
			children,
			onDismiss,
			isDraggable = true,
			enablePanDownToClose = true,
			style,
			backgroundStyle
		},
		ref
	) => {
		const bottomSheetModalRef = useRef<BottomSheetModal>(null)
		const { colors } = useCustomTheme()

		useImperativeHandle(ref, () => ({
			present: () => {
				Keyboard.dismiss()
				bottomSheetModalRef.current?.present()
			},
			dismiss: () => {
				bottomSheetModalRef.current?.dismiss()
			}
		}))

		const renderBackdrop = (props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				onPress={onBackDropPress}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
			/>
		)

		return (
			<BottomSheetModal
				ref={bottomSheetModalRef}
				onChange={onChange}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				enablePanDownToClose={enablePanDownToClose}
				enableHandlePanningGesture={isDraggable ? true : false}
				enableContentPanningGesture={isDraggable ? true : false}
				handleComponent={isDraggable ? undefined : null}
				handleIndicatorStyle={[
					{
						backgroundColor: colors.grayscale[200]
					},
					styles.handleIndicator
				]}
				onDismiss={onDismiss}
				backgroundStyle={[
					{ backgroundColor: colors.background },
					backgroundStyle
				]}
			>
				<BottomSheetView style={style}>{children}</BottomSheetView>
			</BottomSheetModal>
		)
	}
)

const styles = StyleSheet.create({
	handleIndicator: {
		width: 40
	}
})

export default styled(CustomBottomSheet)
