const grayscale = {
	b: '#121212',
	1: '#1B1B1B',
	2: '#2F2F30',
	3: '#585858',
	4: '#7E7D7D',
	5: '#A0A2A2',
	6: '#C1C1C2',
	7: '#DCDCDC',
	8: '#EDEDED',
	w: '#FFFFFF'
}

const point = {
	1: '#88012C',
	2: '#BB013C',
	3: '#FF0859',
	4: '#FE709D',
	5: '#FFBCD0',
	'5a12': 'rgba(255, 188, 208, 0.12)'
}

const brandColors = {
	naver: '#03C75A',
	kakao: '#FEE500',
	apple: '#FFFFFF'
}

const colors = {
	grayscale,
	point,
	brandColors
}

const customMd3DarkColors = {
	primary: point[3],
	onPrimary: grayscale.w,

	secondary: grayscale[2],
	onSecondary: grayscale[5],

	background: grayscale.b,
	onBackground: grayscale.w,

	surface: grayscale.b,
	onSurface: grayscale.w,
	surfaceVariant: grayscale[1],
	onSurfaceVariant: grayscale[8],
	surfaceDisabled: grayscale[2],
	onSurfaceDisabled: grayscale[5],

	error: point[3]
}

const semanticColors = {
	success: '#4EFF2E'
}

module.exports = {
	colors,
	customMd3DarkColors,
	semanticColors
}
