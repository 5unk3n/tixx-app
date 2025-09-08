import {
	describe,
	it,
	expect,
	beforeEach,
	afterEach,
	jest
} from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import ErrorFallback from '../ErrorFallback'

jest.mock('@sentry/react-native', () => ({
	captureException: jest.fn()
}))

describe('ErrorFallback', () => {
	// @ts-ignore
	const originalDev = global.__DEV__

	beforeEach(() => {
		jest.clearAllMocks()
	})

	afterEach(() => {
		// @ts-ignore
		global.__DEV__ = originalDev
	})

	it('기본 타이틀/설명/버튼 텍스트를 렌더링한다', () => {
		const reset = jest.fn()
		render(
			<ErrorFallback error={new Error('boom')} resetErrorBoundary={reset} />,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('common.errors.unknownError')).toBeTruthy()
		expect(screen.getByText('common.errors.tryAgainLater')).toBeTruthy()
		expect(screen.getByText('common.retry')).toBeTruthy()
	})

	it('prop으로 전달된 타이틀/설명/버튼 텍스트를 사용하고 버튼 클릭 시 reset을 호출한다', () => {
		const reset = jest.fn()
		render(
			<ErrorFallback
				error={new Error('x')}
				resetErrorBoundary={reset}
				title="제목"
				description="설명"
				buttonText="다시 시도"
			/>,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('제목')).toBeTruthy()
		expect(screen.getByText('설명')).toBeTruthy()
		fireEvent.press(screen.getByText('다시 시도'))
		expect(reset).toHaveBeenCalled()
	})

	it('production(__DEV__=false) 환경에서는 Sentry.captureException을 호출한다', () => {
		const { captureException } = require('@sentry/react-native')
		// @ts-ignore
		global.__DEV__ = false
		render(
			<ErrorFallback
				error={new Error('prod error')}
				resetErrorBoundary={jest.fn()}
			/>,
			{ wrapper: TestWrapper }
		)
		expect(captureException).toHaveBeenCalled()
	})
})
