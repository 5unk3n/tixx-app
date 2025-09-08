import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import DeletionSurveyForm from '../DeletionSurveyForm'

jest.mock('@react-navigation/native', () => ({
	...(jest.requireActual(
		'@react-navigation/native'
	) as typeof import('@react-navigation/native')),
	useNavigation: () => ({
		goBack: jest.fn()
	})
}))

jest.mock('@/hooks/queries/inquirys/useCreateWithdrawalFeedback', () => ({
	useCreateWithdrawalFeedback: () => ({
		mutateAsync: jest.fn(),
		isPending: false
	})
}))

describe('DeletionSurveyForm', () => {
	it('renders survey and handles submission', () => {
		const onSubmit = jest.fn()
		render(<DeletionSurveyForm onSubmit={onSubmit} submitText="Submit" />, {
			wrapper: TestWrapper
		})
		fireEvent.press(
			screen.getByText('auth.deletionSurvey.privacy', { exact: false })
		)
		fireEvent.press(screen.getByText('Submit'))
		expect(onSubmit).toHaveBeenCalled()
	})
})
