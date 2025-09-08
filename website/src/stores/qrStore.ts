import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface QRState {
	currentCameraId: string | null
	setCurrentCameraId: (id: string | null) => void
}

export const useQRStore = create<QRState>()(
	persist(
		(set) => ({
			// FIXME: 카메라 아이디는 브라우저 껐다 켜면 다름. index로 변경?
			currentCameraId: null,
			setCurrentCameraId: (id) => set({ currentCameraId: id })
		}),
		{ name: 'qr', storage: createJSONStorage(() => localStorage) }
	)
)
