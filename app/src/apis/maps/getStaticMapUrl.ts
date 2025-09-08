export type StaticMapParams = {
	center: string
	level?: string
	w: string
	h: string
	format?: 'jpg/jpeg' | 'png8' | 'png'
	scale?: '1' | '2'
	markers?: string
	lang?: string
}

const NAVER_MAP_URL = 'https://maps.apigw.ntruss.com/map-static/v2/raster'

export const getStaticMapUrl = (params: StaticMapParams) => {
	const queryString = new URLSearchParams({
		level: '14',
		format: 'jpg/jpeg',
		scale: '2',
		// markers: `pos:${params.center}`,
		...params
	} satisfies StaticMapParams).toString()
	return `${NAVER_MAP_URL}?${queryString}`
}
