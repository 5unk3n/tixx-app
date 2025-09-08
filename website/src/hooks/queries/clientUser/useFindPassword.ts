import { useMutation } from '@tanstack/react-query'

import { findPassword } from '@/apis/clientUser/findPassword'

export const useFindPassword = () => {
	return useMutation({
		mutationFn: findPassword
	})
}
