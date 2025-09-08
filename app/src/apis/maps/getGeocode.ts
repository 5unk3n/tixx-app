import { NCP_CLIENT_ID, NCP_CLIENT_SECRET } from '@env'
import axios from 'axios'

export type GeocodeParams = {
	query: string
	coordinate: string
}

type GeocodeResponse = {
	addresses: {
		englishAddress: string
	}[]
}

const NAVER_GEOCODE_URL = 'https://maps.apigw.ntruss.com/map-geocode/v2/geocode'

export const getGeocode = async (params: GeocodeParams) => {
	const response = await axios.get(NAVER_GEOCODE_URL, {
		headers: {
			'x-ncp-apigw-api-key-id': NCP_CLIENT_ID,
			'x-ncp-apigw-api-key': NCP_CLIENT_SECRET
		},
		params
	})

	return response.data as GeocodeResponse
}
