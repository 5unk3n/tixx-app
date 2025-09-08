import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Divider } from 'react-native-paper'

import LogoutDialog from '@/components/auth/LogoutDialog'
import AppSettingsSection from '@/components/settings/AppSettingsSection'
import CustomerSupportSection from '@/components/settings/CustomerSupportSection'
import NotificationSection from '@/components/settings/NotificationSection'
import ProfileSection from '@/components/settings/ProfileSection'
import CustomListItem from '@/components/ui/display/CustomListItem'
import { CustomText } from '@/components/ui/display/CustomText'
import { useUser } from '@/hooks/queries/useUser'

export default function SettingsScreen() {
	const { t } = useTranslation()
	const { data: user } = useUser()
	const [isLogoutDialogVisible, setIsLogoutDialogVisible] = useState(false)
	const navigation = useNavigation()

	if (!user) return null

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<ProfileSection />
			<Divider className="mx-5" />
			<NotificationSection user={user} />
			<Divider className="mx-5" />
			<CustomerSupportSection />
			<Divider className="mx-5" />
			<AppSettingsSection />
			<Divider className="mx-5" />
			<View className="mt-6">
				<CustomListItem
					title={t('auth.logout')}
					onPress={() => setIsLogoutDialogVisible(true)}
				/>
				<CustomListItem
					title={t('auth.accountDeletion')}
					onPress={() => navigation.navigate('AccountDeletion')}
				/>
			</View>
			<View className="p-5">
				<CustomText variant="body3Medium" className="mb-2 text-grayscale-300">
					사업자 정보
				</CustomText>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-300"
				>
					상호: 아비치
				</CustomText>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-300"
				>
					대표: 김휘진
				</CustomText>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-300"
				>
					주소: 서울특별시 성동구 한림말길 35, B101호(옥수동, 상아빌라)
				</CustomText>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-300"
				>
					사업자 등록번호: 115-40-01461
				</CustomText>
				<CustomText
					variant="caption1RegularLarge"
					className="text-grayscale-300"
				>
					대표번호: 050-6551-9787
				</CustomText>
			</View>
			<LogoutDialog
				visible={isLogoutDialogVisible}
				onDismiss={() => setIsLogoutDialogVisible(false)}
			/>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 24,
		paddingBottom: 8
	}
})
