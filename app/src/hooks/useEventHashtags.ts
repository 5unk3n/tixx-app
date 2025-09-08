import { useTranslation } from 'react-i18next'

import { EventHashtag } from '@/types'

/**
 * 이벤트 해시태그를 사용자 친화적으로 변환하는 훅
 *
 * @param eventHashtags - 이벤트 해시태그 배열
 * @returns 사용자에게 보여줄 해시태그 문자열 배열과 관련 유틸 함수들
 */
export const useEventHashtags = (eventHashtags: EventHashtag[]) => {
	const { i18n } = useTranslation()
	const currentLanguage = i18n.language

	if (!eventHashtags) {
		return {
			hashtags: [],
			hashtagCount: 0,
			hasHashtags: false,
			firstHashtag: null
		}
	}

	/**
	 * 해시태그 배열을 사용자 친화적인 문자열 배열로 변환합니다.
	 * 한국어인 경우 korName을, 다른 언어인 경우 key를 사용합니다.
	 * hashtag가 없는 경우 tag를 사용합니다.
	 */
	const formatEventHashtags = (
		hashtags: EventHashtag[],
		language: string
	): string[] => {
		return hashtags.map((eventHashtag) => {
			// hashtag가 없는 경우 tag 사용
			if (!eventHashtag.hashtag) {
				return eventHashtag.tag
			}

			// 한국어인 경우 korName 사용, 없으면 key 사용
			if (language === 'ko') {
				return eventHashtag.hashtag.korName || eventHashtag.hashtag.key
			}

			// 다른 언어인 경우 key 사용
			return eventHashtag.hashtag.key
		})
	}

	const hashtags = formatEventHashtags(eventHashtags, currentLanguage)
	const hashtagCount = hashtags.length
	const hasHashtags = hashtagCount > 0
	const firstHashtag = hashtags[0] || null

	return {
		hashtags,
		hashtagCount,
		hasHashtags,
		firstHashtag
	}
}
