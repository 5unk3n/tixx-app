import React from 'react'
import { Linking, View } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { UI } from '@/constants/ui'

import CustomListItem from '../ui/display/CustomListItem'
import { CustomText } from '../ui/display/CustomText'

export default function AppSettingsSection() {
	const appVersion = DeviceInfo.getVersion()

	return (
		<View className="mt-6 mb-3">
			<CustomText variant="body3Medium" className="mx-5 mb-3 text-grayscale-5">
				{UI.COMMON.SETTINGS}
			</CustomText>
			<CustomListItem
				title={UI.COMMON.APP_VERSION}
				description={`${UI.COMMON.CURRENT_VERSION} : ${appVersion}`}
				right={() => (
					<CustomText variant="body3Regular" className="text-primary">
						{/* TODO: 최신 버전 받아오기 추 */}
						{UI.COMMON.LATEST_VERSION}
					</CustomText>
				)}
			/>
			<CustomListItem
				title={UI.COMMON.TERMS_AND_POLICIES}
				onPress={() =>
					Linking.openURL(
						'https://steel-comfort-fff.notion.site/Tixx-130b7639f31a8052a822f86016b1b3aa?pvs=74'
					)
				}
			/>
		</View>
	)
}
