import axios from 'axios'

import { UploadableMimeType, UploadFilePayload } from '@/types'

export const uploadFile = async (
	presignedUrl: string,
	mimeType: UploadableMimeType,
	payload: UploadFilePayload
) => {
	await axios.put(presignedUrl, payload, {
		headers: {
			'Content-Type': mimeType
		}
	})
}
