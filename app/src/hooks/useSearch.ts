import AsyncStorage from '@react-native-async-storage/async-storage'
import { useCallback, useEffect, useState } from 'react'

import { SEARCH_HISTORY_KEY } from '@/constants/storeKey'

import { useDebounce } from './useDebounce'

interface UseSearchOptions<T> {
	searchFunction?: (query: string) => Promise<T[]>
	isLoadHistory?: boolean
	autoSearch?: boolean
	debounceMs?: number
}

// TODO: 쿼리 훅에 맞게 리팩터링
export const useSearch = <T>({
	searchFunction,
	isLoadHistory = true,
	autoSearch = false,
	debounceMs = 400
}: UseSearchOptions<T>) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResult, setSearchResult] = useState<T[]>([])
	const [searchHistory, setSearchHistory] = useState<string[]>([])
	const [isSearchHistoryEnabled, setIsSearchHistoryEnabled] = useState(true)
	const [submittedQuery, setSubmittedQuery] = useState('')

	const debouncedQuery = useDebounce({ value: searchQuery, delay: debounceMs })

	const loadSearchHistory = useCallback(async () => {
		const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY)
		setSearchHistory(history ? JSON.parse(history) : [])
	}, [])

	const addSearchHistory = useCallback(async (query: string) => {
		if (!query.trim()) return
		const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY)
		let arr: string[] = history ? JSON.parse(history) : []
		arr = [query, ...arr.filter((q) => q !== query)].slice(0, 10)
		await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(arr))
		setSearchHistory(arr)
	}, [])

	const deleteSearchHistory = async (query: string) => {
		const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY)
		let arr: string[] = history ? JSON.parse(history) : []
		arr = arr.filter((q) => q !== query)
		await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(arr))
		setSearchHistory(arr)
	}

	const clearSearchHistory = async () => {
		await AsyncStorage.removeItem(SEARCH_HISTORY_KEY)
		setSearchHistory([])
	}

	// searchFunction 참조 값이 바뀌면 무한 루프 발생
	const handleSearch = useCallback(
		async (query = searchQuery, isAddHistory = true) => {
			if (!query?.trim()) return
			setSubmittedQuery(query)
			if (searchFunction) {
				const result = await searchFunction(query)
				setSearchResult(result)
			}
			if (isAddHistory && isSearchHistoryEnabled) await addSearchHistory(query)
		},
		[searchQuery, searchFunction, addSearchHistory, isSearchHistoryEnabled]
	)

	useEffect(() => {
		if (autoSearch) {
			handleSearch(debouncedQuery, false)
		}
	}, [debouncedQuery, autoSearch, handleSearch])

	useEffect(() => {
		if (isLoadHistory) loadSearchHistory()
	}, [loadSearchHistory, isLoadHistory])

	const toggleSearchHistory = () => {
		setIsSearchHistoryEnabled((prev) => !prev)
	}

	const resetSearchQuery = () => setSearchQuery('')

	return {
		searchQuery,
		setSearchQuery,
		handleSearch,
		resetSearchQuery,
		debouncedQuery,
		submittedQuery,
		searchResult,
		searchHistory,
		loadSearchHistory,
		clearSearchHistory,
		toggleSearchHistory,
		isSearchHistoryEnabled,
		deleteSearchHistory
	}
}
