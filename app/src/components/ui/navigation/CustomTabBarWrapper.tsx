import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React from 'react'

import CustomTabBar from './CustomTabBar'

export default function CustomTabBarWrapper(props: BottomTabBarProps) {
	return <CustomTabBar {...props} />
}
