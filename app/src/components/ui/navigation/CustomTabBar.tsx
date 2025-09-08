import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { TabNavigationState } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'

import { useCustomTheme } from '@/hooks/useCustomTheme'
import { useHomeTabStore } from '@/stores/homeTabStore'
import { MainTabParamList } from '@/types/navigation'

import CustomIconButton from '../input/CustomIconButton'

const iconMap = {
	Home: 'home',
	Tickets: 'ticket',
	QRCode: 'qrCode',
	MyPage: 'myPage',
	Search: 'search',
	HomeActive: 'homeFilled',
	TicketsActive: 'ticketFilled',
	QRCodeActive: 'qrCodeActive',
	MyPageActive: 'myPageFilled',
	SearchActive: 'searchActive'
} as const

interface CustomTabBarProps extends BottomTabBarProps {}

export default function CustomTabBar({
	state,
	descriptors,
	navigation
}: CustomTabBarProps) {
	const { colors } = useCustomTheme()
	const { setCurrentTab } = useHomeTabStore()

	return (
		<View className="absolute w-full h-[50] self-center bottom-0 flex-row items-center bg-background overflow-hidden">
			{(state as TabNavigationState<MainTabParamList>).routes.map(
				(route, index) => {
					const { options } = descriptors[route.key]

					const isFocused = state.index === index

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true
						})

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name, route.params)
						}
						if (route.name === 'Home') {
							setCurrentTab(null)
						}
					}

					return (
						<CustomIconButton
							key={index}
							name={
								iconMap[
									isFocused ? (`${route.name}Active` as const) : route.name
								]
							}
							onPress={onPress}
							size={route.name === 'QRCode' ? 25 : 28}
							className="flex-1 h-[50] mx-0 rounded-none"
							iconColor={isFocused ? colors.primary : colors.grayscale[0]}
							rippleColor={'transparent'}
							accessibilityRole="button"
							accessibilityState={isFocused ? { selected: true } : {}}
							accessibilityLabel={options.tabBarAccessibilityLabel}
						/>
					)
				}
			)}
		</View>
	)
}
