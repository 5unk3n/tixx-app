import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
	HostFollowersHeader,
	MyFollowingsHeader,
	NearbyEventsHeader,
	StaticHeader
} from '@/components/ui/navigation/StackHeader'
import { useUser } from '@/hooks/queries/useUser'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import RegisterGuestCodeScreen from '@/screens/main/coupons/RegisterGuestCodeScreen'
import EventDetailScreen from '@/screens/main/events/EventDetailScreen'
import EventsListScreen from '@/screens/main/events/EventsListScreen'
import MapScreen from '@/screens/main/events/MapScreen'
import NearbyEventsScreen from '@/screens/main/events/NearbyEventsScreen'
import WishlistScreen from '@/screens/main/events/WishlistScreen'
import HostDetailScreen from '@/screens/main/hosts/HostDetailScreen'
import HostFollowersScreen from '@/screens/main/hosts/HostFollowersScreen'
import NotificationScreen from '@/screens/main/notifications/NotificationScreen'
import OrderHistoryScreen from '@/screens/main/orders/OrderHistoryScreen'
import PaymentCancelDetailScreen from '@/screens/main/orders/PaymentCancelDetailScreen'
import PaymentDetailScreen from '@/screens/main/orders/PaymentDetailScreen'
import PaymentResultScreen from '@/screens/main/orders/PaymentResultScreen'
import AccountDeletionScreen from '@/screens/main/settings/AccountDeletionScreen'
import FeedbackScreen from '@/screens/main/settings/FeedbackScreen'
import LanguageScreen from '@/screens/main/settings/LanguageScreen'
import MyFollowingsScreen from '@/screens/main/settings/MyFollowingsScreen'
import ProfileScreen from '@/screens/main/settings/ProfileScreen'
import SettingsScreen from '@/screens/main/settings/SettingsScreen'
import BuyTicketScreen from '@/screens/main/tickets/BuyTicketScreen'
import MyTicketsScreen from '@/screens/main/tickets/MyTicketsScreen'
import PaymentScreen from '@/screens/main/tickets/PaymentScreen'
import ReceivedTicketDetailScreen from '@/screens/main/tickets/ReceivedTicketDetailScreen'
import ReceivedTicketsScreen from '@/screens/main/tickets/ReceivedTicketsScreen'
import SentTicketDetailScreen from '@/screens/main/tickets/SentTicketDetailScreen'
import SentTicketsScreen from '@/screens/main/tickets/SentTicketsScreen'
import TicketManagementScreen from '@/screens/main/tickets/TicketManagementScreen'
import TicketShareScreen from '@/screens/main/tickets/TicketShareScreen'
import TransferCompletionScreen from '@/screens/main/tickets/TransferCompletionScreen'
import { MainStackParamList } from '@/types/navigation'

import MainTabNavigator from './MainTabNavigator'

const MainStack = createNativeStackNavigator<MainStackParamList>()

export default function MainStackNavigator() {
	const { t } = useTranslation()
	const insets = useSafeAreaInsets()
	const { colors } = useCustomTheme()
	const { data: user } = useUser()

	return (
		<MainStack.Navigator
			initialRouteName="MainTab"
			screenOptions={{
				contentStyle: { paddingBottom: insets.bottom },
				animation: 'ios_from_right'
			}}
		>
			<MainStack.Screen
				name="MainTab"
				component={MainTabNavigator}
				options={{
					headerShown: false,
					contentStyle: {
						paddingBottom: insets.bottom,
						backgroundColor: colors.grayscale[900]
					}
				}}
			/>
			<MainStack.Screen
				name="EventDetail"
				component={EventDetailScreen}
				options={{ header: () => null }}
			/>
			<MainStack.Screen
				name="TicketShare"
				component={TicketShareScreen}
				options={{
					header: StaticHeader,
					title: t('navigation.ticketShare')
				}}
			/>
			<MainStack.Screen
				name="TransferCompletion"
				component={TransferCompletionScreen}
				options={{
					header: StaticHeader,
					title: t('navigation.transferCompletion')
				}}
			/>
			<MainStack.Screen
				name="Notification"
				component={NotificationScreen}
				options={{ header: StaticHeader, title: t('navigation.notification') }}
			/>
			<MainStack.Screen
				name="MyTickets"
				component={MyTicketsScreen}
				options={{ header: StaticHeader, title: t('navigation.myTickets') }}
			/>
			<MainStack.Screen
				name="ReceivedTickets"
				component={ReceivedTicketsScreen}
				options={{
					header: StaticHeader,
					title: t('navigation.receivedTickets')
				}}
			/>
			<MainStack.Screen
				name="SentTickets"
				component={SentTicketsScreen}
				options={{ header: StaticHeader, title: t('navigation.sentTickets') }}
			/>
			<MainStack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{ header: StaticHeader, title: t('navigation.settings') }}
			/>
			<MainStack.Screen
				name="Profile"
				component={ProfileScreen}
				options={({ route }) => ({
					header: StaticHeader,
					title:
						route.params.mode === 'view'
							? t('navigation.editProfile', { nickname: user?.nickname })
							: t('navigation.editProfile')
				})}
			/>
			<MainStack.Screen
				name="AccountDeletion"
				component={AccountDeletionScreen}
				options={{ header: StaticHeader, title: t('auth.accountDeletion') }}
			/>
			<MainStack.Screen
				name="ReceivedTicketDetail"
				component={ReceivedTicketDetailScreen}
				options={{
					header: StaticHeader,
					title: t('navigation.receivedTicketDetail')
				}}
			/>
			<MainStack.Screen
				name="SentTicketDetail"
				component={SentTicketDetailScreen}
				options={{
					header: StaticHeader,
					title: t('navigation.sentTicketDetail')
				}}
			/>
			<MainStack.Screen
				name="TicketManagement"
				component={TicketManagementScreen}
				options={{
					header: StaticHeader,
					title: t('navigation.ticketManagement')
				}}
			/>
			<MainStack.Screen
				name="Feedback"
				component={FeedbackScreen}
				options={{ header: StaticHeader, title: t('navigation.feedback') }}
			/>
			<MainStack.Screen
				name="Language"
				component={LanguageScreen}
				options={{ header: StaticHeader, title: t('navigation.language') }}
			/>
			<MainStack.Screen
				name="Map"
				component={MapScreen}
				options={({ route }) => ({
					header: StaticHeader,
					title: route.params.title
				})}
			/>
			<MainStack.Screen
				name="RegisterGuestCode"
				component={RegisterGuestCodeScreen}
				options={{
					header: StaticHeader,
					title: t('navigation.registerGuestCode')
				}}
			/>
			<MainStack.Screen
				name="BuyTicket"
				component={BuyTicketScreen}
				options={{ header: StaticHeader, title: t('navigation.buyTicket') }}
			/>
			<MainStack.Screen
				name="Payment"
				component={PaymentScreen}
				options={{ header: StaticHeader, title: t('navigation.payment') }}
			/>
			<MainStack.Screen
				name="PaymentResult"
				component={PaymentResultScreen}
				options={{ header: StaticHeader, title: t('navigation.paymentResult') }}
			/>
			<MainStack.Screen
				name="EventsList"
				component={EventsListScreen}
				options={({ route }) => ({
					header: StaticHeader,
					title: route.params.title
				})}
			/>
			<MainStack.Screen
				name="Wishlist"
				component={WishlistScreen}
				options={{ header: StaticHeader, title: t('navigation.wishlist') }}
			/>
			<MainStack.Screen
				name="OrderHistory"
				component={OrderHistoryScreen}
				options={{ header: StaticHeader, title: t('navigation.orderHistory') }}
			/>
			<MainStack.Screen
				name="PaymentDetail"
				component={PaymentDetailScreen}
				options={{ header: StaticHeader, title: t('navigation.paymentDetail') }}
			/>
			<MainStack.Screen
				name="PaymentCancelDetail"
				component={PaymentCancelDetailScreen}
				options={{
					header: StaticHeader,
					title: t('navigation.paymentCancelDetail')
				}}
			/>
			<MainStack.Screen
				name="HostDetail"
				component={HostDetailScreen}
				options={{ header: () => null }}
			/>
			<MainStack.Screen
				name="HostFollowers"
				component={HostFollowersScreen}
				options={{ header: HostFollowersHeader }}
			/>
			<MainStack.Screen
				name="MyFollowings"
				component={MyFollowingsScreen}
				options={{ header: MyFollowingsHeader, title: t('common.follow') }}
			/>
			<MainStack.Screen
				name="NearbyEvents"
				component={NearbyEventsScreen}
				options={{
					header: NearbyEventsHeader,
					title: t('navigation.nearbyEvents')
				}}
			/>
		</MainStack.Navigator>
	)
}
