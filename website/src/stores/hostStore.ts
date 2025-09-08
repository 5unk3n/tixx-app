import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface HostState {
	hostId: number | null
	setHostId: (hostId: number) => void
	clearHostId: () => void
}

export const useHostStore = create<HostState>()(
	persist(
		(set) => ({
			hostId: null,
			setHostId: (hostId) => set({ hostId }),
			clearHostId: () => set({ hostId: null })
		}),
		{ name: 'host', storage: createJSONStorage(() => localStorage) }
	)
)
