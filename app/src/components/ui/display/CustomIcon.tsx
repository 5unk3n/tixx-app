import React from 'react'
import { SvgProps } from 'react-native-svg'

import AppleGrayIcon from '@/assets/icons/apple-gray.svg'
import AppleIcon from '@/assets/icons/apple.svg'
import ArrowDownIcon from '@/assets/icons/arrow-down.svg'
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg'
import ArrowRightIcon from '@/assets/icons/arrow-right.svg'
import ArrowUpIcon from '@/assets/icons/arrow-up.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'
import CheckboxMinimalChecked from '@/assets/icons/checkbox-minimal-checked.svg'
import CheckboxMinimalUnchecked from '@/assets/icons/checkbox-minimal-unchecked.svg'
import CheckboxSquareChecked from '@/assets/icons/checkbox-square-checked.svg'
import CheckboxSquareUnchecked from '@/assets/icons/checkbox-square-unchecked.svg'
import CloseIcon from '@/assets/icons/close.svg'
import ErrorIcon from '@/assets/icons/error.svg'
import HomeActiveIcon from '@/assets/icons/home-active.svg'
import HomeIcon from '@/assets/icons/home.svg'
import KakaoGrayIcon from '@/assets/icons/kakao-gray.svg'
import KakaoIcon from '@/assets/icons/kakao.svg'
import MarkerIcon from '@/assets/icons/marker.svg'
import MinusIcon from '@/assets/icons/minus.svg'
import MyTicketIcon from '@/assets/icons/my-ticket.svg'
import NaverGrayIcon from '@/assets/icons/naver-gray.svg'
import NaverIcon from '@/assets/icons/naver.svg'
import NeutralIcon from '@/assets/icons/neutral.svg'
import NotificationActiveIcon from '@/assets/icons/notification-active.svg'
import NotificationIcon from '@/assets/icons/notification.svg'
import PinIcon from '@/assets/icons/pin.svg'
import Place from '@/assets/icons/place.svg'
import PlusIcon from '@/assets/icons/plus.svg'
import ProfileActive from '@/assets/icons/profile-active.svg'
import Profile from '@/assets/icons/profile.svg'
import QrIcon from '@/assets/icons/qr.svg'
import ReceivedTicketIcon from '@/assets/icons/received-ticket.svg'
import SearchIcon from '@/assets/icons/search.svg'
import SentTicketIcon from '@/assets/icons/sent-ticket.svg'
import SettingsIcon from '@/assets/icons/settings.svg'
import SmileIcon from '@/assets/icons/smile.svg'
import SuccessIcon from '@/assets/icons/success.svg'
import TicketSent from '@/assets/icons/ticket-sent.svg'
import Ticket from '@/assets/icons/ticket.svg'
import TimeIcon from '@/assets/icons/time.svg'
import TixxLogoIcon from '@/assets/icons/tixx-logo.svg'

export const iconMap = {
	arrowLeft: ArrowLeftIcon,
	calendar: CalendarIcon,
	error: ErrorIcon,
	notification: NotificationIcon,
	notificationActive: NotificationActiveIcon,
	settings: SettingsIcon,
	checkboxSquareChecked: CheckboxSquareChecked,
	checkboxSquareUnchecked: CheckboxSquareUnchecked,
	checkboxMinimalChecked: CheckboxMinimalChecked,
	checkboxMinimalUnchecked: CheckboxMinimalUnchecked,
	success: SuccessIcon,
	arrowDown: ArrowDownIcon,
	home: HomeIcon,
	profile: Profile,
	qr: QrIcon,
	place: Place,
	pin: PinIcon,
	time: TimeIcon,
	arrowRight: ArrowRightIcon,
	minus: MinusIcon,
	plus: PlusIcon,
	close: CloseIcon,
	smile: SmileIcon,
	neutral: NeutralIcon,
	myTicket: MyTicketIcon,
	receivedTicket: ReceivedTicketIcon,
	sentTicket: SentTicketIcon,
	search: SearchIcon,
	kakao: KakaoIcon,
	naver: NaverIcon,
	apple: AppleIcon,
	kakaoGray: KakaoGrayIcon,
	naverGray: NaverGrayIcon,
	appleGray: AppleGrayIcon,
	arrowUp: ArrowUpIcon,
	profileActive: ProfileActive,
	homeActive: HomeActiveIcon,
	tixxLogo: TixxLogoIcon,
	ticket: Ticket,
	ticketSent: TicketSent,
	marker: MarkerIcon
} as const

export type IconName = keyof typeof iconMap

interface IconProps extends SvgProps {
	name: IconName
	size?: number
}

export default function CustomIcon({ name, size = 26, ...props }: IconProps) {
	const IconComponent = iconMap[name]
	return (
		<IconComponent pointerEvents="none" height={size} width={size} {...props} />
	)
}
