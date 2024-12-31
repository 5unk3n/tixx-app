import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Toast from 'react-native-toast-message'

import { transferEventTickets } from '@/apis/eventTickets/transferEventTickets'
import { EventTicketsTransferPayload } from '@/types'
import { queryClient } from '@/utils/queryClient'

export const useTransferEventTickets = () => {
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
							text1: '이 티켓은 이미 전송되었습니다.'
						})
					} else if (error.response.data.message.includes('toUserId')) {
						Toast.show({
							type: 'error',
							text1: '티켓을 받을 사용자를 선택해주세요.'
						})
					}
				} else if (error.response?.status === 404) {
					Toast.show({
						type: 'error',
						text1: '티켓이 존재하지 않습니다.'
					})
				}
				Toast.show({ type: 'error', text1: error.response?.data.message })
			}
		}
	})
}
