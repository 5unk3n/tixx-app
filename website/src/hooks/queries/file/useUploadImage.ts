import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { ZodError } from 'zod'

import { uploadImage } from '@/apis/file/uploadImage'
import { UploadImagePayloadSchema } from '@/lib/schemas/file'
import { UploadImagePayload } from '@/types'

export const useUploadImage = (
	type: 'hosts' | 'events' | 'users',
	onSuccessCallback: (imageUrl: string) => void
) => {
	const [uploadedImage, setUploadedImage] = useState('')
	const [error, setError] = useState('')

	const mutation = useMutation({
		mutationFn: ({
			payload,
			type
		}: {
			payload: UploadImagePayload
			type: 'hosts' | 'events' | 'users'
		}) => uploadImage(payload, type),
		onSuccess: (data) => {
			setUploadedImage(data.imageUrl)
			onSuccessCallback(data.imageUrl)
		}
	})

	const uploadImageFile = async (image: File) => {
		try {
			await UploadImagePayloadSchema.parseAsync({ file: image })
			mutation.mutateAsync({ payload: { file: image }, type })
		} catch (error) {
			if (error instanceof ZodError) {
				setError(error.issues[0].message)
			} else {
				console.error(error)
			}
		}
	}

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const image = e.target.files?.[0]
		if (!image) return
		await uploadImageFile(image)
	}

	const clear = () => {
		setUploadedImage('')
		setError('')
	}

	return {
		uploadedImage,
		handleImageChange,
		uploadImageFile,
		clear,
		error
	}
}
