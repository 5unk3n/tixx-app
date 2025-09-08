import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import BusinessInfo from '../BusinessInfo'

describe('BusinessInfo', () => {
	it('renders business information correctly', () => {
		render(<BusinessInfo />, { wrapper: TestWrapper })
		expect(screen.getByText('TiXX 사업자 정보')).toBeTruthy()
		expect(screen.getByText('상호: 아비치')).toBeTruthy()
		expect(screen.getByText('대표: 김휘진')).toBeTruthy()
		expect(
			screen.getByText(
				'주소: 서울특별시 성동구 한림말길 35, B101호(옥수동, 상아빌라)'
			)
		).toBeTruthy()
		expect(screen.getByText('사업자 등록번호: 115-40-01461')).toBeTruthy()
		expect(screen.getByText('대표번호: 050-6551-9787')).toBeTruthy()
	})
})
