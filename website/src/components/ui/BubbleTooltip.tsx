import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

interface BubbleTooltipProps {
	children: React.ReactNode
	content: string
}

export default function BubbleTooltip({
	children,
	content
}: BubbleTooltipProps) {
	return (
		<Tooltip delayDuration={0}>
			<TooltipTrigger type="button" asChild>
				<span>{children}</span>
			</TooltipTrigger>
			<TooltipContent side="bottom" sideOffset={20} asChild>
				<div className="flex flex-col items-center rounded-none bg-transparent px-0 py-0">
					<div className="h-0 w-0 border-b-[12px] border-l-[7px] border-r-[7px] border-b-grayscale-100 border-l-transparent border-r-transparent" />
					<div className="rounded-lg bg-grayscale-100 px-4 py-2">
						<span className="text-caption-1 text-grayscale-600">{content}</span>
					</div>
				</div>
			</TooltipContent>
		</Tooltip>
	)
}
