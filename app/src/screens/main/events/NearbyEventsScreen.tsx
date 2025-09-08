import {
	Camera,
	Coord,
	NaverMapMarkerOverlay,
	NaverMapView,
	NaverMapViewRef
} from '@mj-studio/react-native-naver-map'
import Geolocation from '@react-native-community/geolocation'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, PixelRatio, Platform } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import Animated, {
	FadeInLeft,
	FadeOutLeft,
	useAnimatedStyle,
	useSharedValue
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import EventBottomSheet from '@/components/events/EventBottomSheet'
import EventMarkers from '@/components/events/EventMarkers'
import CustomIcon from '@/components/ui/display/CustomIcon'
import { CustomText } from '@/components/ui/display/CustomText'
import { useCustomTheme } from '@/hooks/useCustomTheme'

const seoul = {
	latitude: 37.5665,
	longitude: 126.978,
	zoom: 16
}

const eventCategory = ['all', 'party', 'event', 'venue'] as const

export default function NearbyEventsScreen() {
	const { i18n, t } = useTranslation()
	const { colors } = useCustomTheme()
	const { bottom } = useSafeAreaInsets()
	const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
	// TODO: 카메라 로직 정리
	const [_camera, setCamera] = useState<Camera | undefined>(undefined)
	const [myLocation, setMyLocation] = useState<Coord | undefined>(undefined)
	const [currentCategory, setCurrentCategory] = useState<
		(typeof eventCategory)[number]
	>(eventCategory[0])
	const [mapLayout, setMapLayout] = useState<{
		width: number
		height: number
	} | null>(null)
	const [isCategoryExtended, setIsCategoryExtended] = useState(false)
	const mapRef = useRef<NaverMapViewRef>(null)
	const cameraRef = useRef<Camera | undefined>(undefined)
	const leftTopCoordRef = useRef<Coord | undefined>(undefined)
	const rightBottomCoordRef = useRef<Coord | undefined>(undefined)
	const bottomSheetAnimatedPosition = useSharedValue(0)

	const handleRefreshSearch = async () => {
		if (!mapLayout) return
		const MINIMUM_BOTTOM_SHEET_HEIGHT = 58 + bottom
		const screenX =
			Platform.OS === 'ios'
				? mapLayout.width
				: PixelRatio.getPixelSizeForLayoutSize(mapLayout.width)
		const screenY =
			Platform.OS === 'ios'
				? mapLayout.height - MINIMUM_BOTTOM_SHEET_HEIGHT
				: PixelRatio.getPixelSizeForLayoutSize(
						mapLayout.height - MINIMUM_BOTTOM_SHEET_HEIGHT
					)

		const leftTopCoord = await mapRef.current?.screenToCoordinate({
			screenX: 0,
			screenY: 0
		})
		const rightBottomCoord = await mapRef.current?.screenToCoordinate({
			screenX,
			screenY
		})

		if (leftTopCoord?.isValid) {
			leftTopCoordRef.current = leftTopCoord
		}
		if (rightBottomCoord?.isValid) {
			rightBottomCoordRef.current = rightBottomCoord
		}
		setCamera(cameraRef.current)
		setSelectedEventId(null)
	}

	const handleCameraChanged = async (newCamera: Camera) => {
		cameraRef.current = newCamera
	}

	const handleMyLocation = () => {
		Geolocation.getCurrentPosition((info) => {
			const newMyLocation = {
				latitude: info.coords.latitude,
				longitude: info.coords.longitude
			}
			setMyLocation(newMyLocation)
			mapRef.current?.animateCameraTo(newMyLocation)
		})
	}

	useEffect(() => {
		Geolocation.getCurrentPosition((info) => {
			setCamera({
				latitude: info.coords.latitude,
				longitude: info.coords.longitude,
				zoom: 16
			})
			setMyLocation({
				latitude: info.coords.latitude,
				longitude: info.coords.longitude
			})
			mapRef.current?.animateCameraTo({
				latitude: info.coords.latitude,
				longitude: info.coords.longitude,
				zoom: 16,
				duration: 0
			})
		})
	}, [])

	const animatedStyle = useAnimatedStyle(() => ({
		position: 'absolute',
		left: 16,
		transform: [{ translateY: bottomSheetAnimatedPosition.value - 44 }],
		display: 'flex',
		flexDirection: 'row'
	}))

	return (
		<View className="flex-1 rounded-t-lg overflow-hidden">
			<NaverMapView
				ref={mapRef}
				style={style.naverMap}
				onLayout={(event) => {
					const { width, height } = event.nativeEvent.layout
					setMapLayout({ width, height })
				}}
				initialCamera={seoul}
				onCameraChanged={handleCameraChanged}
				isShowCompass={false}
				isShowZoomControls={false}
				isShowLocationButton={false}
				isShowIndoorLevelPicker={false}
				isShowScaleBar={false}
				animationDuration={500}
				locale={i18n.language === 'ko' ? 'ko' : 'en'}
				logoAlign="BottomRight"
				logoMargin={{ bottom: 100 }}
				maxZoom={20}
				minZoom={12}
				isRotateGesturesEnabled={false}
				onTapMap={() => setSelectedEventId(null)}
			>
				{myLocation && (
					<NaverMapMarkerOverlay
						latitude={myLocation.latitude}
						longitude={myLocation.longitude}
						image={require('@/assets/images/my-location.png')}
						anchor={{ x: 0.5, y: 0.5 }}
					/>
				)}
				<EventMarkers
					coord1={leftTopCoordRef.current || seoul}
					coord2={rightBottomCoordRef.current || seoul}
					filterCategory={currentCategory}
					selectedEventId={selectedEventId}
					onPress={(eventId) =>
						setSelectedEventId((prev) => (prev === eventId ? null : eventId))
					}
				/>
			</NaverMapView>
			<View className="absolute top-8 px-4 flex-row items-center w-full justify-center">
				<TouchableRipple
					className="px-3 h-[34] rounded-full border border-grayscale-300 bg-grayscale-0"
					rippleColor="rgba(0,0,0,0.12)"
					borderless
					onPress={handleRefreshSearch}
				>
					<View className="flex-1 flex-row justify-center items-center">
						<CustomText variant="body3Medium" className="text-grayscale-700">
							{t('events.refreshSearch')}
						</CustomText>
						<CustomIcon
							name="replay"
							size={18}
							className="ml-2"
							color={colors.grayscale[700]}
						/>
					</View>
				</TouchableRipple>
				<TouchableRipple
					className="w-[38] h-[38] justify-center items-center rounded-full border border-grayscale-300 bg-grayscale-0 absolute right-4"
					rippleColor="rgba(0,0,0,0.12)"
					borderless
					onPress={handleMyLocation}
				>
					<CustomIcon
						name="myLocation"
						size={22}
						color={colors.grayscale[700]}
					/>
				</TouchableRipple>
			</View>
			<Animated.View style={animatedStyle}>
				<TouchableRipple onPress={() => setIsCategoryExtended((prev) => !prev)}>
					<View className="rounded-[20px] bg-primary pl-2.5 pr-0.5 py-[5px] flex-row items-center">
						<CustomText variant="body3Medium" className="text-grayscale-900">
							{currentCategory === 'all'
								? t('common.all')
								: t(`events.tags.${currentCategory}`)}
						</CustomText>
						<CustomIcon name="chevronRight" className="text-grayscale-900" />
					</View>
				</TouchableRipple>
				{isCategoryExtended && (
					<Animated.ScrollView
						horizontal
						entering={FadeInLeft.duration(200)}
						exiting={FadeOutLeft.duration(200)}
						className="flex-1 flex-row px-2"
						contentContainerStyle={style.contentContainer}
						showsHorizontalScrollIndicator={false}
					>
						{eventCategory.map((item) => (
							<TouchableRipple
								key={item}
								onPress={() => setCurrentCategory(item)}
							>
								<View
									className={`rounded-[20px]
								${
									currentCategory === item
										? 'bg-primary px-[20px] py-[10px]'
										: 'bg-white border border-grayscale-300 px-[19px] py-[9px]'
								}`}
								>
									<CustomText variant="body3Medium" className="text-background">
										{item === 'all'
											? t('common.all')
											: t(`events.tags.${item}`)}
									</CustomText>
								</View>
							</TouchableRipple>
						))}
					</Animated.ScrollView>
				)}
			</Animated.View>
			<EventBottomSheet
				animatedPosition={bottomSheetAnimatedPosition}
				coord1={leftTopCoordRef.current || seoul}
				coord2={rightBottomCoordRef.current || seoul}
				filterCategory={currentCategory}
				selectedEventId={selectedEventId}
			/>
		</View>
	)
}

const style = StyleSheet.create({
	naverMap: {
		flex: 1
	},
	contentContainer: {
		gap: 8,
		paddingRight: 28
	}
})
