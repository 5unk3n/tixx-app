import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import SearchInput from '../SearchInput'

jest.mock('../../display/CustomIcon', () => {
	const { View } = require('react-native')
	return ({ name, ...props }: any) => <View testID={name} {...props} />
})

describe('SearchInput', () => {
	it('placeholder i18n 렌더 및 clear/search 동작', () => {
		const onSearch = jest.fn()
		const setSearchQuery = jest.fn()
		render(
			<SearchInput
				onSearch={onSearch}
				searchQuery="abc"
				setSearchQuery={setSearchQuery}
			/>,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByPlaceholderText('search.placeholder')).toBeTruthy()
		fireEvent.press(screen.getByTestId('close'))
		expect(setSearchQuery).toHaveBeenCalledWith('')
		fireEvent.press(screen.getByTestId('search'))
		expect(onSearch).toHaveBeenCalled()
	})

	it('입력/제출 이벤트 핸들링', () => {
		const onSearch = jest.fn()
		const setSearchQuery = jest.fn()
		render(
			<SearchInput
				onSearch={onSearch}
				searchQuery=""
				setSearchQuery={setSearchQuery}
			/>,
			{ wrapper: TestWrapper }
		)
		const input = screen.getByPlaceholderText('search.placeholder')
		fireEvent.changeText(input, 'hello')
		expect(setSearchQuery).toHaveBeenCalledWith('hello')
		fireEvent(input, 'submitEditing')
		expect(onSearch).toHaveBeenCalled()
	})
})
