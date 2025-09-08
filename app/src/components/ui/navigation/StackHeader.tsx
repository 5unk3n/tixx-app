import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import React from 'react'

import CustomHeader from '@/components/ui/navigation/CustomHeader'

export function StaticHeader(props: NativeStackHeaderProps) {
	return <CustomHeader title={props.options.title} hasBack />
}

export function NearbyEventsHeader(props: NativeStackHeaderProps) {
	return (
		<CustomHeader
			title={props.options.title}
			hasBack
			hasMap
			hasAddTicket
			hasNotification
		/>
	)
}

export function HostFollowersHeader() {
	return <CustomHeader hasBack />
}

export function MyFollowingsHeader(props: NativeStackHeaderProps) {
	return <CustomHeader title={props.options.title} hasBack />
}

export function CheckProfileHeader(props: NativeStackHeaderProps) {
	return <CustomHeader {...props} title={props.options.title} hasBack />
}

export function VerifyIdentityHeader(props: NativeStackHeaderProps) {
	return <CustomHeader {...props} title={props.options.title} hasBack />
}
