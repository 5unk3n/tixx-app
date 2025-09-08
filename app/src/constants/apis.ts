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
		TODAY: '/events/today',
		THIS_WEEK: '/events/this-week',
		POPULAR: '/events/popular',
		RECOMMENDED: '/events/recommended',
		TAG: '/events/tag',
		WISH: '/events/wish',
		HOST: '/events/host',
		SEARCH: '/events/search',
		REACTIONS: (id: number) => `/events/${id}/reactions` as const,
		WISH_TOGGLE: (id: number) => `/events/${id}/wish` as const,
		NEARBY: '/events/nearby'
	},
	EVENT_TICKETS: {
		BASE: '/event-tickets',
		USER_TICKETS: '/event-tickets/user/tickets',
		TRANSFER: '/event-tickets/transfer',
		USER_TRANSFERS: '/event-tickets/user/transfers',
		ACCEPT: '/event-tickets/accept',
		REJECT: '/event-tickets/reject',
		CANCEL: '/event-tickets/cancel',
		USE_TICKET: '/event-tickets/use/user'
	},
	QR_CODES: {
		BASE: '/qr-codes'
	},
	NOTIFICATIONS: {
		BASE: '/notifications',
		UNREAD: '/notifications/unread',
		MARK_AS_READ: '/notifications/mark-as-read'
	},
	COUPONS: {
		VERIFY: '/coupon/verify',
		ISSUE: '/coupon/issue'
	},
	ORDERS: {
		BASE: '/orders',
		PAYMENT: '/orders/payment',
		PAYMENT_CANCEL: '/orders/payment/cancel'
	},
	INQUIRIES: {
		APP_FEEDBACK: '/inquirys/app-feedback',
		WITHDRAWAL_FEEDBACK: '/inquirys/withdrawal-feedback'
	},
	HOSTS: {
		BASE: '/hosts',
		TOGGLE_FOLLOW: (id: number) => `/hosts/${id}/follow` as const,
		FOLLOWING: '/hosts/following',
		IS_FOLLOWING: (id: number) => `/hosts/${id}/is-following` as const
	},
	VERSIONS: {
		BASE: '/version'
	}
} as const
