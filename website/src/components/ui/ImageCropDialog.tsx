import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { useTranslation } from 'react-i18next'

import { Button } from './button'
import { Dialog, DialogContent, DialogDescription } from './dialog'

import { compressImage } from '@/utils/imageUtils'

interface ImageCropDialogProps {
	image: File | null
	isOpen: boolean
	aspectRatio: number
	onOpenChange: (isOpen: boolean) => void
	onEditComplete: (imageFile: File) => void
}

export default function ImageCropDialog({
	image,
	isOpen,
	aspectRatio,
	onOpenChange,
	onEditComplete
}: ImageCropDialogProps) {
	const { t } = useTranslation()
	const [crop, setCrop] = useState({ x: 0, y: 0 })
	const [zoom, setZoom] = useState(1)
	const [imageUrl, setImageUrl] = useState<string | null>(null)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels)
	}

	const createImage = (url: string) =>
		new Promise((resolve, reject) => {
			const image = new Image()
			image.addEventListener('load', () => resolve(image))
			image.addEventListener('error', (error) => reject(error))
			image.src = url
		})

	const getCroppedImg = async (imageSrc: string, pixelCrop: Area) => {
		const image = (await createImage(imageSrc)) as HTMLImageElement
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		if (!ctx) {
			return null
		}

		// 캔버스 크기 설정
		canvas.width = pixelCrop.width
		canvas.height = pixelCrop.height

		// 원본 이미지에서 크롭된 부분을 캔버스에 그리기
		ctx.drawImage(
			image,
			pixelCrop.x,
			pixelCrop.y,
			pixelCrop.width,
			pixelCrop.height,
			0,
			0,
			pixelCrop.width,
			pixelCrop.height
		)

		// Canvas를 Blob으로 변환
		return new Promise((resolve) => {
			canvas.toBlob((blob) => {
				resolve(blob)
			}, 'image/webp')
		})
	}

	const handleCropConfirm = async () => {
		if (!imageUrl || !croppedAreaPixels) return
		setIsLoading(true)

		try {
			const croppedImage = (await getCroppedImg(
				imageUrl,
				croppedAreaPixels
			)) as Blob
			const compressedFile = await compressImage(croppedImage)

			onEditComplete(compressedFile)
			setIsLoading(false)
			onOpenChange(false)
		} catch (e) {
			console.error('Error cropping image:', e)
		}
	}

	useEffect(() => {
		if (!isOpen || !image) {
			setCrop({ x: 0, y: 0 })
			setZoom(1)
			setCroppedAreaPixels(null)
			setImageUrl(null)
		}
		if (image) {
			const url = URL.createObjectURL(image)
			setImageUrl(url)
		}
	}, [image, isOpen])

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogDescription>{t('imageCropDialog.title')}</DialogDescription>
				<div className="relative mx-auto aspect-square w-full">
					<Cropper
						image={imageUrl || ''}
						crop={crop}
						zoom={zoom}
						aspect={aspectRatio}
						onCropChange={setCrop}
						onCropComplete={onCropComplete}
						onZoomChange={setZoom}
					/>
				</div>
				<Button onClick={handleCropConfirm} disabled={isLoading}>
					{t('imageCropDialog.complete')}
					{isLoading && <Loader2 className="animate-spin" />}
				</Button>
			</DialogContent>
		</Dialog>
	)
}
