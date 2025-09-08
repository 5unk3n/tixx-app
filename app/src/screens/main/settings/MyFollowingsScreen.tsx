import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Image, StyleSheet, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'

import { CustomText } from '@/components/ui/display/CustomText'
import { useFollowingHosts } from '@/hooks/queries/hosts/useFollowingHosts'
import { MainStackParamList } from '@/types/navigation'

type Props = NativeStackScreenProps<MainStackParamList, 'MyFollowings'>

export default function MyFollowingsScreen({ navigation }: Props) {
	const { t } = useTranslation()
	const {
		data: followingHosts,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useFollowingHosts(1, 10)

	const handleEndReached = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}

	const flatListData = followingHosts?.pages.flatMap((page) => page.items)

	return (
		<View>
			<View className="pt-9 px-4">
				<CustomText variant="headline2Medium">
					{t('common.following')}
				</CustomText>
				<FlatList
					data={flatListData}
					renderItem={({ item }) => (
						<TouchableRipple
							onPress={() =>
								navigation.navigate('HostDetail', {
									hostId: item.id!
								})
							}
						>
							<View>
								<View className="w-[76] h-[76] rounded-full border border-grayscale-800 justify-center items-center">
									<Image
										source={{
											uri: item.imageUrl
										}}
										className="w-[70] h-[70] rounded-full"
									/>
								</View>
								<CustomText variant="body3Regular" className="mt-2 text-center">
									{item.name}
								</CustomText>
							</View>
						</TouchableRipple>
					)}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.container}
					onEndReached={handleEndReached}
					onEndReachedThreshold={0.5}
					className="mt-4"
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: 8
	}
})
