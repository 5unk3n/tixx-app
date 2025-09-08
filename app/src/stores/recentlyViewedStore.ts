import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { RECENTLY_VIEWED_KEY } from '@/constants/storeKey'
import { Events } from '@/types'

type RecentlyViewedItem = Events['items'][number]

type RecentlyViewedState = {
	items: RecentlyViewedItem[]
	add: (item: RecentlyViewedItem) => void
	clear: () => void
	remove: (id: number) => void
}

const MAX_RECENTLY_VIEWED = 7

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
	persist(
		(set, get) => ({
			items: [],
			add: (item) => {
				const current = get().items
				const updated = [
					item,
					...current.filter((i) => i.id !== item.id)
				].slice(0, MAX_RECENTLY_VIEWED)
				set({ items: updated })
			},
			clear: () => set({ items: [] }),
			remove: (id: number) =>
				set({
					items: get().items.filter((i) => i.id !== id)
				})
		}),
		{
			name: RECENTLY_VIEWED_KEY,
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)
