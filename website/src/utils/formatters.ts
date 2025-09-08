import {
	differenceInDays,
	differenceInSeconds,
	format,
	startOfDay
} from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import {
	AsYouType,
	CountryCode,
	ParseError,
	parsePhoneNumberWithError
} from 'libphonenumber-js'

/**
 * 사용자가 입력하는 대로 전화번호 형식을 지정합니다. (예: 01012345678 -> 010-1234-5678)
 * @param phoneNumber - 사용자가 입력한 전화번호 문자열입니다.
 * @param defaultCountry - 기본 국가 코드로, 기본값은 'KR'(대한민국)입니다.
 * @returns 형식이 지정된 전화번호 문자열을 반환합니다.
 */
export const formatPhoneNumberOnTyping = (
	phoneNumber: string,
	defaultCountry: CountryCode = 'KR'
) => {
	const asYouType = new AsYouType(defaultCountry)
	return asYouType.input(phoneNumber)
}

/**
 * 전화번호에서 숫자 이외의 문자를 모두 제거하고, 국가 번호 '82'로 시작하는 경우 '0'으로 변환합니다.
 * @param phone - 정규화할 전화번호 문자열입니다.
 * @returns 정규화된 전화번호 문자열을 반환합니다.
 */
export const normalizePhone = (phone: string) => {
	const digits = phone.replace(/\D/g, '')

	if (digits.startsWith('82')) {
		return '0' + digits.slice(2)
	}

	return digits
}

/**
 * libphonenumber-js를 사용하여 전화번호를 국내 형식(NATIONAL)으로 변환합니다.
 * @param phone - 변환할 전화번호 문자열입니다.
 * @returns 변환된 전화번호 문자열을 반환하며, 파싱 실패 시 원본 문자열을 반환합니다.
 */
export const formatPhone = (phone: string) => {
	try {
		const parsedPhone = parsePhoneNumberWithError(phone).format('NATIONAL')
		return parsedPhone
	} catch (error) {
		if (error instanceof ParseError) {
			console.error('Failed to parse phone number:', error.message)
		}
		return phone
	}
}

/**
 * 생년월일 문자열에서 숫자 이외의 문자를 모두 제거하여 'YYYYMMDD' 형식으로 만듭니다.
 * @param birth - 변환할 생년월일 문자열입니다.
 * @returns 'YYYYMMDD' 형식의 문자열을 반환합니다.
 */
export const formatDateToYYYYMMDD = (birth: string) => {
	return birth.replace(/\D/g, '')
}

/**
 * 'YYYYMMDD' 형식의 문자열을 'YYYY.MM.DD' 형식으로 변환합니다.
 * @param YYYYMMDD - 변환할 'YYYYMMDD' 형식의 문자열입니다.
 * @returns 'YYYY.MM.DD' 형식의 문자열을 반환합니다.
 */
export const formatDateWithPoint = (YYYYMMDD: string) => {
	return YYYYMMDD.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
}

/**
 * 만료 시간까지 남은 시간을 '분:초' 형식으로 계산하여 반환합니다.
 * @param expiredAt - 만료 시간을 나타내는 Date 객체 또는 문자열입니다.
 * @returns 남은 시간을 'MM:SS' 형식의 문자열로 반환합니다.
 */
export const formatRemainingTime = (expiredAt: Date | string) => {
	const now = new Date()
	const remainingSeconds = differenceInSeconds(expiredAt, now)

	const minutes = Math.floor(remainingSeconds / 60)
	const seconds = remainingSeconds % 60

	return `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`
}

/**
 * 날짜 문자열을 '년.월.일(요일)' 형식으로 변환합니다.
 * @param dateString - 변환할 날짜 문자열입니다.
 * @param locale - 로캘 문자열 ('ko' 또는 'en')입니다.
 * @returns 'YYYY.MM.DD(E)' 형식의 문자열을 반환합니다.
 */
export const formatDateWithDay = (dateString: string, locale: string) => {
	const selectedLocale = locale === 'ko' ? ko : enUS

	return format(dateString, 'yyyy.MM.dd(E)', {
		locale: selectedLocale
	})
}

/**
 * 시작 시간과 종료 시간을 'HH:mm' 형식으로 변환합니다.
 * @param startAt - 시작 시간을 나타내는 문자열입니다.
 * @param endAt - 종료 시간을 나타내는 문자열입니다.
 * @returns 시작 시간과 종료 시간을 포함하는 객체를 반환합니다.
 */
export const formatTimeRange = (startAt: string, endAt: string) => {
	const startTime = format(startAt, 'HH:mm')
	const endTime = format(endAt, 'HH:mm')

	return { startTime, endTime }
}

/**
 * 목표 날짜까지의 D-Day를 계산합니다.
 * @param targetDate - 목표 날짜 문자열 (예: 'YYYY-MM-DD')
 * @param targetTime - 목표 시간 문자열 (예: 'HH:MM:SS')
 * @returns D-Day 문자열 (예: 'D-Day', 'D-7', 'D+3')을 반환합니다.
 */
export const formatDDay = (targetDate: string, targetTime: string) => {
	const targetLocalDate = new Date(`${targetDate}T${targetTime}Z`)
	const diff = differenceInDays(
		startOfDay(targetLocalDate),
		startOfDay(new Date())
	)
	const dDay = diff === 0 ? 'D-Day' : diff > 0 ? `D-${diff}` : `D+${-diff}`
	return dDay
}
