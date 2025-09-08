import { format } from 'date-fns'
import { ChangeEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as XLSX from 'xlsx'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '../ui/select'
import { Spinner } from '../ui/Spinner'

// TODO: 타임스탬프, 디스플레이 url, 타입 필요함
import { useInstagramCrawl } from '@/hooks/queries/events/useInstagramCrawl'
import { BASE_URL } from '@/lib/axiosInstance'
import { CreateEventForm } from '@/types'

const storedInstagramUserNames = JSON.parse(
	localStorage.getItem('instagramUserNames') || '[]'
) as string[]

interface AdminInstagramEventSelectProps {
	onChange: (event: Partial<CreateEventForm>) => void
	onMouseEnter: (event: Partial<CreateEventForm>) => void
	onMouseLeave: () => void
}

export default function AdminInstagramEventSelect({
	onChange,
	onMouseEnter,
	onMouseLeave
}: AdminInstagramEventSelectProps) {
	const { t } = useTranslation()
	const [userNames, setUserNames] = useState<string[]>(storedInstagramUserNames)
	const [selectedUserName, setSelectedUserName] = useState('')
	const [fileError, setFileError] = useState('')
	const [selectedId, setSelectedId] = useState<string>('')

	const { data: crawledEvents, isFetching } =
		useInstagramCrawl(selectedUserName)

	const handleXlsxDownload = () => {
		const data = [...Array.from({ length: 100 }, () => ({ userName: '' }))]
		const worksheet = XLSX.utils.json_to_sheet(data)
		const workbook = XLSX.utils.book_new()
		XLSX.utils.book_append_sheet(workbook, worksheet, 'UserNames')

		// 열 너비 설정
		worksheet['!cols'] = [{ wch: 50 }]

		XLSX.writeFile(workbook, 'tixx-instagram-crawling-template.xlsx')
	}

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setFileError('')
		const reader = new FileReader()

		reader.onload = (event) => {
			const data = event.target?.result
			const workbook = XLSX.read(data, { type: 'binary' })
			const sheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[sheetName]
			const json = XLSX.utils.sheet_to_json(worksheet) as { userName: string }[]

			if (!json[0] || !('userName' in json[0])) {
				setFileError(t('invitation.invalidFormat'))
				return
			}

			const validUserNames = json
				.map((row) => row.userName)
				.filter((userName) => userName)

			const uniqueUserNames = [...new Set(validUserNames)]

			localStorage.setItem(
				'instagramUserNames',
				JSON.stringify(uniqueUserNames)
			)
			setUserNames(uniqueUserNames)
		}

		reader.readAsBinaryString(file)
	}

	async function urlToFile(url: string, filename: string): Promise<File> {
		const response = await fetch(url)
		const blob = await response.blob()
		return new File([blob], filename, { type: blob.type })
	}

	const handleValueChange = async (value: string) => {
		setSelectedId(value)
		const selectedEvent = crawledEvents?.find((e) => String(e.id) === value)
		if (selectedEvent) {
			const file = await urlToFile(
				`${BASE_URL}${selectedEvent.displayUrl}`,
				'image'
			)

			onChange({
				description: selectedEvent.caption,
				media: file
			})
		}
	}

	const handleMouseEnter = async (id: string) => {
		const hoveredEvent = crawledEvents?.find((e) => String(e.id) === id)
		if (hoveredEvent) {
			const file = await urlToFile(
				`${BASE_URL}${hoveredEvent.displayUrl}`,
				'image'
			)

			onMouseEnter({
				description: hoveredEvent.caption,
				media: file
			})
		}
	}

	const handleMouseLeave = () => {
		onMouseLeave()
	}

	return (
		<div className="">
			<div className="mt-2 flex gap-2">
				<Button type="button" size={'sm'} onClick={handleXlsxDownload}>
					{t('event.downloadTemplate')}
				</Button>
				<Button size={'sm'} className="ml-2 md:ml-4" asChild>
					<Label htmlFor="upload-contacts" className="cursor-pointer">
						{t('event.upload')}
					</Label>
				</Button>
				<Input
					id="upload-contacts"
					type="file"
					accept=".xlsx, .xls"
					className="hidden"
					onChange={handleFileChange}
				/>
			</div>
			<p className="text-right text-body-1 text-status-destructive">
				{fileError}
			</p>
			<Select
				value={selectedUserName}
				onValueChange={(userName) => {
					setSelectedUserName(userName)
				}}
			>
				<SelectTrigger className="mt-2">
					<SelectValue placeholder={t('event.selectInstagramAccount')} />
				</SelectTrigger>
				<SelectContent>
					{userNames.map((userName) => (
						<SelectItem key={userName} value={userName}>
							{userName}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{isFetching && (
				<div className="flex items-center justify-center">
					<span className="mr-2">{t('event.crawlingInProgress')}</span>
					<Spinner />
				</div>
			)}
			<Select value={selectedId} onValueChange={handleValueChange}>
				<SelectTrigger className="mt-2">
					<SelectValue
						placeholder={t('event.selectPost')}
						children={
							selectedId
								? crawledEvents?.find((e) => String(e.id) === selectedId)
										?.caption || t('event.noCaption')
								: undefined
						}
					/>
				</SelectTrigger>
				<SelectContent>
					{crawledEvents?.map((event) => (
						<SelectItem
							key={event.id}
							value={event.id}
							className="h-[72px]"
							onMouseEnter={() => handleMouseEnter(String(event.id))}
							onMouseLeave={handleMouseLeave}
						>
							<div className="flex flex-row">
								<img
									src={`${BASE_URL}${event.displayUrl}`}
									className="mr-2"
									width={40}
								/>
								<div>
									<p>{event.caption || t('event.noCaption')}</p>
									<p className="mt-1.5 text-label-1 font-regular text-grayscale-500">{`${format(event.timestamp!, 'yyyy.MM.dd')} ${t('event.uploaded')}`}</p>
								</div>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
