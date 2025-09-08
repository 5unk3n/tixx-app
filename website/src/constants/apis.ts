export const API_PATH = {
	AUTH: {
		BASE: '/auth',
		LOGIN_WITH_EMAIL: '/client-users/email',
		SIGNUP: '/client-users/signup',
		REQUEST_EMAIL_CODE: '/auth/issue-email-auth-code',
		VERIFY_EMAIL_CODE: '/auth/verify-email-auth-code'
	},
	CLIENT_USER: {
		BASE: '/client-users',
		PROFILE: '/client-users/profile',
		UPDATE_PASSWORD: '/client-users/update-password',
		FIND_PASSWORD: '/client-users/forgot-password'
	},
	USER: {
		BASE: '/users',
		NICKNAMES: '/users/nicknames'
	},
	HOST: {
		BASE: '/hosts'
	},
	PLACES: { BASE: '/places' },
	EVENTS: {
		BASE: '/events',
		HASHTAGS: '/events/hashtags',
		HOST: '/events/host',
		INSTAGRAM_CRAWL: '/events/instagram',
		PARTICIPANTS: (id: number) => `/events/${id}/participants` as const
	},
	TICKETS: {
		BASE: '/tickets',
		DETAIL: (id: number) => `/tickets/${id}/detail` as const,
		EVENT_TICKET_TRANSFER: '/event-tickets/transfer/client',
		VALIDATE: '/event-tickets/validate',
		USE: '/event-tickets/use/client',
		CLIENT_TRANSFERS: '/event-tickets/client/transfers'
	},
	COUPONS: {
		BASE: '/coupon'
	},
	FILE: {
		BASE: '/upload'
	},
	INQUIRIES: {
		BASE: '/inquirys',
		CLIENT_INQUIRY: '/inquirys/client-inquiry'
	}
} as const
