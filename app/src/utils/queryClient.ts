import { QueryCache, QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import Toast from 'react-native-toast-message'

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (_error, query) => {
			if (query.state.data !== undefined) {
				Toast.show({
					type: 'error',
					text1: '데이터를 불러오는데 실패했습니다.'
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
