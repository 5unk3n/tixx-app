import { useIsFocused } from '@react-navigation/native'
import { format } from 'date-fns'
import { enUS, ko } from 'date-fns/locale'
import React, { PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, StyleSheet, View } from 'react-native'
import { Modal, Portal, TouchableRipple } from 'react-native-paper'
import Toast from 'react-native-toast-message'

import { EventTicket, GroupedEventTicket } from '@/types'
import { formatTimeRange } from '@/utils/formatters'

import EventTicketCard from './EventTicketCard'
import GroupedTicketCard from './GroupedTicketCard'
import BlurredChip from '../ui/display/BlurredChip'
import { CustomText } from '../ui/display/CustomText'
import { CustomRadioButton } from '../ui/input/CustomRadioButton'

type Ticket = Omit<EventTicket | GroupedEventTicket, 'transfers'>

const isGroupedTicket = (ticket: Ticket): ticket is GroupedEventTicket => {
	return 'ids' in ticket
}

interface TicketListItemProps extends PropsWithChildren {
	eventTicket: Ticket
	statusText?: string
	transferId?: number
	selectable?: boolean
	onPress?: () => void
}

export default function TicketListItem({
	eventTicket,
	statusText,
	transferId,
	selectable,
	onPress,
	children,
	...props
}: TicketListItemProps) {
	const { t, i18n } = useTranslation()
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

	// TODO: 티켓이 삭제됐을 때 처리 로직 필요함.
	const handlePress = () => {
		if (eventTicket.event) {
			if (onPress) {
				onPress()
			} else {
				setIsCardVisible(true)
			}
		} else {
			Toast.show({
				type: 'error',
				text1: t('tickets.errors.deletedEvent')
			})
		}
	}

	useEffect(() => {
		if (!isFocused) {
			setIsCardVisible(false)
		}
	}, [isFocused])

	// FIXME: 티켓 삭제에 대한 정책 필요
	if (!eventTicket) {
		return null
	}

	return (
		<TouchableRipple onPress={handlePress}>
			<View {...props}>
				{statusText && (
					<CustomText
						variant="body3Regular"
						className="text-grayscale-300 text-[13px] mb-4"
					>
						{statusText}
					</CustomText>
				)}
				<View className="flex-row items-center">
					<View>
						<Image
							width={90}
							height={113}
							source={{ uri: eventTicket.event?.imageUrl }}
							className={`mr-4 rounded-xl aspect-poster`}
						/>
						{eventTicket.event && (
							<View
								className={`absolute bottom-2 left-2`}
								style={styles.glassMorphShadow}
							>
								<BlurredChip size="sm">
									{eventTicket.event.tags[0].tag === 'venue'
										? t('events.tags.venue')
										: eventTicket.event.tags[0].tag === 'party'
											? t('events.tags.party')
											: eventTicket.event.tags[0].tag === 'event'
												? t('events.tags.event')
												: eventTicket.event.tags[0].tag}
								</BlurredChip>
							</View>
						)}
					</View>
					<View className="flex-1">
						<CustomText
							variant="body3Medium"
							className="mb-1"
							numberOfLines={2}
						>
							{eventTicket.event?.name || '삭제된 이벤트'}
						</CustomText>
						<CustomText
							variant="caption1Regular"
							className="flex-1 text-[13px] text-grayscale-300"
						>
							{`${format(eventTicket.ticket.startAt, 'yyyy.MM.dd', {
								locale: i18n.language === 'ko' ? ko : enUS
							})} | ${t(
								'tickets.entryTime',
								formatTimeRange(
									eventTicket.ticket.startAt,
									eventTicket.ticket.endAt
								)
							)}`}
						</CustomText>
						<CustomText
							variant="body3Regular"
							className="text-[13px] text-grayscale-300"
						>
							{isGroupedTicket(eventTicket) &&
								t('tickets.quantity', { count: eventTicket.ids.length })}
						</CustomText>
					</View>
					{selectable && (
						<View className="grow-0">
							<CustomRadioButton.Button
								label=""
								value={String(transferId)}
								iconType="rounded"
							/>
						</View>
					)}
				</View>
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
		</TouchableRipple>
	)
}

const styles = StyleSheet.create({
	glassMorphShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 20
	}
})
