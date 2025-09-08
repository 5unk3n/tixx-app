import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
	MainTabHeader,
	MyPageHeader
} from '@/components/ui/navigation/BottomTabHeader'
import CustomTabBarWrapper from '@/components/ui/navigation/CustomTabBarWrapper'
import HomeScreen from '@/screens/mainTab/HomeScreen'
import MyPageScreen from '@/screens/mainTab/MyPageScreen'
import QRCodeScreen from '@/screens/mainTab/QRCodeScreen'
import SearchScreen from '@/screens/mainTab/SearchScreen'
import TicketsScreen from '@/screens/mainTab/TicketsScreen'
import { MainTabParamList } from '@/types/navigation'

const MainTab = createBottomTabNavigator<MainTabParamList>()

export default function MainTabNavigator() {
	const { t } = useTranslation()

	return (
		<MainTab.Navigator initialRouteName="Home" tabBar={CustomTabBarWrapper}>
			<MainTab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					header: MainTabHeader
				}}
			/>
			<MainTab.Screen
				name="Tickets"
				component={TicketsScreen}
				options={{
					header: MainTabHeader
				}}
			/>
			<MainTab.Screen
				name="QRCode"
				component={QRCodeScreen}
				options={{
					header: MainTabHeader
				}}
			/>
			<MainTab.Screen
				name="Search"
				component={SearchScreen}
				options={{
					header: () => null
				}}
			/>
			<MainTab.Screen
				name="MyPage"
				component={MyPageScreen}
				options={{
					header: MyPageHeader,
					title: t('navigation.myPage')
				}}
			/>
		</MainTab.Navigator>
	)
}
