import { z } from 'zod'

import { BaseEntitySchema, DateTimeString } from './common'

// Inquiries
export const InquiryTypeEnum = z.nativeEnum({
	APP_FEEDBACK: '1', // 앱 설정 내 피드백
	WITHDRAWAL_FEEDBACK: '2', // 탈퇴 시 피드백
	CUSTOMER_INQUIRY: '3', // 1:1 문의
	BUG_REPORT: '4', // 버그 신고
	FEATURE_REQUEST: '5', // 기능 요청
	OTHER: '6' // 기타
})

export const InquiryStatusEnum = z.nativeEnum({
	PENDING: '1', // 접수됨
	IN_PROGRESS: '2', // 처리 중
	COMPLETED: '3', // 완료됨
	REJECTED: '4' // 반려됨
})

export const InquiryBaseSchema = BaseEntitySchema.extend({
	type: InquiryTypeEnum,
	status: InquiryStatusEnum,
	title: z.string(),
	content: z.string(),
	answer: z.string().nullable(),
	userId: z.number().nullable(),
	answeredAt: DateTimeString.nullable()
})

export const CreateFeedbackPayloadSchema = z.object({
	content: z.string()
})

export const CreateFeedbackResponseSchema = InquiryBaseSchema
