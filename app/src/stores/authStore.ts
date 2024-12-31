import { create } from 'zustand'

import { getUser } from '@/apis/users/getUser'
import { TOKEN_KEY } from '@/constants/storeKey'
import { OAuthProvider } from '@/types'
import { queryClient } from '@/utils/queryClient'
import { secureStorage } from '@/utils/secureStorage'

interface AuthState {
	isAuthenticated: boolean
	recentLoginProvider: OAuthProvider | null
	login: (token: string, provider: OAuthProvider) => Promise<void>
	logout: () => Promise<void>
	initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
	isAuthenticated: false,
	recentLoginProvider: null,
	login: async (token, provider) => {
		await secureStorage.set(TOKEN_KEY, token)
		set({ isAuthenticated: true, recentLoginProvider: provider })
	},
	logout: async () => {
		await secureStorage.remove(TOKEN_KEY)
		queryClient.clear()
		set({ isAuthenticated: false })
	},
	initializeAuth: async () => {
		try {
			const token = await secureStorage.get(TOKEN_KEY)
			if (token) {
				const user = await queryClient.fetchQuery({
					queryKey: ['user'],
					queryFn: getUser
				})
				if (user) {
					set({ isAuthenticated: true })
					return
				}
			}

			await secureStorage.remove(TOKEN_KEY)
			set({ isAuthenticated: false })
		} catch (error) {
			await secureStorage.remove(TOKEN_KEY)
			set({ isAuthenticated: false })
		}
	}
}))
