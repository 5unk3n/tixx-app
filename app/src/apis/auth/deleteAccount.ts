import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'

export const deleteAccount = async () => {
	await axiosInstance.delete(API_PATH.AUTH.BASE)
}
