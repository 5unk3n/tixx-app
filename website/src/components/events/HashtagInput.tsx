import { X } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'

import { useHashtags } from '@/hooks/queries/hashtags/useHashtags'
import { cn } from '@/lib/utils'
import { Hashtags } from '@/types'

type HashtagItem = {
	text: string
	isCustom: boolean
}
interface HashtagInputProps {
	value: string[]
	onChange: (value: string[]) => void
	placeholder?: string
	error?: boolean
	className?: string
}

export default function HashtagInput({
	value,
	onChange,
	placeholder,
	error,
	className
}: HashtagInputProps) {
	const { i18n } = useTranslation()
	const { data: hashtags } = useHashtags()
	const [isOpen, setIsOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [filteredHashtags, setFilteredHashtags] = useState<Hashtags>([])
	const [hashtagItems, setHashtagItems] = useState<HashtagItem[]>([])
	const [isComposing, setIsComposing] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// 현재 언어에 따라 해시태그 표시 이름 결정
	const getDisplayName = useCallback(
		(hashtag: Hashtags[number]) => {
			return i18n.language === 'ko' && hashtag.korName
				? hashtag.korName
				: hashtag.key
		},
		[i18n.language]
	)

	// 저장된 key 값에 해당하는 해시태그 객체 찾기
	const findHashtagByKey = useCallback(
		(key: string) => {
			return hashtags?.find((hashtag) => hashtag.key === key)
		},
		[hashtags]
	)

	// value 배열을 HashtagItem 배열로 변환
	useEffect(() => {
		if (value.length === 0) {
			setHashtagItems([])
			return
		}

		// 기존 해시태그 아이템들을 유지하면서 새로운 value와 동기화
		const newItems: HashtagItem[] = value.map((key) => {
			// 저장된 key에 해당하는 해시태그 찾기
			const hashtag = findHashtagByKey(key)
			if (hashtag) {
				// 해시태그가 존재하면 언어에 맞는 표시 이름 사용
				return { text: getDisplayName(hashtag), isCustom: false }
			} else {
				// 해시태그가 없으면 직접 입력으로 간주
				return { text: key, isCustom: true }
			}
		})

		setHashtagItems(newItems)
	}, [value, hashtags, i18n.language, findHashtagByKey, getDisplayName])

	// 검색어에 따른 해시태그 필터링
	useEffect(() => {
		if (!hashtags || !searchQuery.trim()) {
			setFilteredHashtags([])
			return
		}

		const query = searchQuery.toLowerCase().trim()
		const filtered = hashtags.filter((hashtag) => {
			// key, korName, aliases에서 검색
			const keyMatch = hashtag.key.toLowerCase().includes(query)
			const korNameMatch =
				hashtag.korName?.toLowerCase().includes(query) || false
			const aliasesMatch = hashtag.aliases.some((alias) =>
				alias.alias.toLowerCase().includes(query)
			)

			// 이미 선택된 해시태그는 제외 (key로 비교)
			const isAlreadySelected = value.includes(hashtag.key)

			return (keyMatch || korNameMatch || aliasesMatch) && !isAlreadySelected
		})

		setFilteredHashtags(filtered)
	}, [hashtags, searchQuery, value])

	// 해시태그 선택 처리
	const handleHashtagSelect = (hashtag: Hashtags[number]) => {
		// key로 저장
		const key = hashtag.key

		// 이미 선택된 해시태그가 아닌 경우에만 추가
		if (!value.includes(key)) {
			const displayName = getDisplayName(hashtag)
			const newItems = [...hashtagItems, { text: displayName, isCustom: false }]
			setHashtagItems(newItems)
			onChange([...value, key])
		}

		setSearchQuery('')
		setIsOpen(false)
		inputRef.current?.focus()
	}

	// 해시태그 제거 처리
	const handleHashtagRemove = (displayText: string) => {
		// 표시 텍스트에 해당하는 key 찾기
		const keyToRemove = value.find((key) => {
			const hashtag = findHashtagByKey(key)
			return hashtag
				? getDisplayName(hashtag) === displayText
				: key === displayText
		})

		if (keyToRemove) {
			const newItems = hashtagItems.filter((item) => item.text !== displayText)
			setHashtagItems(newItems)
			onChange(value.filter((key) => key !== keyToRemove))
		}
	}

	// 대표 해시태그 설정 (맨 앞으로 이동)
	const handleSetMainHashtag = (displayText: string) => {
		// 표시 텍스트에 해당하는 key 찾기
		const keyToMove = value.find((key) => {
			const hashtag = findHashtagByKey(key)
			return hashtag
				? getDisplayName(hashtag) === displayText
				: key === displayText
		})

		if (keyToMove) {
			const filtered = value.filter((key) => key !== keyToMove)
			const newValue = [keyToMove, ...filtered]

			// hashtagItems도 동일하게 재정렬
			const itemToMove = hashtagItems.find((item) => item.text === displayText)
			const filteredItems = hashtagItems.filter(
				(item) => item.text !== displayText
			)
			const newItems = itemToMove
				? [itemToMove, ...filteredItems]
				: filteredItems

			setHashtagItems(newItems)
			onChange(newValue)
		}
	}

	// 직접 입력 처리
	const handleDirectInput = () => {
		const trimmedQuery = searchQuery.trim()
		if (trimmedQuery && !value.includes(trimmedQuery)) {
			const newItems = [...hashtagItems, { text: trimmedQuery, isCustom: true }]
			setHashtagItems(newItems)
			onChange([...value, trimmedQuery])
			setSearchQuery('')
			setIsOpen(false)
		}
	}

	// 키보드 이벤트 처리
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// IME 조합 중일 때는 처리하지 않음
		if (isComposing) return

		if (e.key === 'Enter') {
			e.preventDefault()
			handleDirectInput()
		}
	}

	// IME 조합 시작
	const handleCompositionStart = () => {
		setIsComposing(true)
	}

	// IME 조합 완료
	const handleCompositionEnd = () => {
		setIsComposing(false)
	}

	// 입력값 변경 처리
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		setSearchQuery(newValue)
		setIsOpen(true)
	}

	// 입력 필드 포커스 처리
	const handleInputFocus = () => {
		setIsOpen(true)
	}

	// 외부 클릭시 드롭다운 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!inputRef.current?.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// 검색어가 비어있을 때 드롭다운 닫기
	useEffect(() => {
		if (!searchQuery.trim()) {
			setIsOpen(false)
		}
	}, [searchQuery])

	return (
		<div className={cn('space-y-3', className)}>
			{/* 선택된 해시태그 칩들 */}
			{hashtagItems.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{hashtagItems.map((item, index) => (
						<div
							key={item.text}
							className={cn(
								'flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
								index === 0
									? 'bg-grayscale-800 text-white shadow-md ring-2 ring-grayscale-300'
									: 'bg-grayscale-100 text-grayscale-700 hover:bg-grayscale-200'
							)}
							onClick={() => index !== 0 && handleSetMainHashtag(item.text)}
							title={
								index !== 0 ? '클릭하여 대표 해시태그로 설정' : '대표 해시태그'
							}
						>
							<span>{item.text}</span>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									handleHashtagRemove(item.text)
								}}
								className={cn(
									'ml-1 rounded-full p-0.5',
									index === 0
										? 'hover:bg-grayscale-600'
										: 'hover:bg-grayscale-300'
								)}
							>
								<X size={14} className="text-grayscale-600" />
							</button>
						</div>
					))}
				</div>
			)}

			{/* 입력 필드와 드롭다운 */}
			<div className="relative">
				<Input
					ref={inputRef}
					type="text"
					value={searchQuery}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onCompositionStart={handleCompositionStart}
					onCompositionEnd={handleCompositionEnd}
					onFocus={handleInputFocus}
					placeholder={placeholder}
					error={error}
					className="w-full"
				/>

				{isOpen && filteredHashtags.length > 0 && (
					<div
						ref={dropdownRef}
						className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
					>
						<ScrollArea className="h-60">
							<div className="p-2">
								<div className="flex flex-wrap gap-2">
									{filteredHashtags.map((hashtag) => {
										const displayName = getDisplayName(hashtag)
										const isExactMatch =
											displayName.toLowerCase() === searchQuery.toLowerCase() ||
											hashtag.key.toLowerCase() === searchQuery.toLowerCase()

										return (
											<button
												key={hashtag.id}
												type="button"
												onClick={() => handleHashtagSelect(hashtag)}
												className={cn(
													'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50',
													isExactMatch
														? 'bg-primary-50 border-primary-500 text-primary-700'
														: 'border-gray-300 bg-white text-gray-700'
												)}
											>
												<span>{displayName}</span>
												{/* 한국어일 때만 영어 키를 괄호로 표시 */}
												{i18n.language === 'ko' &&
													hashtag.korName &&
													hashtag.korName !== hashtag.key && (
														<span className="text-xs text-gray-500">
															({hashtag.key})
														</span>
													)}
											</button>
										)
									})}
								</div>
							</div>
						</ScrollArea>
					</div>
				)}
			</div>
		</div>
	)
}
