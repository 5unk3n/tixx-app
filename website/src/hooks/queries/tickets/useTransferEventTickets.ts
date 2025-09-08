import { useMutation } from '@tanstack/react-query'

import { transferEventTickets } from '@/apis/tickets/transferEventTickets'
import { EventTicketsTransferPayload } from '@/types'

export const useTransferEventTickets = () => {
	return useMutation({
		mutationFn: (payload: EventTicketsTransferPayload) =>
			transferEventTickets(payload)
		// onError: (error) => {
		// 	if (isAxiosError(error)) {
		// 		if (error.response?.status === 403) {
		// 			if (error.response.data.message.includes('pending')) {
		// 				Toast.show({
		// 					type: 'error',
		// 					text1: t('tickets.errors.alreadySent')
		// 				})
		// 			} else if (error.response.data.message.includes('toUserId')) {
		// 				Toast.show({
		// 					type: 'error',
		// 					text1: t('tickets.errors.selectUser')
		// 				})
		// 			}
		// 		} else if (error.response?.status === 404) {
		// 			Toast.show({
		// 				type: 'error',
		// 				text1: t('tickets.errors.noTickets')
		// 			})
		// 		}
		// 		Toast.show({ type: 'error', text1: error.message })
		// 	}
		// }
	})
}
