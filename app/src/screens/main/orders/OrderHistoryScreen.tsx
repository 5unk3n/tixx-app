import React from 'react'
import { FlatList, View } from 'react-native'
import { ActivityIndicator, Divider } from 'react-native-paper'

import OrderItem from '@/components/orders/OrderItem'
import { useOrders } from '@/hooks/queries/orders/useOrders'

export default function OrderHistoryScreen() {
	const { data: orders, isPending } = useOrders()
	orders?.sort((a, b) => {
		const dateA = new Date(a.createdAt)
		const dateB = new Date(b.createdAt)
		return dateB.getTime() - dateA.getTime()
	})

	if (isPending) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator />
			</View>
		)
	}

	return (
		<View className="flex-1 px-4">
			{/* TODO: 이벤트 이름으로 필터링 기능 추가 */}
			{/* <CustomTextInput
				placeholder="검색어를 입력해주세요"
				right={<CustomIcon name="search" size={22} className="mr-2" />}
				containerStyle={[
					styles.container,
					{
						backgroundColor: colors.grayscale[900],
						borderColor: colors.grayscale[400]
					}
				]}
				value={search}
				onChangeText={setSearch}
			/> */}
			<FlatList
				data={orders}
				renderItem={({ item }) => <OrderItem key={item.id} order={item} />}
				ItemSeparatorComponent={ItemSeparator}
				className="mt-6"
			/>
		</View>
	)
}

function ItemSeparator() {
	return <Divider className="my-6" />
}

// const styles = StyleSheet.create({
// 	container: {
// 		height: 36,
// 		borderWidth: 0.5,
// 		borderRadius: 25
// 	}
// })
