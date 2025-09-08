import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useCustomTheme } from '@/hooks/useCustomTheme'

import CustomTextInput, { CustomTextInputProps } from './CustomTextInput'
import CustomIcon from '../display/CustomIcon'

interface SearchInputProps extends CustomTextInputProps {
	onSearch: () => void
	searchQuery: string
	setSearchQuery: (text: string) => void
	placeholder?: string
}

export default function SearchInput({
	onSearch,
	searchQuery,
	setSearchQuery,
	placeholder,
	...props
}: SearchInputProps) {
	const { colors } = useCustomTheme()
	const { t } = useTranslation()

	return (
		<CustomTextInput
			placeholder={placeholder ?? t('search.placeholder' as const)}
			right={
				<View className="flex-row items-center">
					{searchQuery && (
						<CustomIcon
							name="close"
							color={colors.primary}
							className="active:opacity-10 mr-2"
							onPress={() => setSearchQuery('')}
							pointerEvents="auto"
						/>
					)}
					<CustomIcon
						name="search"
						color={colors.primary}
						className="active:opacity-10"
						onPress={() => onSearch()}
						pointerEvents="auto"
					/>
				</View>
			}
			containerStyle={[
				styles.containerBorder,
				{ backgroundColor: colors.background, borderColor: colors.primary }
			]}
			{...props}
			placeholderTextColor={colors.grayscale[300]}
			value={searchQuery}
			onChangeText={setSearchQuery}
			onSubmitEditing={() => onSearch()}
		/>
	)
}

const styles = StyleSheet.create({
	containerBorder: {
		borderWidth: 1,
		borderRadius: 25
	}
})
