import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '../ui/dropdown-menu'

import tixxSymbol from '@/assets/icons/tixx-symbol.svg'
import wordmark from '@/assets/icons/tixx-wordmark.svg'
import { useProfile } from '@/hooks/queries/clientUser/useProfile'
import { cn } from '@/lib/utils'

export default function Header() {
	const { data: profile } = useProfile()
	const { pathname } = useLocation()
	const { t, i18n } = useTranslation()

	return (
		<header className="sticky top-0 z-50 bg-grayscale-0 md:shadow-[0_2px_20px_rgb(0,0,0,0.08)]">
			<nav className="mx-auto flex max-w-[1200px] items-center px-5 py-4">
				<Link to="/">
					<img
						src={wordmark}
						width={84}
						height={28}
						alt={t('header.logo')}
						className="h-7 w-[84px] object-cover"
					/>
				</Link>
				{profile && (
					<>
						<ul
							className={cn(
								'ml-16 hidden gap-10 text-body-1 font-semibold text-grayscale-500 md:flex'
							)}
						>
							<li>
								<Link
									to={'/'}
									className={cn(
										'inline-block py-2 hover:text-grayscale-700 active:text-grayscale-900',
										pathname === '/' && 'text-grayscale-900'
									)}
								>
									{t('header.home')}
								</Link>
							</li>
							<li>
								<Link
									to={'/events/edit'}
									className={cn(
										'inline-block py-2 hover:text-grayscale-700 active:text-grayscale-900',
										pathname.startsWith('/events') && 'text-grayscale-900'
									)}
								>
									{t('header.eventManagement')}
								</Link>
							</li>
							<li>
								<Link
									to={'/channel/settings'}
									className={cn(
										'inline-block py-2 hover:text-grayscale-700 active:text-grayscale-900',
										pathname.startsWith('/channel') && 'text-grayscale-900'
									)}
								>
									{t('header.channelManagement')}
								</Link>
							</li>
						</ul>
						<div className="ml-auto flex flex-row items-center gap-5">
							{/* <Button
								variant="primaryLine"
								size="sm"
								onClick={toggleLanguage}
								className="text-sm"
							>
								{i18n.language === 'ko' ? 'EN' : 'KO'}
							</Button> */}
							<DropdownMenu>
								<DropdownMenuTrigger>Language</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={() => i18n.changeLanguage('ko')}>
										한국어
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>
										English
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<Link to={'/mypage'}>
								<div className="flex flex-row items-center gap-3">
									<span className="text-body-1 font-medium text-grayscale-500">
										{profile.companyName}
									</span>
									<Avatar className="h-[26px] w-[26px]">
										<AvatarImage
											src={tixxSymbol}
											className="p1 bg-grayscale-200"
										/>
										<AvatarFallback />
									</Avatar>
								</div>
							</Link>
							{/* TODO: 알림 기능 추가 */}
							{/* <BellDefault /> */}
						</div>
					</>
				)}
			</nav>
			{profile && (
				<ul
					className={cn(
						'flex text-body-1 font-regular text-grayscale-500',
						'md:hidden',
						'text-center *:flex-1 *:*:py-3'
					)}
				>
					<li className={cn(pathname === '/' && 'border-b border-primary-500')}>
						<Link
							to={'/'}
							className={cn(
								'inline-block w-full hover:text-grayscale-700 active:text-grayscale-900',
								pathname === '/' && 'text-primary-500'
							)}
						>
							{t('header.home')}
						</Link>
					</li>
					<li
						className={cn(
							pathname === '/event/create' && 'border-b border-primary-500'
						)}
					>
						<Link
							to={'/events/edit'}
							className={cn(
								'inline-block w-full hover:text-grayscale-700 active:text-grayscale-900',
								pathname === '/events/edit' && 'text-primary-500'
							)}
						>
							{t('header.eventManagement')}
						</Link>
					</li>
					<li>
						<Link
							to={'/channel/settings'}
							className={cn(
								'inline-block py-2 hover:text-grayscale-700 active:text-grayscale-900',
								pathname.startsWith('/channel') && 'text-grayscale-900'
							)}
						>
							{t('header.channelManagement')}
						</Link>
					</li>
				</ul>
			)}
		</header>
	)
}
