import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
	extend: {
		theme: {
			text: [
				'display-1',
				'display-2',
				'title-1',
				'title-2',
				'title-3',
				'heading-1',
				'heading-2',
				'headline-1',
				'headline-2',
				'body-1',
				'body-2',
				'label-1',
				'label-2',
				'caption-1',
				'caption-2'
			],
			'font-weight': ['regular', 'medium', 'semibold']
		}
	}
})

export function cn(...inputs: ClassValue[]) {
	return customTwMerge(clsx(inputs))
}
