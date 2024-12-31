import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'

import CustomHeader from '@/components/ui/navigation/CustomHeader'
import CustomTabBar from '@/components/ui/navigation/CustomTabBar'
import { useUser } from '@/hooks/queries/useUser'
import HomeScreen from '@/screens/mainTab/HomeScreen'
import MyPageScreen from '@/screens/mainTab/MyPageScreen'
import { MainTabParamList } from '@/types/navigation'

const MainTab = createBottomTabNavigator<MainTabParamList>()

export default function MainTabNavigator() {
	const { data: user } = useUser()

	return (
		<MainTab.Navigator
			initialRouteName="Home"
			tabBar={(props) => <CustomTabBar {...props} />}
		>
			<MainTab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					header: () => <CustomHeader hasLogo hasNotification />
				}}
			/>
			<MainTab.Screen
				name="MyPage"
				component={MyPageScreen}
				options={{
					header: () => (
						<CustomHeader title={user?.nickname} hasEdit hasSettings />
					)
				}}
			/>
		</MainTab.Navigator>
	)
}
