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
import KakaoGrayIcon from '@/assets/icons/kakao-gray.svg'
import KakaoIcon from '@/assets/icons/kakao.svg'
import MarkerIcon from '@/assets/icons/marker.svg'
import MyTicketIcon from '@/assets/icons/my-ticket.svg'
import NaverGrayIcon from '@/assets/icons/naver-gray.svg'
import NaverIcon from '@/assets/icons/naver.svg'
import NotificationActiveIcon from '@/assets/icons/notification-active.svg'
import NotificationIcon from '@/assets/icons/notification.svg'
import PinIcon from '@/assets/icons/pin.svg'
import Place from '@/assets/icons/place.svg'
import RadioCheckedIcon from '@/assets/icons/radio-checked.svg'
import RadioUncheckedIcon from '@/assets/icons/radio-unchecked.svg'
import ReceivedTicketIcon from '@/assets/icons/received-ticket.svg'
import SentTicketIcon from '@/assets/icons/sent-ticket.svg'
import SettingsIcon from '@/assets/icons/settings.svg'
import SuccessIcon from '@/assets/icons/success.svg'
import TimeIcon from '@/assets/icons/time.svg'
// v2
import AddTicketIcon from '@/assets/icons/v2/add-ticket.svg'
import BellPinIcon from '@/assets/icons/v2/bell-pin.svg'
import BellIcon from '@/assets/icons/v2/bell.svg'
import CalendarAddIcon from '@/assets/icons/v2/calendar-add.svg'
import ChevronDownIcon from '@/assets/icons/v2/chevron-down.svg'
import ChevronLeftIcon from '@/assets/icons/v2/chevron-left.svg'
import ChevronRightIcon from '@/assets/icons/v2/chevron-right.svg'
import ChevronUpIcon from '@/assets/icons/v2/chevron-up.svg'
import ExtendIcon from '@/assets/icons/v2/extend.svg'
import FollowIcon from '@/assets/icons/v2/follow.svg'
import GoogleGrayIcon from '@/assets/icons/v2/google-gray.svg'
import GoogleIcon from '@/assets/icons/v2/google.svg'
import HeartFillIcon from '@/assets/icons/v2/heart-fill.svg'
import HeartLineIcon from '@/assets/icons/v2/heart-line.svg'
import HomeFilledIcon from '@/assets/icons/v2/home-filled.svg'
import HomeIcon from '@/assets/icons/v2/home.svg'
import MapPinFilledIcon from '@/assets/icons/v2/map-pin-filled.svg'
import MapPinLineIcon from '@/assets/icons/v2/map-pin-line.svg'
import MapPinIcon from '@/assets/icons/v2/map-pin.svg'
import MapIcon from '@/assets/icons/v2/map.svg'
import MinusIcon from '@/assets/icons/v2/minus.svg'
import MyLocationIcon from '@/assets/icons/v2/my-location.svg'
import MyPageFilledIcon from '@/assets/icons/v2/my-page-filled.svg'
import MyPageIcon from '@/assets/icons/v2/my-page.svg'
import NorthEastIcon from '@/assets/icons/v2/north-east.svg'
import PlusIcon from '@/assets/icons/v2/plus.svg'
import QrCodeActiveIcon from '@/assets/icons/v2/qr-code-active.svg'
import QRCodeIcon from '@/assets/icons/v2/qr-code.svg'
import RadioCheckedPrimaryIcon from '@/assets/icons/v2/radio-checked-primary.svg'
import RadioCheckedSecondaryIcon from '@/assets/icons/v2/radio-checked-secondary.svg'
import RadioUncheckedPrimaryIcon from '@/assets/icons/v2/radio-unchecked-primary.svg'
import RadioUncheckedSecondaryIcon from '@/assets/icons/v2/radio-unchecked-secondary.svg'
import ReplayIcon from '@/assets/icons/v2/replay.svg'
import SearchActiveIcon from '@/assets/icons/v2/search-active.svg'
import SearchIcon from '@/assets/icons/v2/search.svg'
import ShareIcon from '@/assets/icons/v2/share.svg'
import TicketFilledIcon from '@/assets/icons/v2/ticket-filled.svg'
import TicketIcon from '@/assets/icons/v2/ticket.svg'
import UserCheckIcon from '@/assets/icons/v2/user-check.svg'

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
	place: Place,
	pin: PinIcon,
	time: TimeIcon,
	arrowRight: ArrowRightIcon,
	close: CloseIcon,
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
	marker: MarkerIcon,
	radioChecked: RadioCheckedIcon,
	radioUnchecked: RadioUncheckedIcon,
	// v2
	home: HomeIcon,
	ticket: TicketIcon,
	qrCode: QRCodeIcon,
	myPage: MyPageIcon,
	heartLine: HeartLineIcon,
	heartFill: HeartFillIcon,
	bell: BellIcon,
	bellPin: BellPinIcon,
	map: MapIcon,
	userCheck: UserCheckIcon,
	chevronDown: ChevronDownIcon,
	chevronLeft: ChevronLeftIcon,
	chevronRight: ChevronRightIcon,
	chevronUp: ChevronUpIcon,
	addTicket: AddTicketIcon,
	share: ShareIcon,
	minus: MinusIcon,
	plus: PlusIcon,
	calendarAdd: CalendarAddIcon,
	follow: FollowIcon,
	radioCheckedPrimary: RadioCheckedPrimaryIcon,
	radioCheckedSecondary: RadioCheckedSecondaryIcon,
	radioUncheckedPrimary: RadioUncheckedPrimaryIcon,
	radioUncheckedSecondary: RadioUncheckedSecondaryIcon,
	myLocation: MyLocationIcon,
	replay: ReplayIcon,
	mapPin: MapPinIcon,
	northEast: NorthEastIcon,
	google: GoogleIcon,
	googleGray: GoogleGrayIcon,
	extend: ExtendIcon,
	homeFilled: HomeFilledIcon,
	myPageFilled: MyPageFilledIcon,
	ticketFilled: TicketFilledIcon,
	searchActive: SearchActiveIcon,
	qrCodeActive: QrCodeActiveIcon,
	mapPinLine: MapPinLineIcon,
	mapPinFilled: MapPinFilledIcon
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
