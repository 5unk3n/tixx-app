import { useMutation } from '@tanstack/react-query'

import { createPlace } from '@/apis/places/createPlace'

export const useCreatePlace = () => {
	return useMutation({
		mutationFn: createPlace
	})
}
