import { useState } from 'react'
import { Share } from 'react-native'
import appsFlyer, { GenerateInviteLinkParams } from 'react-native-appsflyer'
import Toast from 'react-native-toast-message'

interface ShareableContent {
	id: string | number
	type: 'event' | 'host'
	title?: string
	description?: string
	imageUrl?: string
}

export const useShareLink = () => {
	const [isLoading, setIsLoading] = useState(false)

	const shareLink = async (content: ShareableContent) => {
		const { id, type, title, description, imageUrl } = content
		if (isLoading) {
			return
		}

		setIsLoading(true)

		const getShareMessagePrefix = () => {
			switch (type) {
				case 'event':
					return ``
				case 'host':
					return ``
				default:
					return ''
			}
		}

		try {
			const linkParams: GenerateInviteLinkParams = {
				channel: 'share',
				userParams: {
					deep_link_value: type,
					deep_link_sub1: id,
					af_dp: `tixx://${type}/${id}`,
					af_og_title: title,
					af_og_description: description,
					af_og_image: imageUrl
				}
			}

			const link = await new Promise<string>((resolve, reject) => {
				appsFlyer.generateInviteLink(
					linkParams,
					(result) => resolve(result as string),
					reject
				)
			})

			const message = getShareMessagePrefix() + link

			await Share.share({
				message
			})
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: '링크를 생성하는데 실패했습니다.'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return { shareLink, isLoading }
}
