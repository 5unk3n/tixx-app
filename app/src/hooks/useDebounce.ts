import debounce from 'lodash.debounce'
import { useEffect, useRef, useState } from 'react'

interface UseDebounceOptions<T> {
	value: T
	delay?: number
}

export function useDebounce<T>({
	value,
	delay = 400
}: UseDebounceOptions<T>): T {
	const [debouncedValue, setDebouncedValue] = useState(value)
	const debouncedSetValue = useRef<ReturnType<typeof debounce>>()

	useEffect(() => {
		debouncedSetValue.current = debounce((val: T) => {
			setDebouncedValue(val)
		}, delay)
		return () => {
			debouncedSetValue.current?.cancel()
		}
	}, [delay])

	useEffect(() => {
		debouncedSetValue.current?.(value)
	}, [value])

	return debouncedValue
}
