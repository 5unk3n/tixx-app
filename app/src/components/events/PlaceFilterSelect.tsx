import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Menu, TouchableRipple } from 'react-native-paper'

import { useCustomTheme } from '@/hooks/useCustomTheme'

import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'

const cities = [
	'서울특별시',
	'인천광역시',
	'대전광역시',
	'대구광역시',
	'울산광역시',
	'부산광역시',
	'광주광역시',
	'제주특별자치도'
] as const

interface PlaceFilterSelectProps {
	value: string
	onSelect: (value: string) => void
}

export default function PlaceFilterSelect({
	value,
	onSelect
}: PlaceFilterSelectProps) {
	const { t } = useTranslation()
	const { colors, fonts } = useCustomTheme()
	const [isVisible, setIsVisible] = useState(false)

	return (
		<Menu
			anchor={
				<TouchableRipple
					onPress={() => setIsVisible(true)}
					className="rounded-[20px]"
					borderless
				>
					<View className="flex-row items-center bg-grayscale-800 px-2.5 py-2 h-9">
						<CustomIcon
							name={'mapPin'}
							size={16}
							className="text-grayscale-300 mr-1"
						/>
						<CustomText variant="body1Regular" className="text-grayscale-300">
							{value
								? t(`search.cities.${value as (typeof cities)[number]}`)
								: t('common.location')}
						</CustomText>
					</View>
				</TouchableRipple>
			}
			anchorPosition="bottom"
			onDismiss={() => setIsVisible(false)}
			visible={isVisible}
			contentStyle={[
				styles.menuContent,
				{ backgroundColor: colors.grayscale[800] }
			]}
			style={styles.menu}
		>
			{cities.map((city, index) => (
				<Menu.Item
					key={city}
					title={t(`search.cities.${city as (typeof cities)[number]}`)}
					onPress={() => {
						onSelect(value === city ? '' : city)
						setIsVisible(false)
					}}
					style={[
						styles.menuItem,
						{
							borderColor: colors.grayscale[600]
						},
						index === 0 && styles.menuItemWithoutBorder
					]}
					titleStyle={[
						styles.menuItemTitle,
						fonts.body1Regular,
						city === value && { color: colors.primary }
					]}
					trailingIcon={city === value ? CheckedTrailingIcon : undefined}
				/>
			))}
		</Menu>
	)
}

const styles = StyleSheet.create({
	menu: { borderRadius: 20, overflow: 'hidden' },
	menuContent: {
		marginTop: 4,
		paddingVertical: 0
	},
	menuItem: {
		borderTopWidth: 0.5
	},
	menuItemTitle: { minWidth: 200 },
	menuItemWithoutBorder: {
		borderTopWidth: 0
	}
})

const CheckedTrailingIcon = () => <CustomIcon name={'checkboxMinimalChecked'} />
