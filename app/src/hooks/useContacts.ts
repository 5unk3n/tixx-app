import { useCallback, useState } from 'react'
import { Platform } from 'react-native'
import Contacts from 'react-native-contacts'
import { Contact } from 'react-native-contacts/type'
import {
	check,
	Permission,
	PERMISSIONS,
	request,
	RESULTS
} from 'react-native-permissions'

import { getNicknames } from '@/apis/users/getNicknames'
import { normalizePhone } from '@/utils/formatters'

import { useUser } from './queries/useUser'

export const useContacts = () => {
	const { data: user } = useUser()
	const [contacts, setContacts] = useState<Contact[]>([])
	const [hasPermission, setHasPermission] = useState<boolean>(false)

	const CONTACT_PERMISSION = Platform.select({
		ios: PERMISSIONS.IOS.CONTACTS,
		android: PERMISSIONS.ANDROID.READ_CONTACTS
	}) as Permission

	const requestPermission = useCallback(async () => {
		try {
			const permissionStatus = await check(CONTACT_PERMISSION)

			if (
				permissionStatus === RESULTS.DENIED ||
				permissionStatus === RESULTS.BLOCKED
			) {
				const result = await request(CONTACT_PERMISSION)
				const granted = result === RESULTS.GRANTED
				setHasPermission(granted)
				return granted
			}

			const granted = permissionStatus === RESULTS.GRANTED
			setHasPermission(granted)
			return granted
		} catch (error) {
			console.error(error)
			return false
		}
	}, [CONTACT_PERMISSION])

	const loadContacts = useCallback(async () => {
		try {
			const permission = await requestPermission()
			if (!permission) {
				throw new Error('Contacts permission not granted')
			}

			const fetchedContacts = await Contacts.getAll()

			const filteredContacts = fetchedContacts.filter(
				(contact) =>
					contact.phoneNumbers.length > 0 &&
					normalizePhone(contact.phoneNumbers[0]?.number) !== user?.phone
			)

			const formattedContacts = filteredContacts.map((contact) => ({
				...contact,
				displayName: `${contact.familyName || ''}${contact.givenName || ''}`,
				phoneNumbers: contact.phoneNumbers.map((number) => ({
					...number,
					number: normalizePhone(number.number)
				})),
				nickname: ''
			}))

			const numbers = formattedContacts
				.map((contact) => contact.phoneNumbers[0]?.number)
				.filter(Boolean) // 유효한 번호만 필터링

			const chunkSize = 100
			const nicknamePromises = []
			for (let i = 0; i < numbers.length; i += chunkSize) {
				const chunk = numbers.slice(i, i + chunkSize)
				nicknamePromises.push(getNicknames(chunk))
			}
			const nicknameChunks = await Promise.all(nicknamePromises)
			const nicknames = nicknameChunks.flat()

			const contactsWithNickname = formattedContacts.map((contact) => {
				const primaryNumber = contact.phoneNumbers[0]?.number
				const nicknameEntry = nicknames.find(
					(nickname) => nickname.phone === primaryNumber
				)
				return {
					...contact,
					nickname: nicknameEntry?.nickname || '',
					id: nicknameEntry?.id
				}
			}) as Contact[]

			setContacts(
				contactsWithNickname.sort((a, b) => {
					//@ts-ignore
					const hasNicknameA = a.nickname ? 1 : 0
					//@ts-ignore
					const hasNicknameB = b.nickname ? 1 : 0

					if (hasNicknameA !== hasNicknameB) {
						return hasNicknameB - hasNicknameA
					}

					const nameA = a.displayName.toLowerCase()
					const nameB = b.displayName.toLowerCase()
					return nameA.localeCompare(nameB)
				})
			)
		} catch (err) {
			console.error(err)
		}
	}, [requestPermission])

	return {
		contacts,
		requestPermission,
		loadContacts,
		hasPermission
	}
}
