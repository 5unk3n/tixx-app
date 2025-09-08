import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Linking, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import emailImage from '@/assets/images/email.png'
import instagramImage from '@/assets/images/sns-instagram.png'

import CustomIcon from '../ui/display/CustomIcon'
import CustomListItem from '../ui/display/CustomListItem'
import { CustomText } from '../ui/display/CustomText'
import CustomDialog from '../ui/feedback/CustomDialog'
import CustomButton from '../ui/input/CustomButton'

export default function ProfileSection() {
	const navigation = useNavigation()
	const { t } = useTranslation()
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	return (
		<View className="mt-6 pb-3">
			<CustomText
				variant="body3Medium"
				className="mx-5 mb-3 text-grayscale-400"
			>
				{t('common.myProfile')}
			</CustomText>
			<CustomListItem
				title={t('common.orderHistory')}
				rightElement={<CustomIcon name="arrowRight" size={20} />}
				onPress={() => navigation.navigate('OrderHistory')}
			/>
			<CustomListItem
				title={t('common.settings.feedback')}
				rightElement={<CustomIcon name="arrowRight" size={20} />}
				onPress={() => navigation.navigate('Feedback')}
			/>
			<CustomListItem
				title={t('common.contactUs')}
				rightElement={<CustomIcon name="arrowRight" size={20} />}
				onPress={() => setIsDialogOpen(true)}
			/>
			<CustomDialog
				visible={isDialogOpen}
				onDismiss={() => setIsDialogOpen(false)}
				dismissable
				dismissableBackButton
			>
				<CustomDialog.Title>
					{t('common.contactUs.selectMethod')}
				</CustomDialog.Title>
				<CustomDialog.Content className="mt-9">
					<TouchableRipple
						onPress={() =>
							Linking.openURL('https://www.instagram.com/tixx.official/')
						}
						className="rounded-lg"
						borderless
					>
						<View className="flex-row items-center pl-5 py-4 bg-grayscale-700">
							<Image source={instagramImage} />
							<View className="ml-2">
								<CustomText variant="body3Medium">
									{t('common.instagram')}
								</CustomText>
								<CustomText variant="body3Medium">@tixx.official</CustomText>
							</View>
							<CustomIcon name="chevronRight" className="ml-auto text-white" />
						</View>
					</TouchableRipple>
					<TouchableRipple
						onPress={() => {
							Linking.openURL('mailto:tixxofficial@tixx.im')
						}}
						className="rounded-lg mt-4"
						borderless
					>
						<View className="flex-row items-center pl-5 py-4 bg-grayscale-700">
							<Image source={emailImage} />
							<View className="ml-2">
								<CustomText variant="body3Medium">
									{t('common.email')}
								</CustomText>
								<CustomText variant="body3Medium">
									tixxofficial@tixx.im
								</CustomText>
							</View>
							<CustomIcon name="chevronRight" className="ml-auto text-white" />
						</View>
					</TouchableRipple>
				</CustomDialog.Content>
				<CustomDialog.Actions className="mt-9">
					{/* <CustomButton mode="contained" colorVariant="secondary" flex>
						취소하기
					</CustomButton> */}
					<CustomButton
						onPress={() => setIsDialogOpen(false)}
						mode="contained"
						colorVariant="primary"
						flex
					>
						{t('common.confirm')}
					</CustomButton>
				</CustomDialog.Actions>
			</CustomDialog>
		</View>
	)
}
