const grayscale = {
	0: '#FFFFFF',
	100: '#EDEDED',
	200: '#DCDCDC',
	300: '#C1C1C2',
	400: '#A0A2A2',
	500: '#7E7D7D',
	600: '#585858',
	700: '#2F2F30',
	800: '#1B1B1B',
	900: '#000000'
}

const point = {
	100: '#FEFFF4',
	200: '#FCFDDC',
	300: '#FAFCC4',
	400: '#F6FA93',
	500: '#F2F862',
	600: '#EEF631',
	700: '#E1EA0A',
	800: '#C9D109',
	900: '#B2B908'
}

const brandColors = {
	naver: '#03C75A',
	kakao: '#FEE500',
	apple: '#FFFFFF',
	google: '#FFFFFF'
}

const colors = {
	grayscale,
	point,
	brandColors
}

const customMd3DarkColors = {
	primary: point[500],
	onPrimary: grayscale[0],

	secondary: grayscale[700],
	onSecondary: grayscale[400],

	background: grayscale[900],
	onBackground: grayscale[0],

	backdrop: grayscale[900] + '99',

	surface: grayscale[900],
	onSurface: grayscale[0],
	surfaceVariant: grayscale[800],
	onSurfaceVariant: grayscale[100],
	surfaceDisabled: grayscale[700],
	onSurfaceDisabled: grayscale[400],

	error: point[500]
}

const semanticColors = {
	success: '#4EFF2E'
}

module.exports = {
	colors,
	customMd3DarkColors,
	semanticColors
}
