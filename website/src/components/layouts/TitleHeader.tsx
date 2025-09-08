import { useNavigate } from 'react-router'

import Back from '@/assets/icons/chevron-left.svg?react'

interface EventsHeaderProps {
	title?: string
	showBack?: boolean
}

export default function TitleHeader({
	title,
	showBack = true
}: EventsHeaderProps) {
	const navigate = useNavigate()

	return (
		<header className="sticky top-0 z-50 flex h-[52px] items-center justify-between bg-grayscale-0 px-3 py-3 md:h-[60px] md:px-9 md:shadow-[0_2px_20px_rgb(0,0,0,0.08)]">
			{showBack && (
				<Back
					onClick={() => navigate('/')}
					className="z-10 mr-9 w-11 cursor-pointer"
				/>
			)}
			{title && (
				<p className="absolute left-0 w-full flex-1 text-center text-body-1 font-medium md:static md:text-left md:text-headline-1">
					{title}
				</p>
			)}
		</header>
	)
}
