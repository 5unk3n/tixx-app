import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { actionEventTicketTransfer } from '@/apis/eventTickets/actionEventTicketTransfer'
import { EventTicketsActionPayload } from '@/types'
import { queryClient } from '@/utils/queryClient'

export const useActionEventTicketTransfer = () => {
	const { t } = useTranslation()

	return useMutation({
		mutationFn: ({
			data,
			action
		}: {
			data: EventTicketsActionPayload
			action: 'accept' | 'reject' | 'cancel'
		}) => actionEventTicketTransfer(data, action),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ['eventTickets'] })
			queryClient.invalidateQueries({ queryKey: ['eventTicketTransfers'] })
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				if (error.response?.status === 403) {
					Toast.show({
						type: 'error',
						text1: t('common.errors.permissionDenied')
					})
				} else if (error.response?.status === 404) {
					Toast.show({
						type: 'error',
						text1: t('common.errors.requestNotFound')
					})
				} else {
					Toast.show({
						type: 'error',
						text1: t('common.errors.requestFailed')
					})
				}
			}
		}
	})
}
