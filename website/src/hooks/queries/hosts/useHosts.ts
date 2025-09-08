import { useQuery } from '@tanstack/react-query'

import { getHosts } from '@/apis/hosts/getHosts'

export const useHosts = () => {
	return useQuery({
		queryKey: ['host'],
		queryFn: getHosts
	})
}
