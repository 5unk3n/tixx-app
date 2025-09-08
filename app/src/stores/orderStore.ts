import { create } from 'zustand'

import { Ticket } from '@/types'

interface OrderState {
	order: { ticket: Ticket; quantity: number } | null
	setOrder: (ticket: Ticket, quantity: number) => void
	clearOrder: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
	order: null,
	setOrder: (ticket: Ticket, quantity: number) =>
		set({ order: { ticket, quantity: Math.max(quantity, 1) } }),
	clearOrder: () => set({ order: null })
}))
