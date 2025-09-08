import { z } from 'zod'

import { BaseEntitySchema, DateTimeString } from './common'

// Notifications Schema
/**
 * NotificationDataType
 * 0: INVITESENT - 티켓을 전달(초대)했을 때, 보낸 사람에게 알림
 * 1: INVITERECEIVED - 티켓을 전달받은(초대받은) 유저에게 알림
 * 2: START - 이벤트 시작(입장 10분 전 등) 알림
 * 3: NOTICE - 일반 공지사항, 시스템 알림
 * 4: CANCEL - 티켓 전달/이벤트 등이 취소되었을 때
 */
export const NotificationDataTypeSchema = z.nativeEnum({
	INVITESENT: '0',
	INVITERECEIVED: '1',
	START: '2',
	NOTICE: '3',
	CANCEL: '4'
} as const)

export const NotificationsResponseSchema = z.array(
	BaseEntitySchema.extend({
		userId: z.number(),
		userPhoneNumber: z.string().nullable(),
		title: z.string(),
		body: z.string(),
		data: z.object({
			type: NotificationDataTypeSchema,
			// 알림 종류에 따라 transferId, eventId 등은 optional
			transferId: z.string().optional(),
			eventId: z.string().optional()
		}),
		readAt: DateTimeString.nullable()
	})
)

export const NotificationsUnreadResponseSchema = z.object({
	unreadCount: z.number()
})
