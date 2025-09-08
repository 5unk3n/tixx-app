import { useMutation } from '@tanstack/react-query'

import { requestPresignedUrl } from '@/apis/file/requestPresignedUrl'

export const useRequestPresignedUrl = () => {
	return useMutation({
		mutationFn: requestPresignedUrl
	})
}
