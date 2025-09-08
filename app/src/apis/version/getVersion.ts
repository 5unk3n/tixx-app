import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { VersionBaseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getVersion = async (os: 'ios' | 'android') => {
	const response = await axiosInstance.get(`${API_PATH.VERSIONS.BASE}/${os}`)
	return validateApiResponse(response.data, VersionBaseSchema)
}
