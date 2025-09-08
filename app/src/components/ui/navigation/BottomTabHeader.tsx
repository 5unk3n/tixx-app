import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import React from 'react'

import CustomHeader from './CustomHeader'

export function MainTabHeader() {
	return <CustomHeader hasLogo hasMap hasAddTicket hasNotification />
}

export function MyPageHeader(props: BottomTabHeaderProps) {
	return <CustomHeader title={props.options.title} titleType="md" />
}
