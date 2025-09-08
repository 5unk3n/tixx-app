import { useMutation } from '@tanstack/react-query'

import { createAppFeedback } from '@/apis/inquirys/createAppFeedback'

export const useCreateAppFeedback = () => {
	return useMutation({
		mutationFn: createAppFeedback
	})
}
