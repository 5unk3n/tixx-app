import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { Divider } from 'react-native-paper'

import { useActionEventTicketTransfer } from '@/hooks/queries/eventTickets/useActionEventTicketTransfer'
import { useEventTicketsTransfers } from '@/hooks/queries/eventTickets/useEventTicketsTransfers'

import EmptyTickets from './EmptyTickets'
import ReceivedTicket from './ReceivedTicket'
import SentTicket from './SentTicket'
import TransferActionDialog from './TransferActionDialog'
import { CustomText } from '../ui/display/CustomText'
import CustomButton from '../ui/input/CustomButton'
import { CustomRadioButton } from '../ui/input/CustomRadioButton'

interface TransferredTicketsProps {
	type: 'received' | 'sent'
}

export default function TransferredTickets({
	type,
	...props
}: TransferredTicketsProps) {
	const { t } = useTranslation()
	const [currentTransferId, setCurrentTransferId] = useState('')
	const [dialogState, setDialogState] = useState<{
		isVisible: boolean
		type: 'accept' | 'reject' | 'cancel'
	}>({ isVisible: false, type: 'accept' })

	const { data: transferredEventTickets, isPending } =
		useEventTicketsTransfers(type)
	const { mutateAsync: actionEventTicketTransfer } =
		useActionEventTicketTransfer()

	if (isPending) return null

	const closeDialog = () =>
		setDialogState((prev) => ({ ...prev, isVisible: false }))

	const handleConfirm = async () => {
		await actionEventTicketTransfer({
			action: dialogState.type,
			data: { eventTicketTransferId: Number(currentTransferId) }
		})
		setCurrentTransferId('')
	}

	return (
		<CustomRadioButton.Group
			value={currentTransferId}
			onChange={(value) =>
				setCurrentTransferId(value === currentTransferId ? '' : value)
			}
			style={styles.flex}
		>
			<CustomText variant="body3Medium" className="mb-4">
				{`${t('tickets.ticket')} ${t('common.unit.items', { count: transferredEventTickets.length })}`}
			</CustomText>
			<FlatList
				keyExtractor={(item) => item.id.toString()}
				data={transferredEventTickets}
				renderItem={({ item }) =>
					type === 'received' ? (
						<ReceivedTicket transferredEventTicket={item} {...props} />
					) : (
						<SentTicket transferredEventTicket={item} {...props} />
					)
				}
				ItemSeparatorComponent={TicketDivider}
				ListEmptyComponent={
					<View className="mt-20">
						<EmptyTickets />
					</View>
				}
				className="flex-1"
			/>
			<View className="flex-row gap-2">
				{type === 'received' ? (
					<>
						<CustomButton
							onPress={() =>
								setDialogState({ isVisible: true, type: 'reject' })
							}
							flex
							disabled={!currentTransferId}
						>
							{t('common.actions.reject')}
						</CustomButton>
						<CustomButton
							onPress={() =>
								setDialogState({ isVisible: true, type: 'accept' })
							}
							flex
							disabled={!currentTransferId}
						>
							{t('common.actions.accept')}
						</CustomButton>
					</>
				) : (
					<CustomButton
						onPress={() => setDialogState({ isVisible: true, type: 'cancel' })}
						flex
						disabled={!currentTransferId}
					>
						{t('common.actions.cancel')}
					</CustomButton>
				)}
			</View>
			<TransferActionDialog
				isVisible={dialogState.isVisible}
				onClose={closeDialog}
				onConfirm={handleConfirm}
				type={dialogState.type}
			/>
		</CustomRadioButton.Group>
	)
}

function TicketDivider() {
	return <Divider className="bg-grayscale-600 my-6" />
}

const styles = StyleSheet.create({
	flex: {
		flex: 1
	}
})
