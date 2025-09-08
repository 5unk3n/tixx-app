import { useMutation } from '@tanstack/react-query'

import { updateUser } from '@/apis/users/updateUser'
import { UserUpdateInput } from '@/types'
import { queryClient } from '@/utils/queryClient'

export const useUpdateUser = () => {
	return useMutation({
		mutationFn: (data: UserUpdateInput) => updateUser(data),
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['user'] })
		},
		onMutate: (data: UserUpdateInput) => {
			queryClient.setQueryData(['user'], (oldData: any) => {
				return {
					...oldData,
					...data
				}
			})
		}
	})
}
