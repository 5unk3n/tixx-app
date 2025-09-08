import { create } from 'zustand'

const tabs = ['today', 'thisWeek', 'calendar', 'venue', 'hot'] as const
export type HomeTabType = (typeof tabs)[number] | null

interface HomeTabState {
	currentTab: HomeTabType
	setCurrentTab: (tab: HomeTabType) => void
}

export const useHomeTabStore = create<HomeTabState>((set) => ({
	currentTab: null,
	setCurrentTab: (tab) => set({ currentTab: tab })
}))
