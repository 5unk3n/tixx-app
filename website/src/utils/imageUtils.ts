import imageCompression from 'browser-image-compression'

export const compressImage = async (
	fileOrBlob: File | Blob,
	type: string = 'image/webp'
) => {
	let file: File

	if (fileOrBlob instanceof File) {
		file = fileOrBlob
	} else {
		file = new File([fileOrBlob], 'image.webp', { type: fileOrBlob.type })
	}

	const options = {
		maxSizeMB: 1,
		maxWidthOrHeight: 1920,
		useWebWorker: true,
		fileType: type
	}

	const result = await imageCompression(file, options)
	return new File([result], 'image.webp', { type: result.type })
}
