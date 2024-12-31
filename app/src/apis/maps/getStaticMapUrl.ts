type Params = {
	center: string
	level?: string
	w: string
	h: string
	format?: 'jpg/jpeg' | 'png8' | 'png'
	scale?: '1' | '2'
	markers?: string
}

const NAVER_MAP_URL =
	'https://naveropenapi.apigw.ntruss.com/map-static/v2/raster'

export const getStaticMapUrl = (params: Params) => {
	const queryString = new URLSearchParams({
		level: '14',
		format: 'jpg/jpeg',
		scale: '2',
		// markers: `pos:${params.center}`,
		...params
	} satisfies Params).toString()
	return `${NAVER_MAP_URL}?${queryString}`
}
