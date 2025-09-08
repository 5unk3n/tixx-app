import { useRef } from 'react'

export const useCaptureThumbnail = () => {
	const videoRef = useRef<HTMLVideoElement>(null)

	// 썸네일 캡처 함수
	const captureThumbnail = async () => {
		const video = videoRef.current
		if (!video) {
			console.error('Video element not found')
			return
		}

		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		if (!ctx) {
			console.error('Canvas context not found')
			return null
		}

		try {
			canvas.width = video.videoWidth
			canvas.height = video.videoHeight
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

			const blob = await new Promise<Blob | null>((resolve) =>
				canvas.toBlob(resolve, 'image/webp')
			)

			if (!blob) {
				console.warn('Failed to generate blob from canvas')
				return null
			}

			const file = new File([blob], `thumbnail_${Date.now()}.webp`, {
				type: 'image/webp'
			})

			return file
		} catch (error) {
			console.error(error)
			return null
		}
	}

	return { videoRef, captureThumbnail }
}
