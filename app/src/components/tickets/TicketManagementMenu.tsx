import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { UI } from '@/constants/ui'
import { useEventTickets } from '@/hooks/queries/eventTickets/useEventTickets'
import { useEventTicketsTransfers } from '@/hooks/queries/eventTickets/useEventTicketsTransfers'

import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'

export default function TicketManagementMenu() {
	const navigation = useNavigation()
	const { data: availableEventTickets } = useEventTickets(['available'])
	const { data: receivedEventTicketsTransfers } = useEventTicketsTransfers(
		'received',
		true
	)

	return (
		<View className="flex-row gap-3 mb-9">
			<TouchableRipple
				onPress={() => navigation.navigate('MyTickets')}
				className="flex-1 bg-grayscale-1 rounded-lg"
				borderless
			>
				<View pointerEvents="none" className="pt-3 px-3 pb-[10] items-center">
					<CustomIcon name="myTicket" size={36} className="mb-[10]" />
					<CustomText variant="body3Medium">{UI.TICKETS.MY_TICKETS}</CustomText>
					{availableEventTickets?.length ? (
						<View className="absolute top-0 right-0 bg-primary w-7 h-7 rounded-full justify-center items-center">
							<CustomText>{availableEventTickets?.length}</CustomText>
						</View>
					) : null}
				</View>
			</TouchableRipple>
			<TouchableRipple
				onPress={() => navigation.navigate('ReceivedTickets')}
				className="flex-1 bg-grayscale-1 rounded-lg"
				borderless
			>
				<View pointerEvents="none" className="pt-3 px-3 pb-[10] items-center">
					<CustomIcon name="receivedTicket" size={36} className="mb-[10]" />
					<CustomText variant="body3Medium">
						{UI.TICKETS.RECEIVED_TICKETS}
					</CustomText>
					{receivedEventTicketsTransfers?.length ? (
						<View className="absolute top-0 right-0 bg-primary w-7 h-7 rounded-full justify-center items-center">
							<CustomText>{receivedEventTicketsTransfers?.length}</CustomText>
						</View>
					) : null}
				</View>
			</TouchableRipple>
			<TouchableRipple
				onPress={() => navigation.navigate('SentTickets')}
				className="flex-1 bg-grayscale-1 rounded-lg"
				borderless
			>
				<View pointerEvents="none" className="pt-3 px-3 pb-[10] items-center">
					<CustomIcon name="sentTicket" size={36} className="mb-[10]" />
					<CustomText variant="body3Medium">
						{UI.TICKETS.SENT_TICKETS}
					</CustomText>
				</View>
			</TouchableRipple>
		</View>
	)
}
