import { differenceInDays, format, startOfDay } from 'date-fns'
import { ko, enUS } from 'date-fns/locale'
import { ParseError, parsePhoneNumberWithError } from 'libphonenumber-js'

export const normalizePhone = (phone: string) => {
	const digits = phone.replace(/\D/g, '')

	if (digits.startsWith('82')) {
		return '0' + digits.slice(2)
	}

	return digits
}

export const formatPhone = (phone: string) => {
	try {
		const parsedPhone = parsePhoneNumberWithError(phone)
			.format('NATIONAL')
			.replaceAll('-', ' ')
		return parsedPhone
	} catch (error) {
		if (error instanceof ParseError) {
			console.error('Failed to parse phone number:', error.message)
		}
		return phone
	}
}

export const formatDateToYYYYMMDD = (birth: string) => {
	return birth.replace(/\D/g, '')
}

export const formatDateWithPoint = (YYYYMMDD: string) => {
	return YYYYMMDD.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')
}

export const formatDateWithDay = (dateString: string, locale: string) => {
	const selectedLocale = locale === 'ko' ? ko : enUS

	return format(dateString, 'yyyy.MM.dd(E)', {
		locale: selectedLocale
	})
}

export const formatTimeRange = (startAt: string, endAt: string) => {
	const startTime = format(startAt, 'HH:mm')
	const endTime = format(endAt, 'HH:mm')

	return { startTime, endTime }
}

export const formatDDay = (targetDay: string) => {
	const diff = differenceInDays(startOfDay(targetDay), startOfDay(new Date()))
	const dDay = diff === 0 ? 'D-Day' : diff > 0 ? `D-${diff}` : `D+${-diff}`
	return dDay
}
