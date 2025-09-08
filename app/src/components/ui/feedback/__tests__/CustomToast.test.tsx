import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomToast from '../CustomToast'

jest.mock('../../display/CustomIcon', () => {
	const { View } = require('react-native')
	return ({ name, ...props }: any) => (
		<View testID={`icon-${name}`} {...props} />
	)
})

describe('CustomToast', () => {
	it('아이콘과 텍스트 스타일을 적용해 렌더', () => {
		render(<CustomToast icon="success" text1="완료" />, {
			wrapper: TestWrapper
		})
		expect(screen.getByTestId('icon-success')).toBeTruthy()
		expect(screen.getByText('완료')).toBeTruthy()
	})
})
