import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useState
} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { View, FlatList, TextInput, ScrollView } from 'react-native'
import { Contact } from 'react-native-contacts/type'
import Toast from 'react-native-toast-message'

import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import GradientBorderView from '@/components/ui/display/GradientBorderView'
import CustomButton from '@/components/ui/input/CustomButton'
import CustomIconButton from '@/components/ui/input/CustomIconButton'
import { UI } from '@/constants/ui'
import { useTransferEventTickets } from '@/hooks/queries/eventTickets/useTransferEventTickets'
import { useContacts } from '@/hooks/useContacts'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { MainStackParamList } from '@/types/navigation'
import { formatPhone } from '@/utils/formatters'

type Props = NativeStackScreenProps<MainStackParamList, 'TicketShare'>

export default function TicketShareScreen({ route, navigation }: Props) {
	const eventTicketIds = route.params
	const { colors, fonts } = useCustomTheme()
	const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])
	const { contacts, loadContacts, hasPermission } = useContacts()
	const { mutateAsync: transferEventTickets } = useTransferEventTickets()
	const [searchQuery, setSearchQuery] = useState('')

	const searchedContacts = useMemo(
		() =>
			contacts.filter((contact) =>
				contact.displayName.toLowerCase().includes(searchQuery.toLowerCase())
			),
		[contacts, searchQuery]
	)

	const handleShare = async () => {
		await transferEventTickets(
			selectedContacts.map((contact, index) => ({
				eventTicketId: eventTicketIds[index],
				toPhoneNumber: contact.id ? '' : contact.phoneNumbers[0].number,
				toUserId: contact.id
			}))
		)
		navigation.reset({
			index: 1,
			routes: [{ name: 'MainTab' }, { name: 'TransferCompletion' }]
		})
	}

	const handleContactSelect = (
		contact: Contact,
		setSelected: Dispatch<SetStateAction<Contact[]>>,
		isSelected: boolean
	) => {
		if (isSelected) {
			setSelected((prev) =>
				prev.filter(
					(selectedContact) => selectedContact.recordID !== contact.recordID
				)
			)
		} else {
			if (selectedContacts.length >= eventTicketIds.length) {
				Toast.show({
					type: 'error',
					text1: `최대 ${eventTicketIds.length}명까지 선택할 수 있습니다.`
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
		<ErrorBoundary fallback={<View className="flex-1 bg-red-200" />}>
			<View className="flex-1 pt-2 px-5">
				<CustomText variant="body3Regular" className="mb-[10] text-grayscale-5">
					{/* FIXME: 아래 마진 추가 */}
					{`${UI.TICKETS.SHARABLE_TICKETS} ${selectedContacts.length}/${eventTicketIds.length}`}
				</CustomText>
				<ScrollView horizontal className="gap-[10] grow-0">
					{selectedContacts.map((selectedContact) => (
						<GradientBorderView
							key={selectedContact.recordID}
							borderRadius={8}
							borderWidth={1}
							colors={[colors.point[3], colors.grayscale[8]]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							className="w-[170] h-[85] mb-3"
						>
							<View className="w-full h-full bg-point-5a12 p-4">
								<CustomText variant="body1Medium" className="text-grayscale-8">
									{`To. ${selectedContact.displayName}님`}
								</CustomText>
							</View>
						</GradientBorderView>
					))}
				</ScrollView>
				<View className="flex-row mb-6 bg-surfaceVariant rounded-lg items-center py-[14] pl-3 pr-5">
					<CustomIcon name="search" />
					<TextInput
						placeholder={UI.TICKETS.SEARCH_CONTACT_PLACEHOLDER}
						placeholderTextColor={colors.grayscale[5]}
						style={fonts.body1Medium}
						className="flex-1 m-0 py-0 pl-3 text-onPrimary"
						value={searchQuery}
						onChangeText={(text) => setSearchQuery(text)}
					/>
				</View>
				{searchedContacts.length ? (
					<FlatList
						keyExtractor={(item) => item.recordID}
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
											className="text-grayscale-5"
										>
											{formatPhone(item.phoneNumbers[0].number)}
										</CustomText>
									</View>
									<CustomIconButton
										name={selectedContacts.includes(item) ? 'close' : 'plus'}
										className={isSelected ? 'bg-grayscale-2' : 'bg-primary'}
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
						<CustomText variant="body2Medium" className="text-grayscale-5">
							{hasPermission
								? UI.TICKETS.NO_SEARCH_RESULT
								: UI.COMMON.CONTACT_PERMISSION_REQUIRED}
						</CustomText>
					</View>
				)}
				<View className="bottom-0 flex-row gap-3">
					<CustomButton
						flex
						onPress={handleShare}
						disabled={selectedContacts.length === 0}
					>
						{UI.COMMON.SHARE_ACTION}
					</CustomButton>
				</View>
			</View>
		</ErrorBoundary>
	)
}
