// @ts-ignore
import { LoadPaymentUIRequest, PaymentRequest } from '@portone/browser-sdk/v2'

import {
	Event,
	EventFilter,
	EventTicketsUserTransfer,
	GroupedEventTicket,
	PaymentValidation
} from '.'

export type AuthStackParamList = {
	Login: undefined
	Agreement: undefined
	TermsDetail: undefined
	CheckProfile: undefined
}

export type MainStackParamList = {
	MainTab: undefined
	EventDetail: {
		eventId: number
	}
	TicketShare: { ids: GroupedEventTicket['ids']; event: Event }
	TransferCompletion: Event
	Notification: undefined
	MyTickets: undefined
	ReceivedTickets: undefined
	SentTickets: undefined
	TicketManagement: undefined
	Settings: undefined
	Profile: { mode: 'view' | 'edit' }
	AccountDeletion: undefined
	ReceivedTicketDetail: EventTicketsUserTransfer
	SentTicketDetail: EventTicketsUserTransfer
	Feedback: undefined
	Map: { place: Event['place']; title: string }
	RegisterGuestCode: undefined
	Language: undefined
	BuyTicket: Event
	Payment: { event: Event; request: PaymentRequest | LoadPaymentUIRequest }
	PaymentResult: { event: Event; paymentResult: PaymentValidation }
	EventsList: { filter: EventFilter; title: string }
	Wishlist: undefined
	OrderHistory: undefined
	PaymentDetail: { orderId: string }
	PaymentCancelDetail: { orderId: string }
	HostDetail: { hostId: number }
	HostFollowers: { hostId: number }
	MyFollowings: undefined
	NearbyEvents: undefined
}

export type MainTabParamList = {
	Home: undefined
	Tickets: undefined
	QRCode: undefined
	Search: undefined
	MyPage: undefined
}

export type RootStackParamList = {
	Main: undefined
	Auth: undefined
	VerifyIdentity: { mode: 'signUp' | 'edit' }
}

declare global {
	namespace ReactNavigation {
		interface RootParamList
			extends RootStackParamList,
				MainStackParamList,
				AuthStackParamList,
				MainTabParamList {}
	}
}
