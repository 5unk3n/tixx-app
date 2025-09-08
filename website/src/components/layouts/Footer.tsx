import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

import TixxSymbol from '@/assets/icons/tixx-symbol.svg'
import TixxWordmark from '@/assets/icons/tixx-wordmark.svg'

export default function Footer() {
	const { t } = useTranslation()
	return (
		<footer className="flex flex-col justify-center bg-[#F7F7F7]">
			<div className="mx-auto flex flex-wrap gap-[60px] p-[60px]">
				<div className="flex items-center self-start">
					<img
						src={TixxSymbol}
						alt="Tixx Symbol"
						width={49}
						height={33}
						className="mr-[10px] h-[33px] w-[49px] object-cover"
					/>
					<img
						src={TixxWordmark}
						alt="Tixx Wordmark"
						width={68}
						height={17}
						className="h-[17px] w-[68px] object-cover"
					/>
				</div>
				<div>
					<p className="text-body-1 font-bold">TiXX</p>
					<div className="mt-2 text-label-1 font-regular text-grayscale-600">
						<p>COMPANY. 아비치</p>
						<p>OWNER. 김휘진</p>
						<p>{t('footer.businessNumber')}</p>
					</div>
				</div>
				<div>
					<p className="text-body-1 font-bold">{t('footer.contactUs')}</p>
					<div className="mt-2 text-label-1 font-regular text-grayscale-600">
						<p>
							{t('footer.email')}{' '}
							<a
								href="mailto:tixxofficial@tixx.im"
								className="underline underline-offset-2"
							>
								tixxofficial@tixx.im
							</a>
						</p>
						<p>{t('footer.tel')}</p>
						<div className="mt-2 flex justify-center">
							<Button
								size={'sm'}
								type="button"
								variant={'grayLine'}
								className="mx-auto border-none shadow-[0_1px_4px_rgb(0,0,0,0.25),0_1px_4px_rgb(0,1,0,0.1)]"
								asChild
							>
								<Link to={'/inquiry'}>{t('footer.inquiry')}</Link>
							</Button>
						</div>
					</div>
				</div>
				<div>
					<p className="text-body-1 font-bold">{t('footer.support')}</p>
					<div className="mt-2 text-label-1 font-regular text-grayscale-600">
						<a
							href="https://chemical-egg-b86.notion.site/TIXX-1f1af5a3ef158037b709c11e05b1d2c8?pvs=4"
							target="_blank"
							rel="noopener noreferrer"
							className="block"
						>
							{t('footer.terms')}
						</a>
						<a
							href="https://chemical-egg-b86.notion.site/TIXX-1d5af5a3ef1580cd9f26d9f4ed7a75ae?pvs=4"
							target="_blank"
							rel="noopener noreferrer"
							className="block"
						>
							{t('footer.refund')}
						</a>
					</div>
				</div>
				<div>
					<p className="text-body-1 font-bold">{t('footer.social')}</p>
					<div className="mt-2 text-label-1 font-regular text-grayscale-600">
						<a
							href="https://www.instagram.com/tixx.official/"
							target="_blank"
							rel="noopener noreferrer"
							className="block"
						>
							{t('footer.instagram')}
						</a>
					</div>
				</div>
			</div>
			<Separator orientation="horizontal" />
			<p className="my-[18px] text-center text-label-1 font-regular text-grayscale-500">
				{t('footer.copyright')}
			</p>
		</footer>
	)
}
