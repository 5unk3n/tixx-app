import { Event, EventTicketsUserTransfer, GroupedEventTicket } from '.'

export type AuthStackParamList = {
	Login: undefined
	Agreement: undefined
	TermsDetail: undefined
	CheckProfile: undefined
}

export type MainStackParamList = {
	MainTab: undefined
	EventDetail: Event
	TicketShare: GroupedEventTicket['ids']
	TransferCompletion: undefined
	Notification: undefined
	MyTickets: undefined
	ReceivedTickets: undefined
	SentTickets: undefined
	Settings: undefined
	Profile: { mode: 'view' | 'edit' }
	AccountDeletion: undefined
	ReceivedTicketDetail: EventTicketsUserTransfer
	SentTicketDetail: EventTicketsUserTransfer
	Feedback: undefined
	Map: Event['place']
}

export type MainTabParamList = {
	Home: undefined
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
