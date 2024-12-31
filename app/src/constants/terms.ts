export enum TermsKey {
	AGE_VERIFICATION = 'AGE_VERIFICATION',
	SERVICE_AGREEMENT = 'SERVICE_AGREEMENT',
	PRIVACY_POLICY = 'PRIVACY_POLICY',
	MARKETING_AGREEMENT = 'MARKETING_AGREEMENT'
}

export const TERMS_DATA = [
	{
		key: TermsKey.AGE_VERIFICATION,
		label: '만 14세 이상 입니다. (필수)',
		required: true
	},
	{
		key: TermsKey.SERVICE_AGREEMENT,
		label: '서비스 이용약관 동의 (필수)',
		required: true
	},
	{
		key: TermsKey.PRIVACY_POLICY,
		label: '개인 정보 수집 / 이용 동의 (필수)',
		required: true
	},
	{
		key: TermsKey.MARKETING_AGREEMENT,
		label: '이벤트 혜택 및 광고성 정보 수신 동의 (선택)',
		required: false
	}
] as const
