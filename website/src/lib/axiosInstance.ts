import axios from 'axios'

import { useAuthStore } from '@/stores/authStore'

export const BASE_URL = import.meta.env.DEV
	? '/api'
	: import.meta.env.VITE_PROD_URL

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	}
})

axiosInstance.interceptors.request.use(async (config) => {
	const { accessToken } = useAuthStore.getState()

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
})

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response) {
			if (error.response.status === 401) {
				useAuthStore.getState().clearToken()
			}

			console.error('Error Status:', error.response.status)
			console.error('Error Data:', error.response.data)
		} else if (error.request) {
			console.error('No Response Received:', error.request)
		} else {
			console.error('Request Error:', error.message)
		}
		console.error('Error Config:', error.config)

		throw error
	}
)

export default axiosInstance
