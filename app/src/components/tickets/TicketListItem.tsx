import { useIsFocused } from '@react-navigation/native'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Image, View } from 'react-native'
import { Modal, Portal, TouchableRipple } from 'react-native-paper'

import { EventTicket, GroupedEventTicket } from '@/types'
import { formatTicketDate, formatTicketTime } from '@/utils/formatters'

import EventTicketCard from './EventTicketCard'
import GroupedTicketCard from './GroupedTicketCard'
import EventTags from '../events/EventTags'
import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'

type Ticket = Omit<EventTicket | GroupedEventTicket, 'transfers'>

const isGroupedTicket = (ticket: Ticket): ticket is GroupedEventTicket => {
	return 'ids' in ticket
}

interface TicketListItemProps extends PropsWithChildren {
	eventTicket: Ticket
	statusText?: string
	onPress?: () => void
}

export default function TicketListItem({
	eventTicket,
	statusText,
	onPress,
	children,
	...props
}: TicketListItemProps) {
	const [isCardVisible, setIsCardVisible] = useState(false)
	const isFocused = useIsFocused()

	const renderTicketCard = (ticket: Ticket) => {
		if (isGroupedTicket(ticket)) {
			return (
				<GroupedTicketCard
					groupedTicket={ticket}
					hasActions={statusText ? false : true}
					defaultIsDetailVisible
				/>
			)
		} else {
			return <EventTicketCard eventTicket={ticket} defaultIsDetailVisible />
		}
	}

	useEffect(() => {
		if (!isFocused) {
			setIsCardVisible(false)
		}
	}, [isFocused])

	return (
		<View className="p-3 pb-4 bg-grayscale-1 rounded-xl" {...props}>
			{statusText && (
				<CustomText variant="body3Regular" className="text-primary mb-4">
					{statusText}
				</CustomText>
			)}
			<TouchableRipple
				onPress={() => {
					onPress ? onPress() : setIsCardVisible(true)
				}}
			>
				<View className="flex-row items-center">
					<Image
						width={120}
						height={158}
						source={{ uri: eventTicket.event.imageUrl }}
						className="mr-4 rounded-xl"
					/>
					<View className="flex-1">
						<View className="flex-row justify-between mb-1">
							<EventTags tags={eventTicket.event.tags} />
							<CustomText variant="body3Regular" className="text-grayscale-5">
								{isGroupedTicket(eventTicket) &&
									`수량 : ${eventTicket.ids.length}`}
							</CustomText>
						</View>
						<CustomText
							variant="headline1Semibold"
							className="mb-2"
							numberOfLines={2}
						>
							{eventTicket.event.name}
						</CustomText>
						<View className="flex-row mb-2">
							<CustomIcon name="calendar" size={20} className="mr-2" />
							<CustomText
								variant="body1Regular"
								className="flex-1 text-grayscale-8"
							>
								{formatTicketDate(eventTicket.startAt)}
							</CustomText>
						</View>
						<View className="flex-row">
							<CustomIcon name="time" size={20} className="mr-2" />
							<CustomText
								variant="body1Regular"
								className="flex-1 text-grayscale-8"
							>
								{formatTicketTime(eventTicket.startAt, eventTicket.endAt)}
							</CustomText>
						</View>
					</View>
				</View>
			</TouchableRipple>
			{children}
			<Portal>
				<Modal
					visible={isCardVisible}
					onDismiss={() => setIsCardVisible(false)}
				>
					<TouchableRipple onPress={() => setIsCardVisible(false)}>
						<View className="px-5">{renderTicketCard(eventTicket)}</View>
					</TouchableRipple>
				</Modal>
			</Portal>
		</View>
	)
}
