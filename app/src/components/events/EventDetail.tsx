import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	FlatList,
	Image,
	Linking,
	Pressable,
	StyleSheet,
	View
} from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import blogImage from '@/assets/images/sns-blog.png'
import homepageImage from '@/assets/images/sns-homepage.png'
import instagramImage from '@/assets/images/sns-instagram.png'
import tiktokImage from '@/assets/images/sns-tiktok.png'
import youtubeImage from '@/assets/images/sns-youtube.png'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { Event } from '@/types'

import CustomIcon from '../ui/display/CustomIcon'
import { CustomText } from '../ui/display/CustomText'

interface EventDetailProps {
	event: Omit<Event, 'eventMedias' | 'tickets'>
}

export default function EventDetail({ event }: EventDetailProps) {
	const { colors } = useCustomTheme()
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
	const [isNoticeExpanded, setIsNoticeExpanded] = useState(false)
	const { t } = useTranslation()

	const rawSnsList = [
		{
			name: t('events.snsLinks.instagram' as any),
			image: instagramImage,
			url: event.instagramUrl
		},
		{
			name: t('events.snsLinks.tiktok' as any),
			image: tiktokImage,
			url: event.tiktokUrl
		},
		{
			name: t('events.snsLinks.blog' as any),
			image: blogImage,
			url: event.blogUrl
		},
		{
			name: t('events.snsLinks.youtube' as any),
			image: youtubeImage,
			url: event.youtubeUrl
		},
		{
			name: t('events.snsLinks.homepage' as any),
			image: homepageImage,
			url: event.homepageUrl
		}
	]
	const snsList = rawSnsList.filter((item) => !!item.url)

	return (
		<View>
			{snsList.length > 0 && (
				<>
					<CustomText
						variant="headline1Semibold"
						className="text-grayscale-100 mb-2"
					>
						{'SNS'}
					</CustomText>
					<FlatList
						data={snsList}
						renderItem={({ item, index }) => (
							<TouchableRipple
								onPress={() => item.url && Linking.openURL(item.url)}
							>
								<View className="items-center" key={index}>
									<Image source={item.image} />
									<CustomText variant="body3Regular" className="mt-2">
										{item.name}
									</CustomText>
								</View>
							</TouchableRipple>
						)}
						horizontal
						contentContainerStyle={styles.contentContainer}
					/>
				</>
			)}
			<CustomText
				variant="headline1Semibold"
				className="text-grayscale-100 mb-2 mt-6"
			>
				{t('events.detail.notice')}
			</CustomText>
			<Pressable
				onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
			>
				<View className="pt-5 px-5 pb-3 bg-grayscale-800 border-grayscale-700 border-[1px] rounded-xl">
					<CustomText
						variant="body1Regular"
						numberOfLines={isDescriptionExpanded ? undefined : 5}
						className="leading-5"
					>
						{event.description}
					</CustomText>
					<View className="mt-2 items-center">
						<CustomIcon
							name={isDescriptionExpanded ? 'chevronUp' : 'chevronDown'}
							color={colors.grayscale[500]}
						/>
					</View>
				</View>
			</Pressable>
			{event.notice && (
				<>
					<CustomText
						variant="headline1Semibold"
						className="text-grayscale-100 mb-2 mt-6"
					>
						{t('events.noticeInfo')}
					</CustomText>
					<Pressable onPress={() => setIsNoticeExpanded(!isNoticeExpanded)}>
						<View className="pt-5 px-5 pb-3 bg-grayscale-800 border-grayscale-700 border-[1px] rounded-xl">
							<CustomText
								variant="body1Regular"
								numberOfLines={isNoticeExpanded ? undefined : 5}
							>
								{event.notice}
							</CustomText>
							<View className="mt-2 items-center">
								<CustomIcon
									name={isNoticeExpanded ? 'chevronUp' : 'chevronDown'}
									color={colors.grayscale[500]}
								/>
							</View>
						</View>
					</Pressable>
				</>
			)}
		</View>
	)
}

const styles = StyleSheet.create({ contentContainer: { gap: 32 } })
