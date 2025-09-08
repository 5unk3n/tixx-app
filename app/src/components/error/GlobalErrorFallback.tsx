import { isAxiosError } from 'axios'
import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'

import ErrorFallback from './ErrorFallback'

export default function GlobalErrorFallback({
	error,
	resetErrorBoundary
}: FallbackProps) {
	const { t } = useTranslation()

	const getErrorContent = () => {
		if (isAxiosError(error)) {
			if (error.message === 'Network Error') {
				return {
					title: t('common.errors.networkError'),
					description: t('common.errors.checkConnection')
				}
			} else if (error.response?.status === 401) {
				return {
					title: t('auth.errors.authenticationFailed'),
					description: t('auth.errors.reLogin')
				}
			} else if (error.response?.status && error.response?.status >= 500) {
				return {
					title: t('common.errors.serverError'),
					description: t('common.errors.tryAgainLater')
				}
			} else {
				return {
					title: t('common.errors.unknownError'),
					description: t('common.errors.tryAgainLater')
				}
			}
		} else {
			return {
				title: t('common.errors.unknownError'),
				description: t('common.errors.tryAgainLater')
			}
		}
	}

	const errorContent = getErrorContent()

	return (
		<ErrorFallback
			title={errorContent.title}
			description={errorContent.description}
			buttonText={t('common.retry')}
			error={error}
			resetErrorBoundary={resetErrorBoundary}
		/>
	)
}
