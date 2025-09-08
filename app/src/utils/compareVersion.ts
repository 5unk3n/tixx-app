/**
 * 두 버전 문자열(v1, v2)을 비교합니다.
 *
 * @param {string} v1 - 비교할 첫 번째 버전 (예: '1.2.3')
 * @param {string} v2 - 비교할 두 번째 버전 (예: '1.2.0')
 * @returns {number} v1 > v2: 1, v1 < v2: -1, v1 === v2: 0
 *
 * @example
 * compareVersion('1.2.3', '1.2.0') // 1
 * compareVersion('1.2.0', '1.2.3') // -1
 * compareVersion('1.2.0', '1.2.0') // 0
 */
export const compareVersion = (v1: string, v2: string) => {
	const a = v1.split('.').map(Number)
	const b = v2.split('.').map(Number)
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		const n1 = a[i] || 0
		const n2 = b[i] || 0
		if (n1 > n2) return 1
		if (n1 < n2) return -1
	}
	return 0
}
