import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface AuthState {
	accessToken: string | null
	setToken: (token: string) => void
	clearToken: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			accessToken: null,
			setToken: (token) => set({ accessToken: token }),
			clearToken: () => set({ accessToken: null })
		}),
		{ name: 'token', storage: createJSONStorage(() => localStorage) }
	)
)
