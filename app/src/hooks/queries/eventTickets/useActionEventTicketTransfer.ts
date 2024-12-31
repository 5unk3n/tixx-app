import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Toast from 'react-native-toast-message'

import { actionEventTicketTransfer } from '@/apis/eventTickets/actionEventTicketTransfer'
import { EventTicketsActionPayload } from '@/types'
import { queryClient } from '@/utils/queryClient'

export const useActionEventTicketTransfer = () => {
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
						text1: '요청 권한이 없습니다.'
					})
				} else if (error.response?.status === 404) {
					Toast.show({
						type: 'error',
						text1: '존재하지 않거나 이미 처리된 요청입니다.'
					})
				} else {
					Toast.show({
						type: 'error',
						text1: '요청 처리에 실패했습니다.'
					})
				}
			}
		}
	})
}
