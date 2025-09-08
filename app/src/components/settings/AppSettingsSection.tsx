import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Pressable, View } from 'react-native'
import { useStallionUpdate } from 'react-native-stallion'

import { useAppVersion } from '@/hooks/useAppVersion'
import { useDeveloperMode } from '@/hooks/useDeveloperMode'

import LogoutDialog from '../auth/LogoutDialog'
import CustomIcon from '../ui/display/CustomIcon'
import CustomListItem from '../ui/display/CustomListItem'
import { CustomText } from '../ui/display/CustomText'

export default function AppSettingsSection() {
	const { t } = useTranslation()
	const navigation = useNavigation()
	const [isLogoutDialogVisible, setIsLogoutDialogVisible] = useState(false)
	const { currentVersion, latestVersion } = useAppVersion(false)
	const { handlePress, handleLongPress, isDevModeUnlocked } = useDeveloperMode()
	const { currentlyRunningBundle } = useStallionUpdate()

	return (
		<View className="mt-6 mb-3">
			<CustomText
				variant="body3Medium"
				className="mx-5 mb-3 text-grayscale-400"
			>
				{t('common.settings.title')}
			</CustomText>
			<CustomListItem
				title={t('common.settings.appVersion')}
				description={t('common.settings.currentVersion', {
					version: isDevModeUnlocked
						? `${currentVersion}.${currentlyRunningBundle?.version}`
						: currentVersion
				})}
				rightElement={
					<Pressable
						onPress={handlePress}
						onLongPress={handleLongPress}
						delayLongPress={2000}
					>
						<CustomText variant="body3Regular">
							{`${t('common.settings.latestVersion')} : ${latestVersion}`}
						</CustomText>
					</Pressable>
				}
			/>
			<CustomListItem
				title={t('common.settings.terms')}
				rightElement={<CustomIcon name="arrowRight" size={20} />}
				onPress={() =>
					Linking.openURL(
						'https://chemical-egg-b86.notion.site/Tixx-1d5af5a3ef1580b8b03fc6eb186892b9'
					)
				}
			/>
			<CustomListItem
				title={t('common.settings.language')}
				rightElement={<CustomIcon name="arrowRight" size={20} />}
				onPress={() => navigation.navigate('Language')}
			/>
			<CustomListItem
				title={t('auth.logout')}
				onPress={() => setIsLogoutDialogVisible(true)}
			/>
			<CustomListItem
				title={t('auth.accountDeletion')}
				onPress={() => navigation.navigate('AccountDeletion')}
			/>
			<LogoutDialog
				visible={isLogoutDialogVisible}
				onDismiss={() => setIsLogoutDialogVisible(false)}
			/>
		</View>
	)
}
