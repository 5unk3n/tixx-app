import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { render } from '@testing-library/react-native'
import React, { createRef } from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomBottomSheet, { BottomSheetRef } from '../CustomBottomSheet'

// Mock functions are defined outside to be accessible in tests
const mockPresent = jest.fn()
const mockDismiss = jest.fn()

jest.mock('@gorhom/bottom-sheet', () => {
	const React = require('react')
	const { View } = require('react-native') as typeof import('react-native')

	// Mock BottomSheetModal with a forwardRef component
	const BottomSheetModal = React.forwardRef((props: any, ref: any) => {
		// Expose the mock functions via the ref
		React.useImperativeHandle(ref, () => ({
			present: mockPresent,
			dismiss: mockDismiss
		}))
		return <View>{props.children}</View>
	})

	return {
		__esModule: true, // Handle ES module interop
		BottomSheetModal,
		BottomSheetView: (props: any) => <View {...props} />,
		BottomSheetBackdrop: (props: any) => <View {...props} />
	}
})

describe('CustomBottomSheet', () => {
	beforeEach(() => {
		// Clear mock history before each test
		mockPresent.mockClear()
		mockDismiss.mockClear()
	})

	it('should expose present and dismiss methods via ref and call them', () => {
		const ref = createRef<BottomSheetRef>()
		render(<CustomBottomSheet ref={ref}>내용</CustomBottomSheet>, {
			wrapper: TestWrapper
		})

		// Check if the ref is correctly attached
		expect(ref.current).toBeTruthy()

		// Call present and verify the mock was called
		ref.current?.present()
		expect(mockPresent).toHaveBeenCalledTimes(1)

		// Call dismiss and verify the mock was called
		ref.current?.dismiss()
		expect(mockDismiss).toHaveBeenCalledTimes(1)
	})
})
