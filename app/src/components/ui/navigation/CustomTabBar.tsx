import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { TabNavigationState } from '@react-navigation/native'
import React, { useState } from 'react'
import { Platform, View } from 'react-native'

import QRDialog from '@/components/users/QRDialog'
import { MainTabParamList } from '@/types/navigation'

import CustomIconButton from '../input/CustomIconButton'

const iconMap = {
	Home: 'home',
	MyPage: 'profile'
} as const

interface CustomTabBarProps extends BottomTabBarProps {}

export default function CustomTabBar({
	state,
	descriptors,
	navigation
}: CustomTabBarProps) {
	const [visible, setVisible] = useState(false)

	const onQrPress = () => {
		setVisible(true)
	}

	const bottomPosition = Platform.OS === 'ios' ? 'bottom-0' : 'bottom-6'

	return (
		<View className={`absolute w-[236] h-16 self-center ${bottomPosition}`}>
			<View className="flex-row justify-center items-center bg-surfaceVariant rounded-[36px] overflow-hidden">
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
						}

						return (
							<CustomIconButton
								key={index}
								name={`${iconMap[route.name]}${isFocused ? 'Active' : ''}`}
								onPress={onPress}
								className="m-0 w-[138] h-16"
								style={{ borderRadius: 0 }}
								accessibilityRole="button"
								accessibilityState={isFocused ? { selected: true } : {}}
								accessibilityLabel={options.tabBarAccessibilityLabel}
							/>
						)
					}
				)}
			</View>
			<View className="absolute w-full bottom-0" pointerEvents="box-none">
				<CustomIconButton
					name="qr"
					onPress={onQrPress}
					className="w-16 h-16 mx-auto bottom-5 rounded-full bg-primary"
				/>
			</View>
			<QRDialog visible={visible} onDismiss={() => setVisible(false)} />
		</View>
	)
}
