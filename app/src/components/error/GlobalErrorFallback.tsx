import { isAxiosError } from 'axios'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'

import ErrorFallback from './ErrorFallback'

export default function GlobalErrorFallback({
	error,
	resetErrorBoundary
}: FallbackProps) {
	const getErrorContent = () => {
		if (isAxiosError(error)) {
			if (error.message === 'Network Error') {
				return {
					title: '네트워크 오류가 발생했습니다.',
					description: '인터넷 연결을 확인하고 다시 시도해주세요.'
				}
			} else if (error.response?.status === 401) {
				return {
					title: '인증에 실패했습니다.',
					description: '다시 로그인해주세요.'
				}
			} else if (error.response?.status && error.response?.status >= 500) {
				return {
					title: '서버 오류가 발생했습니다.',
					description: '잠시 후 다시 시도해주세요.'
				}
			} else {
				return {
					title: '알 수 없는 오류가 발생했습니다.',
					description: '잠시 후 다시 시도해주세요.'
				}
			}
		} else {
			return {
				title: '알 수 없는 오류가 발생했습니다.',
				description: '잠시 후 다시 시도해주세요.'
			}
		}
	}

	const errorContent = getErrorContent()

	return (
		<ErrorFallback
			title={errorContent.title}
			description={errorContent.description}
			buttonText="다시 시도"
			error={error}
			resetErrorBoundary={resetErrorBoundary}
		/>
	)
}
