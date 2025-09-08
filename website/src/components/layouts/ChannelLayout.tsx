import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router'

import Footer from './Footer'
import Header from './Header'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider
} from '../ui/sidebar'

import { cn } from '@/lib/utils'

const menuItems = [
	{
		titleKey: 'channel.menu.overview',
		url: '/channel/overview'
	},
	{
		titleKey: 'channel.menu.settings',
		url: '/channel/settings'
	},
	{
		titleKey: 'channel.menu.settlement',
		url: '/channel/settlement'
	}
]

export default function ChannelLayout() {
	const { pathname } = useLocation()
	const { t } = useTranslation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return (
		<div className="flex min-h-svh flex-col">
			<SidebarProvider className="flex flex-col">
				<Header />
				<ul
					className={cn(
						'sticky top-[105px] z-50 flex bg-grayscale-0 text-body-1 font-regular text-grayscale-500',
						'md:hidden',
						'text-center *:flex-1 *:*:py-3'
					)}
				>
					{menuItems.map((item) => (
						<li
							key={item.titleKey}
							className={cn(
								pathname.includes(item.url) && 'border-b border-primary-500'
							)}
						>
							<Link
								to={item.url}
								className={cn(
									'inline-block w-full hover:text-grayscale-700 active:text-grayscale-900',
									pathname.includes(item.url) && 'text-primary-500'
								)}
							>
								{t(item.titleKey)}
							</Link>
						</li>
					))}
				</ul>
				<div className="flex flex-1">
					<Sidebar className="top-[70px] w-[363px] *:bg-transparent">
						<SidebarContent className="px-10 py-14">
							<SidebarGroup>
								<SidebarMenu className="">
									{menuItems.map((item) => (
										<SidebarMenuItem key={item.titleKey}>
											<SidebarMenuButton
												className={cn(
													'h-[52px] rounded-lg pl-9 text-heading-2 font-regular text-grayscale-600 hover:text-grayscale-700',
													pathname.includes(item.url) &&
														'bg-grayscale-100 font-semibold text-grayscale-900'
												)}
												asChild
											>
												<Link to={item.url}>{t(item.titleKey)}</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroup>
						</SidebarContent>
					</Sidebar>
					<div className="flex flex-1 flex-col">
						<main className="flex-1">
							<Outlet />
						</main>
						<Footer />
					</div>
				</div>
			</SidebarProvider>
		</div>
	)
}
