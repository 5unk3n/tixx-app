import {
	differenceInDays,
	differenceInSeconds,
	format,
	isSameDay,
	isSameYear,
	parse,
	parseISO
} from 'date-fns'
import { ko } from 'date-fns/locale'

export const normalizePhone = (phone: string) => {
	const digits = phone.replace(/\D/g, '')

	if (digits.startsWith('82')) {
		return '0' + digits.slice(2)
	}

	return digits
}

export const formatPhone = (phone: string) => {
	return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
}

export const formatDateToYYYYMMDD = (birth: string) => {
	return birth.replace(/\D/g, '')
}

export const formatDateWithPoint = (YYYYMMDD: string) => {
	return YYYYMMDD.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
}

export const formatRemainingTime = (expiredAt: Date | string) => {
	const now = new Date()
	let remainingSeconds = differenceInSeconds(expiredAt, now)

	const minutes = Math.floor(remainingSeconds / 60)
	const seconds = remainingSeconds % 60

	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`
}

export const formatEventDate = (startDate: string, endDate: string) => {
	const start = parseISO(startDate) // 시작 날짜를 Date 객체로 변환
	const end = parseISO(endDate) // 종료 날짜를 Date 객체로 변환

	// 날짜 형식: YYYY.MM.DD(요일)
	const formattedStartDate = format(start, 'yyyy.MM.dd(E)', { locale: ko })

	// 종료 날짜가 시작 날짜와 같은 경우 종료 날짜를 표시하지 않음
	if (isSameDay(start, end)) {
		return `${formattedStartDate} (1일간)`
	}

	// 연도가 같은 경우에는 연도를 생략한 형식, 연도가 다르면 연도까지 표시
	const formattedEndDate = isSameYear(start, end)
		? format(end, 'MM.dd(E)', { locale: ko })
		: format(end, 'yyyy.MM.dd(E)', { locale: ko })

	// 기간 계산 (시작일과 종료일 포함)
	const durationDays = differenceInDays(end, start) + 1

	// 최종 문자열 반환
	return `${formattedStartDate} - ${formattedEndDate} (${durationDays}일간)`
}

export const formatEventTime = (startTime: string, endTime: string) => {
	// 문자열 시간을 Date 객체로 변환 (임의 날짜로 파싱)
	const start = parse(startTime, 'HH:mm:ss', new Date())
	const end = parse(endTime, 'HH:mm:ss', new Date())

	// HH:mm 형식으로 변환
	const formattedStartTime = format(start, 'HH:mm')
	const formattedEndTime = format(end, 'HH:mm')

	// 최종 문자열 반환
	return `${formattedStartTime} - ${formattedEndTime}`
}

export const formatTicketDate = (startAt: string) => {
	const start = parseISO(startAt)

	const formattedStartDate = format(start, 'yyyy.MM.dd(E)', { locale: ko })

	return formattedStartDate
}

export const formatTicketTime = (startAt: string, endAt: string) => {
	const start = parseISO(startAt)
	const end = parseISO(endAt)

	const formattedStartTime = format(start, 'HH:mm')
	const formattedEndTime = format(end, 'HH:mm')

	return `${formattedStartTime} - ${formattedEndTime} 중 입장`
}
