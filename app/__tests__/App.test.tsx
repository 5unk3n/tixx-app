/**
 * @format
 */

import 'react-native'
import { jest, it } from '@jest/globals'
import { render } from '@testing-library/react-native'
import React from 'react'

import App from '../src/App'

// Note: import explicitly to use the types shipped with jest.

// Note: test renderer must be required after react-native.

it('renders correctly', () => {
	render(<App />)
	jest.runAllTimers() // 타이머 즉시 실행
})
