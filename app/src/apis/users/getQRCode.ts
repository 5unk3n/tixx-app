import { API_PATH } from '@/constants/apis'
import axiosInstance from '@/utils/axiosInstance'
import { QRCodeResponseSchema } from '@/utils/schemas'
import { validateApiResponse } from '@/utils/validateApiResponse'

export const getQRCode = async () => {
	const response = await axiosInstance.get(API_PATH.USER.QRCODE)
	return validateApiResponse(response.data, QRCodeResponseSchema)
}
