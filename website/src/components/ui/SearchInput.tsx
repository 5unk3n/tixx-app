import { cva } from 'class-variance-authority'
import React, { useState } from 'react'

import { Button } from './button'
import { Input } from './input'

import Search from '@/assets/icons/search.svg?react'

interface SearchInputProps {
	value?: string
	onChange?: (value: string) => void
	onSearch?: () => void
	placeholder?: string
	size?: 'lg' | 'md'
}

export default function SearchInput({
	value,
	onChange,
	onSearch,
	placeholder = '검색',
	size = 'lg'
}: SearchInputProps) {
	const [internalValue, setInternalValue] = useState('')
	const inputValue = value !== undefined ? value : internalValue

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onChange) onChange(e.target.value)
		else setInternalValue(e.target.value)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && onSearch) onSearch()
	}

	return (
		<div className="relative w-full">
			<Input
				className={inputVariants({ size })}
				placeholder={placeholder}
				value={inputValue}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>
			<Button
				type="button"
				size="icon"
				className={buttonVariants({ size })}
				onClick={onSearch}
			>
				<Search />
			</Button>
		</div>
	)
}

const inputVariants = cva(
	'bg-white rounded-2xl border-0 px-8 py-2 placeholder:text-grayscale-400 shadow-[0_12px_24px_rgba(20,20,43,0.04),0_-2px_4px_rgba(20,20,43,0.04)]',
	{
		variants: {
			size: {
				lg: 'text-title-3 font-medium h-[77px] pr-16',
				md: 'text-body-1 font-regular h-11 pr-12'
			}
		},
		defaultVariants: {
			size: 'lg'
		}
	}
)

const buttonVariants = cva(
	'absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full border-0 p-0 shadow-none bg-primary-500 hover:bg-primary-400 active:bg-primary-300',
	{
		variants: {
			size: {
				lg: 'w-[82px] h-[59px] [&_svg]:size-[26px]',
				md: 'w-[42px] h-[34px] rounded-[50px] [&_svg]:size-[17px]'
			}
		},
		defaultVariants: {
			size: 'lg'
		}
	}
)
