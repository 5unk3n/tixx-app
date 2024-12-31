import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useRef, useState } from 'react'
import { View, Image, ScrollView, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Divider } from 'react-native-paper'

import EventDetail from '@/components/events/EventDetail'
import EventInfo from '@/components/events/EventInfo'
import EventReaction from '@/components/events/EventReaction'
import EventTags from '@/components/events/EventTags'
import { CustomText } from '@/components/ui/display/CustomText'
import Tabs from '@/components/ui/navigation/Tabs'
import { useCustomTheme } from '@/hooks/useCustomTheme'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'EventDetail'>

export default function EventDetailScreen({ route }: Props) {
	const event = route.params
	const { colors } = useCustomTheme()
	const [activeTab, setActiveTab] = useState<'info' | 'detail' | 'reaction'>(
		'info'
	)
	const scrollViewRef = useRef<ScrollView>(null)
	const infoRef = useRef<View>(null)
	const detailRef = useRef<View>(null)
	const reactionRef = useRef<View>(null)

	const scrollToSection = (tab: typeof activeTab) => {
		setActiveTab(tab)

		const targetRef = {
			info: infoRef,
			detail: detailRef,
			reaction: reactionRef
		}[tab]

		targetRef.current?.measureLayout(
			scrollViewRef.current?.getInnerViewNode(),
			(_, y) => {
				scrollViewRef.current?.scrollTo({
					y: y - 43, // 헤더 높이만큼 오프셋 조정
					animated: true
				})
			}
		)
	}

	return (
		<ScrollView
			ref={scrollViewRef}
			stickyHeaderIndices={[1]}
			contentContainerStyle={styles.container}
		>
			<View>
				<Image source={{ uri: event.imageUrl }} className="h-60" />
				<LinearGradient
					colors={['transparent', 'transparent', colors.background]}
					locations={[0, 0.2, 1]}
					className="absolute top-0 bottom-0 left-0 right-0"
				/>
				<View className="absolute left-5 bottom-0">
					<EventTags tags={event.tags} className="mb-2" />
					<CustomText variant="h1Semibold" className="mb-4">
						{event.name}
					</CustomText>
					{/* FIXME: 디자인 수정 후 고치기 */}
					{/* <CustomButton
						mode="text"
						size="sm"
						labelVariant="body3Regular"
						className="-ml-3 mb-4"
						labelStyle={{ color: colors.grayscale[5] }}
					>
						{`산상 >`}
					</CustomButton> */}
				</View>
			</View>
			<Tabs value={activeTab} onChange={scrollToSection}>
				<Tabs.Tab value="info" label="정보" />
				<Tabs.Tab value="detail" label="상세" />
				<Tabs.Tab value="reaction" label="실시간" />
			</Tabs>
			<View className="px-5 gap-9">
				<View ref={infoRef} className="pt-6">
					<EventInfo event={event} mode="detail" />
				</View>
				<Divider className="relative right-5 w-screen h-1 bg-grayscale-1" />
				<View ref={detailRef}>
					<EventDetail event={event} />
				</View>
				<Divider className="relative right-5 w-screen h-1 bg-grayscale-1" />
				<View ref={reactionRef}>
					<EventReaction eventId={event.id} />
				</View>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: 220
	}
})
