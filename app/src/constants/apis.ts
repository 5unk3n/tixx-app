import { OAuthProvider } from '@/types'

export const API_PATH = {
	USER: {
		BASE: '/users',
		PROFILE: '/auth/profile',
		QRCODE: '/users/qrcode',
		NICKNAMES: '/users/nicknames'
	},
	AUTH: {
		BASE: '/auth',
		SIGNUP: '/auth/signup',
		LOGIN: (provider: OAuthProvider) => `/auth/${provider}` as const,
		CHECK_NICKNAME: '/auth/check-nickname',
		REQUEST_PHONE_AUTH_CODE: '/auth/issue-phone-auth-code',
		VERIFY_PHONE_AUTH_CODE: '/auth/verify-phone-auth-code'
	},
	EVENTS: {
		BASE: '/events',
		REACTIONS: (id: number) => `/events/${id}/reactions` as const
	},
	EVENT_TICKETS: {
		BASE: '/event-tickets',
		USER_TICKETS: '/event-tickets/user/tickets',
		TRANSFER: '/event-tickets/transfer',
		USER_TRANSFERS: '/event-tickets/user/transfers',
		ACCEPT: '/event-tickets/accept',
		REJECT: '/event-tickets/reject',
		CANCEL: '/event-tickets/cancel'
	},
	NOTIFICATIONS: {
		BASE: '/notifications',
		UNREAD: '/notifications/unread',
		MARK_AS_READ: '/notifications/mark-as-read'
	}
} as const
