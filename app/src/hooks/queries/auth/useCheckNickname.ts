import { useMutation } from '@tanstack/react-query'

import { checkNickname } from '@/apis/auth/checkNickname'

export const useCheckNickname = () => {
	return useMutation({
		mutationFn: (nickname: string) => checkNickname({ nickname })
	})
}
