import React, { createContext, useContext } from 'react'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { CustomText } from '../display/CustomText'

interface TabsContextType<T extends string> {
	value: T
	onChange: (value: T) => void
	type?: 'underline' | 'filled'
}

const TabsContext = createContext<TabsContextType<any> | null>(null)

function useTabsContext<T extends string>() {
	const context = useContext(TabsContext)
	if (!context) {
		throw new Error(
			'Tab compound components must be used within Tabs component'
		)
	}
	return context as TabsContextType<T>
}

interface TabsProps<T extends string> extends TabsContextType<T> {
	children: React.ReactNode
}

export default function Tabs<T extends string>({
	value,
	onChange,
	type = 'underline',
	children,
	...props
}: TabsProps<T>) {
	const classNames = {
		tabsUnderline: 'flex-row sticky bg-background',
		tabsFilled: 'flex-row gap-3'
	}

	return (
		<TabsContext.Provider value={{ value, onChange, type }}>
			<View
				className={
					type === 'underline'
						? classNames.tabsUnderline
						: classNames.tabsFilled
				}
				{...props}
			>
				{children}
			</View>
		</TabsContext.Provider>
	)
}

// TODO: 타입 추론 되게 수정하기
interface TabProps<T extends string> {
	value: T
	label: string
}

function Tab<T extends string>({ value, label, ...props }: TabProps<T>) {
	const { value: currentValue, onChange, type } = useTabsContext<T>()
	const isActive = value === currentValue

	const classNames = {
		underline: 'flex-1 py-3 items-center border-b-[1px] border-grayscale-2',
		underlineActive:
			'flex-1 py-3 items-center border-b-[1px] border-grayscale-2 border-grayscale-8',
		underlineText: 'text-grayscale-3',
		underlineTextActive: 'text-grayscale-8',
		filled: 'px-3 py-[10] bg-grayscale-1 rounded-lg',
		filledActive: 'px-3 py-[10] bg-primary rounded-lg',
		filledText: 'text-grayscale-w',
		filledTextActive: 'text-grayscale-w'
	}

	return (
		<TouchableRipple
			key={value}
			onPress={() => onChange(value)}
			className={
				type === 'underline'
					? isActive
						? classNames.underlineActive
						: classNames.underline
					: isActive
						? classNames.filledActive
						: classNames.filled
			}
			{...props}
		>
			<CustomText
				variant="body1Medium"
				className={
					type === 'underline'
						? isActive
							? classNames.underlineTextActive
							: classNames.underlineText
						: isActive
							? classNames.filledTextActive
							: classNames.filledText
				}
			>
				{label}
			</CustomText>
		</TouchableRipple>
	)
}

Tabs.Tab = Tab
