import { z } from 'zod'

export const PresignedUrlFolderSchema = z.enum(['hosts', 'users', 'events'])
export const UploadableMimeTypeSchema = z.enum([
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/gif',
	'video/mp4',
	'video/webm',
	'video/mov'
])

export const MediaBaseSchema = z.object({
	id: z.string(),
	eventId: z.number(),
	mediaUrl: z.string().url(),
	mimeType: UploadableMimeTypeSchema,
	thumbnailUrl: z.string().url().nullable(),
	altText: z.string().nullable(),
	sortOrder: z.number(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	deletedAt: z.string().datetime().nullable()
})

async function isAnimatedGif(file: File): Promise<boolean> {
	const buffer = await file.arrayBuffer()
	const uint8Array = new Uint8Array(buffer)
	let frameCount = 0

	for (let i = 0; i < uint8Array.length; i++) {
		if (uint8Array[i] === 0x21 && uint8Array[i + 1] === 0xff) {
			frameCount++
		}
		if (frameCount > 1) return true
	}
	return false
}

export const RequestPresignedUrlPayloadSchema = z.object({
	folder: PresignedUrlFolderSchema,
	// host 이미지는 clientUser id, event 이미지는 host id
	id: z.string(),
	mimetype: UploadableMimeTypeSchema
})

export const RequestPresignedUrlResponseSchema = z.object({
	presignedUrl: z.string().url(),
	mediaUrl: z.string().url()
})

export const UploadFilePayloadSchema = z
	.instanceof(File)
	.refine((file) => file.size <= 4 * 1024 * 1024, {
		message: '파일 크기는 4MB 이하여야 합니다.'
	})
	.refine(
		(file) =>
			[
				'image/jpeg',
				'image/png',
				'image/gif',
				'image/webp',
				'video/mp4',
				'video/webm',
				'video/mov'
			].includes(file.type),
		{
			message: '지원되지 않는 파일 형식입니다.'
		}
	)

// FIXME: 파일 업로드 완료되면 기존 이미지 업로드 API 제거
export const UploadImagePayloadSchema = z.object({
	file: z
		.instanceof(File)
		.refine((file) => file.size <= 4 * 1024 * 1024, {
			message: '파일 크기는 4MB 이하여야 합니다.'
		})
		.refine(
			(file) =>
				['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
					file.type
				),
			{
				message: '지원되는 파일 형식: JPG, PNG, GIF, WEBP'
			}
		)
		.refine(
			async (file) => {
				if (file.type === 'image/gif') {
					return !(await isAnimatedGif(file))
				}
				return true
			},
			{ message: '움직이는 GIF 파일은 허용되지 않습니다' }
		)
})

export const UploadImageResponseSchema = z.object({
	imageUrl: z.string()
})
