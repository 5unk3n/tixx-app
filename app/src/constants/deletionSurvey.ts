export enum DeletionSurveyKeys {
	TOO_OFTEN = 'TOO_OFTEN',
	NOT_ENOUGH = 'NOT_ENOUGH',
	PRIVACY = 'PRIVACY',
	TOO_MANY_NOTIFICATIONS = 'TOO_MANY_NOTIFICATIONS',
	SUPPORT = 'SUPPORT',
	PRICE = 'PRICE',
	OTHER = 'OTHER'
}

export const DELETION_SURVEY_DATA = [
	{
		key: DeletionSurveyKeys.TOO_OFTEN,
		label: '서비스 이용 빈도가 낮아요'
	},
	{
		key: DeletionSurveyKeys.NOT_ENOUGH,
		label: '원하는 기능이나 서비스가 부족해요'
	},
	{
		key: DeletionSurveyKeys.PRIVACY,
		label: '개인 정보 보호가 걱정돼요'
	},
	{
		key: DeletionSurveyKeys.TOO_MANY_NOTIFICATIONS,
		label: '알림이나 푸시 메세지가 너무 많아요'
	},
	{
		key: DeletionSurveyKeys.SUPPORT,
		label: '고객 지원 서비스가 부족해요'
	},
	{
		key: DeletionSurveyKeys.PRICE,
		label: '가격이나 결제에 문제가 있어요'
	},
	{
		key: DeletionSurveyKeys.OTHER,
		label: '기타 (직접 입력)'
	}
] as const
