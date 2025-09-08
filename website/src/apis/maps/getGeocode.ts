import axios from 'axios'

export type GeocodeParams = {
	query: string
}

type GeocodeResponse = {
	documents: { x: string; y: string }[]
}

const KAKAO_GEOCODE_URL = 'https://dapi.kakao.com/v2/local/search/address.json'

export const getGeocode = async (params: GeocodeParams) => {
	const response = await axios.get(KAKAO_GEOCODE_URL, {
		headers: {
			Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`
		},
		params
	})
	return response.data as GeocodeResponse
}
