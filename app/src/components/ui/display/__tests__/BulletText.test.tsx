import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { StyleSheet } from 'react-native'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import BulletText from '../BulletText'

describe('BulletText', () => {
	it('renders children with a bullet point', () => {
		render(<BulletText>Hello World</BulletText>, { wrapper: TestWrapper })

		const bullet = screen.getByText('•')
		const text = screen.getByText('Hello World')

		expect(bullet).toBeTruthy()
		expect(text).toBeTruthy()
	})

	it('passes style props to the underlying CustomText components', () => {
		render(<BulletText style={{ color: 'red' }}>Styled Text</BulletText>, {
			wrapper: TestWrapper
		})

		const bullet = screen.getByText('•')
		const text = screen.getByText('Styled Text')

		const bulletStyle = StyleSheet.flatten(bullet.props.style)
		const textStyle = StyleSheet.flatten(text.props.style)

		expect(bulletStyle).toHaveProperty('color', 'red')
		expect(textStyle).toHaveProperty('color', 'red')
	})
})
