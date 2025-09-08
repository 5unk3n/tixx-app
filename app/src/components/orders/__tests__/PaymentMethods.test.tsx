import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { TestWrapper } from '../../testUtils/TestWrapper'
import PaymentMethods from '../PaymentMethods'

jest.mock('../../ui/display/CustomIcon', () => {
	const { View } = require('react-native')
	return ({ name, ...props }: any) => (
		<View testID={`icon-${name}`} {...props} />
	)
})

jest.mock('react-i18next', () => ({
	useTranslation: jest.fn()
}))

const mockUseTranslation = useTranslation as jest.Mock

describe('PaymentMethods', () => {
	const onSelectMethod = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		// 기본 언어는 한국어로 설정
		mockUseTranslation.mockReturnValue({
			t: (key: string) => key, // 번역 키를 그대로 반환
			i18n: { language: 'ko' }
		})
	})

	it('결제 수단 선택 시 올바른 인자와 함께 콜백을 호출한다', () => {
		render(
			<PaymentMethods payMethod="card" onSelectMethod={onSelectMethod} />,
			{ wrapper: TestWrapper }
		)

		fireEvent.press(screen.getByText('tickets.payment.methods.kakao'))
		expect(onSelectMethod).toHaveBeenCalledWith('kakao')

		fireEvent.press(screen.getByText('tickets.payment.methods.toss'))
		expect(onSelectMethod).toHaveBeenCalledWith('tosspay')

		fireEvent.press(screen.getByText('tickets.payment.methods.card'))
		expect(onSelectMethod).toHaveBeenCalledWith('card')

		expect(onSelectMethod).toHaveBeenCalledTimes(3)
	})

	it('선택된 결제 수단에 맞는 체크 아이콘을 표시한다', () => {
		const { rerender } = render(
			<PaymentMethods payMethod="kakao" onSelectMethod={onSelectMethod} />,
			{ wrapper: TestWrapper }
		)

		// 카카오페이가 선택되었을 때
		expect(screen.getAllByTestId('icon-radioCheckedSecondary').length).toBe(1)
		expect(screen.getAllByTestId('icon-radioUncheckedSecondary').length).toBe(2)

		// Props를 변경하여 다시 렌더링 (카드 선택)
		rerender(
			<PaymentMethods payMethod="card" onSelectMethod={onSelectMethod} />
		)

		// 카드가 선택되었을 때
		expect(screen.getAllByTestId('icon-radioCheckedSecondary').length).toBe(1)
		expect(screen.getAllByTestId('icon-radioUncheckedSecondary').length).toBe(2)
	})

	it('언어가 한국어가 아닐 때 페이팔을 표시한다', () => {
		// 언어를 영어로 변경
		mockUseTranslation.mockReturnValue({
			t: (key: string) => key,
			i18n: { language: 'en' }
		})

		render(
			<PaymentMethods payMethod="card" onSelectMethod={onSelectMethod} />,
			{ wrapper: TestWrapper }
		)

		expect(screen.getByText('tickets.payment.methods.paypal')).toBeTruthy()
	})

	it('언어가 한국어일 때 페이팔을 표시하지 않는다', () => {
		render(
			<PaymentMethods payMethod="card" onSelectMethod={onSelectMethod} />,
			{ wrapper: TestWrapper }
		)

		expect(screen.queryByText('tickets.payment.methods.paypal')).toBeNull()
	})
})
