import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'

import { deleteEventTicket } from '@/apis/eventTickets/deleteEventTicket'
import { queryClient } from '@/utils/queryClient'

export const useDeleteEventTickets = () => {
	const { t } = useTranslation()

	return useMutation({
		mutationFn: async ({ eventTicketIds }: { eventTicketIds: number[] }) => {
			const deletePromises = eventTicketIds.map((eventTicketId) =>
				deleteEventTicket(eventTicketId)
			)
			await Promise.all(deletePromises)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['eventTickets', ['available']]
			})
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				if (error.response?.status === 404) {
					Toast.show({
						type: 'error',
						text1: t('tickets.errors.noTickets')
					})
				} else {
					Toast.show({
						type: 'error',
						text1: t('tickets.errors.cancelFailed')
					})
				}
			}
		}
	})
}
