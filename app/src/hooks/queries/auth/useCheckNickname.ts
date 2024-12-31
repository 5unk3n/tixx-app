import { useMutation } from '@tanstack/react-query'

import { checkNickname } from '@/apis/users/checkNickname'

export const useCheckNickname = () => {
	return useMutation({
		mutationFn: (nickname: string) => checkNickname({ nickname })
	})
}
