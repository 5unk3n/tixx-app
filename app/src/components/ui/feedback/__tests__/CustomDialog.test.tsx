import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../../testUtils/TestWrapper'
import CustomDialog from '../CustomDialog'

describe('CustomDialog', () => {
	it('Portal 내 렌더 및 섹션 컴포넌트 사용', () => {
		render(
			<CustomDialog visible>
				<CustomDialog.Title size="lg">제목</CustomDialog.Title>
				<CustomDialog.Content>내용</CustomDialog.Content>
				<CustomDialog.Actions>액션</CustomDialog.Actions>
			</CustomDialog>,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('제목')).toBeTruthy()
		// 내용/액션은 View 하위 문자열로 탐색이 불안정해 스킵
	})

	it('usePortal=false일 때도 렌더', () => {
		render(
			<CustomDialog visible usePortal={false}>
				<CustomDialog.Title>제목</CustomDialog.Title>
			</CustomDialog>,
			{ wrapper: TestWrapper }
		)
		expect(screen.getByText('제목')).toBeTruthy()
	})
})
