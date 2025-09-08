import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import CustomIcon from '../CustomIcon'

describe('CustomIcon', () => {
	it('uses the default size if not provided', () => {
		render(<CustomIcon name="close" testID="close" />)
		const icon = screen.getByTestId('close')
		expect(icon.props.height).toBe(26)
		expect(icon.props.width).toBe(26)
	})

	it('passes size, color, and other props to the SVG component', () => {
		render(
			<CustomIcon
				name="close"
				size={50}
				color="red"
				style={{ opacity: 0.5 }}
				testID="close"
			/>
		)
		const icon = screen.getByTestId('close')
		expect(icon.props.height).toBe(50)
		expect(icon.props.width).toBe(50)
		expect(icon.props.color).toBe('red')
		expect(icon.props.style).toEqual({ opacity: 0.5 })
	})
})
