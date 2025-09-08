import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import GlobalErrorFallback from '../GlobalErrorFallback'

describe('GlobalErrorFallback', () => {
	it('Axios 네트워크 에러 메시지를 표시한다', () => {
		const error: any = { isAxiosError: true, message: 'Network Error' }
		render(
			<GlobalErrorFallback error={error} resetErrorBoundary={jest.fn()} />,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('common.errors.networkError')).toBeTruthy()
		expect(screen.getByText('common.errors.checkConnection')).toBeTruthy()
	})

	it('401 인증 에러 메시지를 표시한다', () => {
		const error: any = { isAxiosError: true, response: { status: 401 } }
		render(
			<GlobalErrorFallback error={error} resetErrorBoundary={jest.fn()} />,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('auth.errors.authenticationFailed')).toBeTruthy()
		expect(screen.getByText('auth.errors.reLogin')).toBeTruthy()
	})

	it('5xx 서버 에러 메시지를 표시한다', () => {
		const error: any = { isAxiosError: true, response: { status: 503 } }
		render(
			<GlobalErrorFallback error={error} resetErrorBoundary={jest.fn()} />,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('common.errors.serverError')).toBeTruthy()
		expect(screen.getByText('common.errors.tryAgainLater')).toBeTruthy()
	})

	it('기타 Axios 에러는 알 수 없는 에러로 표시한다', () => {
		const error: any = { isAxiosError: true, response: { status: 400 } }
		render(
			<GlobalErrorFallback error={error} resetErrorBoundary={jest.fn()} />,
			{ wrapper: TestWrapper }
		)
		expect(
			screen.getAllByText('common.errors.unknownError').length
		).toBeGreaterThan(0)
		expect(screen.getByText('common.errors.tryAgainLater')).toBeTruthy()
	})

	it('Axios가 아닌 에러는 알 수 없는 에러로 표시하고 버튼 동작을 수행한다', () => {
		const reset = jest.fn()
		render(
			<GlobalErrorFallback error={new Error('x')} resetErrorBoundary={reset} />,
			{ wrapper: TestWrapper }
		)
		fireEvent.press(screen.getByText('common.retry'))
		expect(reset).toHaveBeenCalled()
	})
})
