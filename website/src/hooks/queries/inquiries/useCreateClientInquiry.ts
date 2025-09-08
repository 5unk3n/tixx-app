import { useMutation } from '@tanstack/react-query'

import { createClientInquiry } from '@/apis/inquiries/clientInquiry'

export const useCreateClientInquiry = () => {
	return useMutation({
		mutationFn: createClientInquiry
	})
}
