import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'

import { queryClient } from './lib/queryClient'
import Router from './routes/Router'

import '@/lib/schemas/customErrorMap'

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Router />
			<Toaster richColors closeButton />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}
