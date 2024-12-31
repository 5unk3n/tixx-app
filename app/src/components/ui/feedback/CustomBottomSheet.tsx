import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
	BottomSheetView
} from '@gorhom/bottom-sheet'
import { styled } from 'nativewind'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { Keyboard, ViewStyle } from 'react-native'

import { useCustomTheme } from '@/hooks/useCustomTheme'

interface CustomBottomSheetProps {
	snapPoints?: (string | number)[]
	children: React.ReactNode
	onChange?: (index: number) => void
	onDismiss?: () => void
	onBackDropPress?: () => void
	isDraggable?: boolean
	style?: ViewStyle
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
			style
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
				enablePanDownToClose={isDraggable ? true : false}
				enableHandlePanningGesture={isDraggable ? true : false}
				enableContentPanningGesture={isDraggable ? true : false}
				handleComponent={isDraggable ? undefined : null}
				handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
				onDismiss={onDismiss}
				backgroundStyle={{ backgroundColor: colors.surfaceVariant }}
			>
				<BottomSheetView style={style}>{children}</BottomSheetView>
			</BottomSheetModal>
		)
	}
)

export default styled(CustomBottomSheet)
