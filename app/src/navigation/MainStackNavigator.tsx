import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import CustomHeader from '@/components/ui/navigation/CustomHeader'
import { NAVIGATION } from '@/constants/navigation'
import { useUser } from '@/hooks/queries/useUser'
import EventDetailScreen from '@/screens/main/events/EventDetailScreen'
import MapScreen from '@/screens/main/events/MapScreen'
import NotificationScreen from '@/screens/main/notifications/NotificationScreen'
import AccountDeletionScreen from '@/screens/main/settings/AccountDeletionScreen'
import FeedbackScreen from '@/screens/main/settings/FeedbackScreen'
import ProfileScreen from '@/screens/main/settings/ProfileScreen'
import SettingsScreen from '@/screens/main/settings/SettingsScreen'
import MyTicketsScreen from '@/screens/main/tickets/MyTicketsScreen'
import ReceivedTicketDetailScreen from '@/screens/main/tickets/ReceivedTicketDetailScreen'
import ReceivedTicketsScreen from '@/screens/main/tickets/ReceivedTicketsScreen'
import SentTicketDetailScreen from '@/screens/main/tickets/SentTicketDetailScreen'
import SentTicketsScreen from '@/screens/main/tickets/SentTicketsScreen'
import TicketShareScreen from '@/screens/main/tickets/TicketShareScreen'
import TransferCompletion from '@/screens/main/tickets/TransferCompletion'
import { MainStackParamList } from '@/types/navigation'

import MainTabNavigator from './MainTabNavigator'

const MainStack = createNativeStackNavigator<MainStackParamList>()

export default function MainStackNavigator() {
	const { data: user } = useUser()

	return (
		<MainStack.Navigator initialRouteName="MainTab">
			<MainStack.Screen
				name="MainTab"
				component={MainTabNavigator}
				options={{
					headerShown: false
				}}
			/>
			<MainStack.Screen
				name="EventDetail"
				component={EventDetailScreen}
				options={({ route }) => ({
					header: () => <CustomHeader title={route.params.name} hasBack />
				})}
			/>
			<MainStack.Screen
				name="TicketShare"
				component={TicketShareScreen}
				options={{
					header: () => <CustomHeader title={NAVIGATION.TICKET_SHARE} hasBack />
				}}
			/>
			<MainStack.Screen
				name="TransferCompletion"
				component={TransferCompletion}
				options={{
					header: () => (
						<CustomHeader title={NAVIGATION.TRANSFER_COMPLETION} hasBack />
					)
				}}
			/>
			<MainStack.Screen
				name="Notification"
				component={NotificationScreen}
				options={{
					header: () => <CustomHeader title={NAVIGATION.NOTIFICATION} hasBack />
				}}
			/>
			<MainStack.Screen
				name="MyTickets"
				component={MyTicketsScreen}
				options={{
					header: () => <CustomHeader title={NAVIGATION.MY_TICKETS} hasBack />
				}}
			/>
			<MainStack.Screen
				name="ReceivedTickets"
				component={ReceivedTicketsScreen}
				options={{
					header: () => (
						<CustomHeader title={NAVIGATION.RECEIVED_TICKETS} hasBack />
					)
				}}
			/>
			<MainStack.Screen
				name="SentTickets"
				component={SentTicketsScreen}
				options={{
					header: () => <CustomHeader title={NAVIGATION.SENT_TICKETS} hasBack />
				}}
			/>
			<MainStack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					header: () => <CustomHeader title={NAVIGATION.SETTINGS} hasBack />
				}}
			/>
			<MainStack.Screen
				name="Profile"
				component={ProfileScreen}
				options={({ route }) => ({
					header: () => (
						<CustomHeader
							title={
								// HACK: 정보수정 디자인 변경시 제목 수정 필요
								route.params.mode === 'view'
									? `${user?.nickname}${NAVIGATION.EDIT_PROFILE}`
									: NAVIGATION.EDIT_PROFILE
							}
							hasBack
						/>
					)
				})}
			/>
			<MainStack.Screen
				name="AccountDeletion"
				component={AccountDeletionScreen}
				options={{
					header: () => (
						<CustomHeader title={NAVIGATION.ACCOUNT_DELETION} hasBack />
					)
				}}
			/>
			<MainStack.Screen
				name="ReceivedTicketDetail"
				component={ReceivedTicketDetailScreen}
				options={{
					header: () => (
						<CustomHeader title={NAVIGATION.RECEIVED_TICKET_DETAIL} hasBack />
					)
				}}
			/>
			<MainStack.Screen
				name="SentTicketDetail"
				component={SentTicketDetailScreen}
				options={{
					header: () => (
						<CustomHeader title={NAVIGATION.SENT_TICKET_DETAIL} hasBack />
					)
				}}
			/>
			<MainStack.Screen
				name="Feedback"
				component={FeedbackScreen}
				options={{
					header: () => <CustomHeader title={NAVIGATION.FEEDBACK} hasBack />
				}}
			/>
			<MainStack.Screen
				name="Map"
				component={MapScreen}
				options={({ route }) => ({
					header: () => <CustomHeader title={route.params.name} hasBack />
				})}
			/>
		</MainStack.Navigator>
	)
}
