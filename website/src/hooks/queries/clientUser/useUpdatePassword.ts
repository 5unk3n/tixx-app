import { useMutation } from '@tanstack/react-query'

import { updatePassword } from '@/apis/clientUser/updatePassword'
import { queryClient } from '@/lib/queryClient'
import { UpdatePasswordPayload } from '@/types'

export const useUpdatePassword = () => {
	return useMutation({
		mutationFn: ({
			data,
			token
		}: {
			data: UpdatePasswordPayload
			token?: string
		}) => updatePassword(data, token),
		onSuccess: (data) => {
			queryClient.setQueryData(['profile'], data)
		}
	})
}
