import { QueryClient, QueryCache } from '@tanstack/react-query'
import axios from 'axios'

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (_error, query) => {
			if (query.state.data !== undefined) {
				// TODO: 토스트 추가
				console.error('An error occurred while fetching data:', _error)
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
