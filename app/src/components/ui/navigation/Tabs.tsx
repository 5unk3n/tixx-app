import React, { createContext, useContext } from 'react'
import { View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { CustomText } from '../display/CustomText'

interface TabsContextType<T extends string> {
	value: T
	onChange: (value: T) => void
	type?: 'underline' | 'outline' | 'dot'
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
		tabsOutline: 'flex-row gap-3',
		tabsDot: 'flex-row gap-2'
	}

	return (
		<TabsContext.Provider value={{ value, onChange, type }}>
			<View
				className={
					type === 'underline'
						? classNames.tabsUnderline
						: type === 'outline'
							? classNames.tabsOutline
							: classNames.tabsDot
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
		underline: 'flex-1 py-3 items-center border-b-[1px] border-grayscale-700',
		underlineActive:
			'flex-1 py-3 items-center border-b-[1px] border-grayscale-700 border-grayscale-100',
		underlineText: 'text-grayscale-600',
		underlineTextActive: 'text-grayscale-100',
		outline: 'px-[19] py-[9] rounded-[20px] overflow-hidden',
		outlineActive:
			'px-[18] py-[8] border border-primary rounded-[20px] overflow-hidden',
		outlineText: 'text-grayscale-0',
		outlineTextActive: 'text-grayscale-0',
		dot: 'px-[19] py-[9]',
		dotActive: 'px-[19] py-[9]',
		dotText: 'text-grayscale-500',
		dotTextActive: 'text-grayscale-0'
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
					: type === 'outline'
						? isActive
							? classNames.outlineActive
							: classNames.outline
						: isActive
							? classNames.dotActive
							: classNames.dot
			}
			borderless
			{...props}
		>
			<View>
				<CustomText
					variant="body1Medium"
					className={
						type === 'underline'
							? isActive
								? classNames.underlineTextActive
								: classNames.underlineText
							: type === 'outline'
								? isActive
									? classNames.outlineTextActive
									: classNames.outlineText
								: isActive
									? classNames.dotTextActive
									: classNames.dotText
					}
				>
					{label}
				</CustomText>
				{type === 'dot' && isActive && (
					<CustomText className="text-center">•</CustomText>
				)}
			</View>
		</TouchableRipple>
	)
}

Tabs.Tab = Tab
