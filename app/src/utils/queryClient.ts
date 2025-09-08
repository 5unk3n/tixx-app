import { QueryCache, QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Toast from 'react-native-toast-message'

import i18n from '../../i18n'

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (_error, query) => {
			if (query.state.data !== undefined) {
				Toast.show({
					type: 'error',
					text1: i18n.t('common.errors.dataFetchFailed')
				})
			}
		}
	}),
	defaultOptions: {
		queries: {
			retry: (failureCount, error) => {
				if (axios.isAxiosError(error) && error.status) {
					if (error.status >= 500) {
						return failureCount < 3
					}
				}
				return false
			},
			throwOnError: false
		},
		mutations: {
			throwOnError: false
		}
	}
})
