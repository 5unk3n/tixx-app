import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { PropsWithChildren } from 'react'
import { PaperProvider } from 'react-native-paper'

import { theme } from '@/theme/defaultTheme'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			staleTime: Infinity
		}
	}
})

export const TestWrapper = ({ children }: PropsWithChildren) => {
	return (
		<PaperProvider theme={theme.dark}>
			<QueryClientProvider client={queryClient}>
				<NavigationContainer>{children}</NavigationContainer>
			</QueryClientProvider>
		</PaperProvider>
	)
}
