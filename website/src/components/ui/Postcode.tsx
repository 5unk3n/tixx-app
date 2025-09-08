import {
	DaumPostcodeEmbedProps,
	DaumPostcodeEmbed,
	Address
} from 'react-daum-postcode'

import { cn } from '@/lib/utils'

interface PostcodeProps extends DaumPostcodeEmbedProps {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	onSelect: (address: string) => void
}

export default function Postcode({
	isOpen,
	setIsOpen,
	className,
	onSelect,
	...props
}: PostcodeProps) {
	const handleComplete = (address: Address) => {
		const fullAddress = address.address
		onSelect(fullAddress)
	}

	return (
		isOpen && (
			<DaumPostcodeEmbed
				className={cn('border', className)}
				onClose={() => setIsOpen(false)}
				{...props}
				onComplete={handleComplete}
			/>
		)
	)
}
