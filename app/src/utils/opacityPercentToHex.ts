/**
 * 퍼센트(%) 값을 16진수 불투명도 값으로 변환
 * @param percent 0~100 사이의 숫자
 * @returns 투명도에 해당하는 16진수 문자열 (예: 'FF', '80', '00')
 */
export const opacityPercentToHex = (percent: number) => {
	if (percent < 0 || percent > 100) {
		throw new Error('불투명도는 0에서 100 사이의 숫자여야 합니다.')
	}

	const alphaDecimal = Math.round((percent / 100) * 255)
	const hex = alphaDecimal.toString(16).toUpperCase().padStart(2, '0')

	return hex
}
