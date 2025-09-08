import { create } from 'zustand'

import { OAuthProvider, SignUpInput } from '@/types'

type SignUpData = Omit<SignUpInput, 'nickname'>

interface SignUpState {
	accessToken: string
	birthYYYYMMDD: string | null
	email: string
	marketingOptIn: number
	name: string
	phone: string
	provider: OAuthProvider
	verified: number
	fcmToken: string | null
	setOAuthData: (data: Partial<SignUpData>) => void
	reset: () => void
}

// FIXME: 사용하는 곳에서 부분만 구독하도록 변경
// FIXME: 타입 불일치 수정
export const useSignUpStore = create<SignUpState>((set) => ({
	accessToken: '',
	birthYYYYMMDD: null,
	email: '',
	marketingOptIn: 0,
	name: '',
	phone: '',
	verified: 0,
	provider: 'none' as OAuthProvider,
	setOAuthData: (data) => set(data),
	reset: () =>
		set({
			birthYYYYMMDD: null,
			email: '',
			marketingOptIn: 0,
			name: '',
			phone: '',
			verified: 0,
			provider: 'none' as OAuthProvider
		})
}))
