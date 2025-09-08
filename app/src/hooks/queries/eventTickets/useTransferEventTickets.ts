import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { transferEventTickets } from '@/apis/eventTickets/transferEventTickets'
import { EventTicketsTransferPayload } from '@/types'
import { queryClient } from '@/utils/queryClient'

export const useTransferEventTickets = () => {
	const { t } = useTranslation()

	return useMutation({
		mutationFn: (payload: EventTicketsTransferPayload) =>
			transferEventTickets(payload),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ['eventTickets'] })
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				if (error.response?.status === 403) {
					if (error.response.data.message.includes('pending')) {
						Toast.show({
							type: 'error',
							text1: t('tickets.errors.alreadySent')
						})
					} else if (error.response.data.message.includes('toUserId')) {
						Toast.show({
							type: 'error',
							text1: t('tickets.errors.selectUser')
						})
					}
				} else if (error.response?.status === 404) {
					Toast.show({
						type: 'error',
						text1: t('tickets.errors.noTickets')
					})
				}
				Toast.show({ type: 'error', text1: error.message })
			}
		}
	})
}
