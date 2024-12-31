import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Divider } from 'react-native-paper'

import LogoutDialog from '@/components/auth/LogoutDialog'
import AppSettingsSection from '@/components/settings/AppSettingsSection'
import CustomerSupportSection from '@/components/settings/CustomerSupportSection'
import NotificationSection from '@/components/settings/NotificationSection'
import ProfileSection from '@/components/settings/ProfileSection'
import CustomListItem from '@/components/ui/display/CustomListItem'
import { useUser } from '@/hooks/queries/useUser'

export default function SettingsScreen() {
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
					title="로그아웃"
					onPress={() => setIsLogoutDialogVisible(true)}
				/>
				<CustomListItem
					title="회원탈퇴"
					onPress={() => navigation.navigate('AccountDeletion')}
				/>
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
