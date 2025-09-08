import { CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js'
import { useCallback, useState } from 'react'
import { Platform } from 'react-native'
import Contacts from 'react-native-contacts'
import { Contact } from 'react-native-contacts/type'
import { getCountry } from 'react-native-localize'
import {
	check,
	Permission,
	PERMISSIONS,
	request,
	RESULTS
} from 'react-native-permissions'

import { getNicknames } from '@/apis/users/getNicknames'

import { useUser } from './queries/useUser'

export type ContactWithUserInfo = Contact & {
	id: string
	userId: number | null
	nickname: string
	phoneNumber: string
}

export const useContacts = () => {
	const { data: user } = useUser()
	const [contacts, setContacts] = useState<ContactWithUserInfo[]>([])
	const [hasPermission, setHasPermission] = useState<boolean>(false)
	const country = getCountry()

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

	const getContactsWithNickname = async (
		contactsWithPhone: ContactWithUserInfo[]
	) => {
		const numbers = contactsWithPhone.map((contact) => contact.phoneNumber)
		const chunkSize = 100
		const nicknamePromises = []

		for (let i = 0; i < numbers.length; i += chunkSize) {
			const chunk = numbers.slice(i, i + chunkSize)
			nicknamePromises.push(getNicknames(chunk))
		}

		const nicknameChunks = await Promise.all(nicknamePromises)
		const nicknames = nicknameChunks.flat()

		return contactsWithPhone.map((contact) => {
			const nicknameEntry = nicknames.find(
				(nickname) => nickname.phone === contact.phoneNumber
			)!

			return {
				...contact,
				userId: nicknameEntry.id,
				nickname: nicknameEntry?.nickname || ''
			} satisfies ContactWithUserInfo
		})
	}

	const loadContacts = useCallback(async () => {
		try {
			const permission = await requestPermission()
			if (!permission) {
				throw new Error('Contacts permission not granted')
			}

			const fetchedContacts = await Contacts.getAll()

			const contactsWithAllNumbers = fetchedContacts
				// 여러 번호를 가진 연락처는 개별 연락처로 처리
				.flatMap((contact) =>
					contact.phoneNumbers.map((phoneNumber, index) => {
						let e164PhoneNumber = phoneNumber.number
						try {
							e164PhoneNumber = parsePhoneNumberWithError(
								phoneNumber.number,
								country as CountryCode
							).format('E.164')
						} catch (error) {
							console.error(error)
						}

						return {
							...contact,
							id: contact.recordID + `-${index}`,
							phoneNumber: e164PhoneNumber,
							displayName: `${contact.familyName || ''}${contact.givenName || ''}`,
							nickname: '',
							userId: null
						} satisfies ContactWithUserInfo
					})
				)
				// 내 번호와 같은 연락처 제거
				.filter((contact) => contact.phoneNumber !== user?.phone)

			const contactsWithPhoneAndNickname = await getContactsWithNickname(
				contactsWithAllNumbers
			)

			setContacts(
				contactsWithPhoneAndNickname.sort((a, b) => {
					const hasNicknameA = a.nickname ? 1 : 0
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
	}, [country, requestPermission, user?.phone])

	return {
		contacts,
		requestPermission,
		loadContacts,
		hasPermission
	}
}
