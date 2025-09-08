import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import HashtagList from '../HashtagList'

describe('HashtagList', () => {
	it('renders hashtags and handles press', () => {
		const onPress = jest.fn()
		const hashtags = ['react', 'native']
		render(<HashtagList hashtags={hashtags} onPress={onPress} />, {
			wrapper: TestWrapper
		})

		const reactHashtag = screen.getByText('#react')
		expect(reactHashtag).toBeTruthy()
		fireEvent.press(reactHashtag)
		expect(onPress).toHaveBeenCalledWith('react')
	})
})
