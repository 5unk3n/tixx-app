import { useNavigation, useScrollToTop } from '@react-navigation/native'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, ScrollView, StyleSheet, View } from 'react-native'
import { Divider, TouchableRipple } from 'react-native-paper'

import AppSettingsSection from '@/components/settings/AppSettingsSection'
import BusinessInfo from '@/components/settings/BusinessInfo'
import NotificationSection from '@/components/settings/NotificationSection'
import ProfileSection from '@/components/settings/ProfileSection'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import { TAB_BAR_HEIGHT } from '@/constants/dimensions'
import { useUser } from '@/hooks/queries/useUser'
import { useCustomTheme } from '@/hooks/useCustomTheme'

export default function MyPageScreen() {
	const { colors } = useCustomTheme()
	const { data: user } = useUser()
	const navigation = useNavigation()
	const { t } = useTranslation()
	const scrollViewRef = useRef(null)

	useScrollToTop(scrollViewRef)

	return (
		<ScrollView
			ref={scrollViewRef}
			className="flex-1"
			contentContainerStyle={style.contentContainerStyle}
		>
			<View className="gap-1 mx-4">
				<TouchableRipple
					onPress={() => navigation.navigate('Profile', { mode: 'view' })}
				>
					<View className="flex-row items-center justify-start">
						<CustomText variant="body1Semibold">{user!.nickname}</CustomText>
						<CustomIcon name={'chevronRight'} color={colors.grayscale[0]} />
					</View>
				</TouchableRipple>
				<CustomText variant="body3Regular" className="text-grayscale-300">
					{user!.email}
				</CustomText>
			</View>
			<View className="mt-5 mx-4 flex-row justify-around items-center border-[0.5px] border-grayscale-600 rounded-lg">
				<TouchableRipple
					onPress={() => navigation.navigate('TicketManagement')}
					className="flex-1 pt-4 pb-3"
				>
					<View className="items-center">
						<CustomIcon
							name={'ticket'}
							color={colors.grayscale[0]}
							className="rotate-90"
						/>
						<CustomText variant="body3RegularLarge" className="mt-[2]">
							{t('common.ticketManagement')}
						</CustomText>
					</View>
				</TouchableRipple>
				<Divider className="h-[23] w-[1] bg-grayscale-600" />
				<TouchableRipple
					onPress={() => navigation.navigate('MyFollowings')}
					className="flex-1 pt-4 pb-3"
				>
					<View className="items-center">
						<CustomIcon name={'follow'} color={colors.grayscale[0]} />
						<CustomText variant="body3RegularLarge" className="mt-[2]">
							{t('common.follow')}
						</CustomText>
					</View>
				</TouchableRipple>
				<Divider className="h-[23] w-[1] bg-grayscale-600" />
				<TouchableRipple
					onPress={() => navigation.navigate('Wishlist')}
					className="flex-1 pt-4 pb-3"
				>
					<View className="items-center">
						<CustomIcon name={'heartLine'} color={colors.grayscale[0]} />
						<CustomText variant="body3RegularLarge" className="mt-[2]">
							{t('common.wishlist')}
						</CustomText>
					</View>
				</TouchableRipple>
			</View>
			<TouchableRipple
				onPress={() => Linking.openURL('https://admin.tixx.site')}
				className="mt-2 mx-4 rounded-lg"
				borderless
			>
				<View className="py-3 pl-4 pr-[10] flex-row items-center bg-grayscale-800">
					<CustomIcon
						name={'calendarAdd'}
						color={colors.grayscale[0]}
						size={24}
					/>
					<CustomText className="ml-4">{t('common.createEvent')}</CustomText>
					<CustomIcon
						name={'chevronRight'}
						color={colors.grayscale[0]}
						size={20}
						className="ml-auto"
					/>
				</View>
			</TouchableRipple>
			<NotificationSection user={user!} />
			<Divider className="mx-4" />
			<ProfileSection />
			<Divider className="mx-4" />
			<AppSettingsSection />
			<Divider className="mx-4" />
			<View className="mt-10 mx-4 mb-[22]">
				<BusinessInfo />
			</View>
		</ScrollView>
	)
}

const style = StyleSheet.create({
	contentContainerStyle: {
		paddingTop: 6,
		paddingBottom: TAB_BAR_HEIGHT
	}
})
