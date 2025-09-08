import { format } from 'date-fns'
import {
	parsePhoneNumberWithError,
	isValidPhoneNumber,
	ParseError
} from 'libphonenumber-js'
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import * as XLSX from 'xlsx'

import { getNicknames } from '@/apis/users/getNicknames'
import ContactList from '@/components/tickets/ContactList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { useEvent } from '@/hooks/queries/events/useEvent'
import { useEvents } from '@/hooks/queries/events/useEvents'
import { useHosts } from '@/hooks/queries/hosts/useHosts'
import { useHostStore } from '@/stores/hostStore'
import { Contact, ContactWithUserInfo } from '@/types'
import { formatPhoneNumberOnTyping } from '@/utils/formatters'

export default function SendTicketPage() {
	const { t } = useTranslation()
	const { state } = useLocation()
	const [eventId, setEventId] = useState<string | null>(state?.eventId || null)
	const [ticketId, setTicketId] = useState<string | null>(
		state?.ticketId || null
	)
	const [contacts, setContacts] = useState<ContactWithUserInfo[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [fileError, setFileError] = useState('')
	const [newContactName, setNewContactName] = useState('')
	const [newContactPhone, setNewContactPhone] = useState('')
	const [addContactError, setAddContactError] = useState('')

	const { hostId } = useHostStore()

	const { data: hosts } = useHosts()
	const host = hosts!.find((host) => host.id === hostId)
	const { data: events } = useEvents(host!.id, 'all', 'all')
	const { data: event } = useEvent(eventId || '')
	const tickets = event?.tickets

	const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setFileError('')
		const reader = new FileReader()

		reader.onload = async (event) => {
			const data = event.target?.result
			const workbook = XLSX.read(data, { type: 'binary' })
			const sheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[sheetName]
			const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as [
				string,
				string
			][]

			const header = json[0] as ['name', 'phone']

			if (header[0] !== 'name' || header[1] !== 'phone') {
				setFileError(t('invitation.invalidFormat'))
				return
			}

			const rows = json.slice(6)
			const formattedContacts = rows.map((contact) => {
				try {
					const phoneNumber = parsePhoneNumberWithError(
						String(contact[1]),
						'KR'
					).format('E.164')
					return {
						name: String(contact[0]),
						phone: phoneNumber
					}
				} catch (error) {
					console.error(error)
					return null
				}
			})

			const validContacts = formattedContacts.filter(
				(contact) => contact !== null
			)

			const uniqueContacts = Array.from(
				new Map(
					validContacts.map((contact) => [contact.phone, contact])
				).values()
			)

			const contactsWithPhoneAndNickname =
				await getContactsWithNickname(uniqueContacts)

			setContacts(
				contactsWithPhoneAndNickname.sort((a, b) => {
					const hasNicknameA = a.nickname ? 1 : 0
					const hasNicknameB = b.nickname ? 1 : 0

					if (hasNicknameA !== hasNicknameB) {
						return hasNicknameB - hasNicknameA
					}

					const nameA = a.name.toLowerCase()
					const nameB = b.name.toLowerCase()
					return nameA.localeCompare(nameB)
				})
			)
		}

		reader.readAsBinaryString(file)
	}

	// FIXME: 현재 닉네임 표시되고있지 않음, 디자인 수정 시 수정
	const getContactsWithNickname = async (contacts: Contact[]) => {
		const numbers = contacts.map((contact) => contact.phone)
		const chunkSize = 100
		const nicknamePromises = []

		for (let i = 0; i < numbers.length; i += chunkSize) {
			const chunk = numbers.slice(i, i + chunkSize)
			nicknamePromises.push(getNicknames(chunk))
		}

		const nicknameChunks = await Promise.all(nicknamePromises)
		const nicknames = nicknameChunks.flat()

		return contacts.map((contact) => {
			const nicknameEntry = nicknames.find(
				(nickname) => nickname.phone === contact.phone
			)

			return {
				...contact,
				userId: nicknameEntry ? nicknameEntry.id : null,
				nickname: nicknameEntry?.nickname || ''
			} satisfies ContactWithUserInfo
		})
	}

	const handleXlsxDownload = () => {
		const data = [
			{ name: t('invitation.phoneFormat'), phone: '010-1234-5678' },
			{ name: '', phone: '01012345678' },
			{ name: '', phone: '010 1234 5678' },
			{ name: '', phone: '1012345678' },
			{ name: t('invitation.dataInputBelow'), phone: '' },
			...Array.from({ length: 100 }, () => ({ name: '', phone: '' }))
		]

		const worksheet = XLSX.utils.json_to_sheet(data)
		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts')

		// 열 너비 설정
		worksheet['!cols'] = [{ wch: 30 }, { wch: 30 }]

		XLSX.writeFile(workbook, 'tixx-invitation-template.xlsx')
	}

	const handleAddContact = async () => {
		setAddContactError('')

		if (!newContactName.trim()) {
			setAddContactError(t('invitation.error.nameRequired'))
			return
		}

		if (!isValidPhoneNumber(newContactPhone, 'KR')) {
			setAddContactError(t('invitation.error.invalidPhone'))
			return
		}

		let phoneNumber
		try {
			phoneNumber = parsePhoneNumberWithError(newContactPhone, 'KR').format(
				'E.164'
			)
		} catch (error) {
			if (error instanceof ParseError) {
				setAddContactError(t('invitation.error.invalidPhone'))
				return
			}
			return
		}

		if (contacts.some((contact) => contact.phone === phoneNumber)) {
			setAddContactError(t('invitation.error.alreadyAdded'))
			return
		}

		const newContact: Contact = {
			name: newContactName.trim(),
			phone: phoneNumber
		}

		const [contactWithNickname] = await getContactsWithNickname([newContact])

		setContacts(
			[...contacts, contactWithNickname].sort((a, b) => {
				const hasNicknameA = a.nickname ? 1 : 0
				const hasNicknameB = b.nickname ? 1 : 0

				if (hasNicknameA !== hasNicknameB) {
					return hasNicknameB - hasNicknameA
				}

				const nameA = a.name.toLowerCase()
				const nameB = b.name.toLowerCase()
				return nameA.localeCompare(nameB)
			})
		)

		setNewContactName('')
		setNewContactPhone('')
	}

	return (
		<div className="flex-1 p-5">
			<section className="mt-[82px]">
				<h2 className="mb-3 text-center text-title-1 font-semibold">
					{t('invitation.sendInvitation')}
				</h2>
				<div className="mb-4 flex gap-4 *:flex-1">
					<div>
						<Label className="px-2 py-1 text-caption-1 font-medium text-grayscale-500">
							{t('event.event')}
						</Label>
						<Select
							onValueChange={(value) => {
								setEventId(value)
								setTicketId(null)
							}}
							value={eventId ? String(eventId) : undefined}
						>
							<SelectTrigger>
								<SelectValue placeholder={t('common.select')} />
							</SelectTrigger>
							<SelectContent>
								{events?.map((event) => (
									<SelectItem key={event.id} value={String(event.id)}>
										{event.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label className="px-2 py-1 text-caption-1 font-medium text-grayscale-500">
							{t('ticket.ticket')}
						</Label>
						<Select
							onValueChange={setTicketId}
							value={ticketId ? String(ticketId) : undefined}
							disabled={!eventId}
						>
							<SelectTrigger>
								<SelectValue placeholder={t('common.select')} />
							</SelectTrigger>
							<SelectContent>
								{tickets?.map((ticket) => (
									<SelectItem key={ticket.id} value={String(ticket.id)}>
										{`${format(ticket.startAt, 'M/dd')} ${ticket.name} (${t(
											'common.id'
										)}: ${ticket.id})`}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="flex flex-col items-center gap-4 md:flex-row">
					<Input
						placeholder={t('invitation.searchPlaceholder')}
						onChange={(e) => setSearchQuery(e.target.value)}
						value={searchQuery}
					/>
					<div className="ml-auto shrink-0">
						<Button variant={'grayLine'} onClick={handleXlsxDownload}>
							{t('invitation.downloadTemplate')}
						</Button>
						<Button
							variant={'grayLine'}
							className="ml-2 cursor-pointer md:ml-4"
							asChild
						>
							<Label htmlFor="upload-contacts">{t('common.upload')}</Label>
						</Button>
						<Input
							id="upload-contacts"
							type="file"
							accept=".xlsx, .xls"
							className="hidden"
							onChange={onFileChange}
						/>
					</div>
				</div>
				<div className="mt-4 flex items-end gap-4">
					<div className="flex-1">
						<Label
							htmlFor="name-input"
							className="px-2 py-1 text-caption-1 font-medium text-grayscale-500"
						>
							{t('common.name')}
						</Label>
						<Input
							id="name-input"
							placeholder={t('invitation.namePlaceholder')}
							value={newContactName}
							onChange={(e) => setNewContactName(e.target.value)}
						/>
					</div>
					<div className="flex-1">
						<Label
							htmlFor="phone-input"
							className="px-2 py-1 text-caption-1 font-medium text-grayscale-500"
						>
							{t('common.phone')}
						</Label>
						<Input
							id="phone-input"
							placeholder={t('invitation.phonePlaceholder')}
							value={newContactPhone}
							onChange={(e) =>
								setNewContactPhone(formatPhoneNumberOnTyping(e.target.value))
							}
						/>
					</div>
					<Button
						type="button"
						onClick={handleAddContact}
						variant={'blackLine'}
						className="shrink-0"
					>
						{t('common.add')}
					</Button>
				</div>
				<p className="h-4 text-right text-body-1 text-status-destructive">
					{addContactError || fileError}
				</p>
			</section>
			<section className="mt-[60px]">
				<ContactList
					contacts={contacts}
					searchQuery={searchQuery}
					ticketId={Number(ticketId!)}
				/>
			</section>
		</div>
	)
}
