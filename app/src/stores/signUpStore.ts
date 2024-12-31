import { create } from 'zustand'

import { OAuthProvider, SignUpInput } from '@/types'

type SignUpData = Omit<SignUpInput, 'nickname'>

interface SignUpState extends SignUpData {
	setOAuthData: (data: Partial<SignUpData>) => void
	reset: () => void
}

// FIXME: 사용하는 곳에서 부분만 구독하도록 변경
// FIXME: 타입 불일치 수정
export const useSignUpStore = create<SignUpState>((set) => ({
	accessToken: '',
	birthYYYYMMDD: '',
	email: '',
	marketingOptIn: 0,
	name: '',
	phone: '',
	provider: 'none' as OAuthProvider,
	setOAuthData: (data) => set(data),
	reset: () =>
		set({
			birthYYYYMMDD: '',
			email: '',
			marketingOptIn: 0,
			name: '',
			phone: '',
			provider: 'none' as OAuthProvider
		})
}))
