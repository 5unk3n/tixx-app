import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { TestWrapper } from '../../testUtils/TestWrapper'
import TransferActionDialog from '../TransferActionDialog'

describe('TransferActionDialog', () => {
	it('renders accept dialog and handles confirm', async () => {
		const onConfirm = jest.fn<any>().mockResolvedValue(undefined)
		const onClose = jest.fn()
		render(
			<TransferActionDialog
				isVisible={true}
				onClose={onClose}
				onConfirm={onConfirm}
				type="accept"
			/>,
			{ wrapper: TestWrapper }
		)

		expect(screen.getByText('common.confirms.accept')).toBeTruthy()
		fireEvent.press(screen.getByText('common.actions.accept'))
		await screen.findByText('tickets.messages.transferAcceptedSuccess')
	})
})
