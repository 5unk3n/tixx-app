import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useState
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { View, FlatList, ScrollView, StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'

import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import CustomDialog from '@/components/ui/feedback/CustomDialog'
import CustomButton from '@/components/ui/input/CustomButton'
import CustomIconButton from '@/components/ui/input/CustomIconButton'
import CustomTextInput from '@/components/ui/input/CustomTextInput'
import { useTransferEventTickets } from '@/hooks/queries/eventTickets/useTransferEventTickets'
import { ContactWithUserInfo, useContacts } from '@/hooks/useContacts'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { MainStackParamList } from '@/types/navigation'
import { formatPhone } from '@/utils/formatters'

type Props = NativeStackScreenProps<MainStackParamList, 'TicketShare'>

export default function TicketShareScreen({ route, navigation }: Props) {
	const { ids, event } = route.params
	const { t } = useTranslation()
	const { colors } = useCustomTheme()
	const [selectedContacts, setSelectedContacts] = useState<
		ContactWithUserInfo[]
	>([])
	const { contacts, loadContacts, hasPermission } = useContacts()
	const [searchQuery, setSearchQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)

	const searchedContacts = useMemo(
		() =>
			contacts.filter((contact) =>
				contact.displayName.toLowerCase().includes(searchQuery.toLowerCase())
			),
		[contacts, searchQuery]
	)

	const { mutateAsync: transferEventTickets } = useTransferEventTickets()

	const handleShare = async () => {
		await transferEventTickets(
			selectedContacts.map((contact, index) => ({
				eventTicketId: ids[index],
				toPhoneNumber: contact.phoneNumber,
				toUserId: contact.userId || undefined
			}))
		)
		navigation.reset({
			index: 1,
			routes: [
				{ name: 'MainTab' },
				{ name: 'TransferCompletion', params: event }
			]
		})
	}

	const handleContactSelect = (
		contact: ContactWithUserInfo,
		setSelected: Dispatch<SetStateAction<ContactWithUserInfo[]>>,
		isSelected: boolean
	) => {
		if (isSelected) {
			setSelected((prev) =>
				prev.filter((selectedContact) => selectedContact.id !== contact.id)
			)
		} else {
			if (selectedContacts.length >= ids.length) {
				Toast.show({
					type: 'error',
					text1: t('tickets.errors.maxSelection', {
						count: ids.length
					})
				})
			} else {
				setSelectedContacts((prev) => [...prev, contact])
			}
		}
	}

	useEffect(() => {
		loadContacts()
	}, [loadContacts])

	return (
		<ErrorBoundary fallback={<View className="flex-1" />}>
			<View className="flex-1 pt-2 px-5">
				<CustomTextInput
					placeholder={t('tickets.search.contactPlaceholder')}
					right={<CustomIcon name="search" color={colors.primary} />}
					containerStyle={[
						styles.textInputContainer,
						{ borderColor: colors.primary, backgroundColor: colors.background }
					]}
					placeholderTextColor={colors.grayscale[400]}
					value={searchQuery}
					onChangeText={setSearchQuery}
				/>
				{/* 이전 디자인 */}
				{/* <CustomText
					variant="body3Regular"
					className="mb-[10] text-grayscale-400"
				>
					{`${t('tickets.sharableTickets')} ${selectedContacts.length}/${ids.length}`}
				</CustomText> */}
				<ScrollView
					horizontal
					className="grow-0"
					contentContainerStyle={styles.contentContainer}
				>
					{selectedContacts.map((selectedContact) => (
						<View
							key={selectedContact.id}
							className="p-2 border border-primary rounded-lg flex-row items-center mb-6"
						>
							<CustomText variant="body1Regular" className="text-white">
								{t('tickets.to', { nickname: selectedContact.displayName })}
							</CustomText>
							<CustomIcon
								size={22}
								name="close"
								strokeWidth={2}
								className="ml-1"
								onPress={() => {
									setSelectedContacts((prev) =>
										prev.filter((contact) => contact.id !== selectedContact.id)
									)
								}}
							/>
						</View>
					))}
				</ScrollView>
				{searchedContacts.length ? (
					<FlatList
						keyExtractor={(item) => item.id}
						className="flex-1"
						data={searchedContacts}
						showsVerticalScrollIndicator={false}
						renderItem={({ item, index }) => {
							const isSelected = selectedContacts.includes(item)

							return (
								<View className="flex-row items-center mb-6" key={index}>
									<View className="flex-1">
										<View className="flex-row mb-2">
											<CustomText variant="body1Medium" className="mr-2 flex-1">
												{item.displayName}
											</CustomText>
											<CustomText
												variant="caption1Regular"
												className="text-primary self-end"
											>
												{item.nickname}
											</CustomText>
										</View>
										<CustomText
											variant="body3Regular"
											className="text-grayscale-400"
										>
											{formatPhone(item.phoneNumber)}
										</CustomText>
									</View>
									<CustomIconButton
										name={selectedContacts.includes(item) ? 'close' : 'plus'}
										className={isSelected ? 'bg-grayscale-700' : 'bg-primary'}
										onPress={() =>
											handleContactSelect(item, setSelectedContacts, isSelected)
										}
										size={20}
										buttonSize={32}
									/>
								</View>
							)
						}}
					/>
				) : (
					<View className="flex-1 items-center justify-center">
						<CustomText variant="body2Medium" className="text-grayscale-400">
							{hasPermission
								? t('tickets.search.noResult')
								: t('common.permissions.contactRequired')}
						</CustomText>
					</View>
				)}
				<View className="bottom-2 flex-row gap-3">
					<CustomButton
						flex
						onPress={() => setIsOpen(true)}
						disabled={selectedContacts.length === 0}
					>
						{t('common.actions.gift')}
					</CustomButton>
				</View>
			</View>
			<CustomDialog visible={isOpen} onDismiss={() => setIsOpen(false)}>
				<CustomDialog.Title>
					{t('tickets.confirmGift.title')}
				</CustomDialog.Title>
				<CustomDialog.Actions>
					<CustomButton
						onPress={() => setIsOpen(false)}
						mode="contained"
						colorVariant="secondary"
						flex
					>
						{t('common.actions.cancel')}
					</CustomButton>
					<CustomButton
						onPress={handleShare}
						mode="contained"
						colorVariant="primary"
						flex
					>
						{t('common.actions.gift')}
					</CustomButton>
				</CustomDialog.Actions>
			</CustomDialog>
		</ErrorBoundary>
	)
}

const styles = StyleSheet.create({
	textInputContainer: {
		borderWidth: 1,
		borderRadius: 25,
		marginBottom: 16
	},
	contentContainer: {
		gap: 16
	}
})
