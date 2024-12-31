export const ERRORS = {
	VALIDATION: {
		REQUIRED_FIELD: '이 필드는 필수입니다.',
		INVALID_TYPE: '올바른 형식이 아닙니다.',
		INVALID_EMAIL: '유효한 이메일 주소를 입력해주세요.',
		INVALID_NICKNAME_LENGTH: '10글자 이내로 설정해주세요'
	},
	TOKEN_STORAGE: {
		SAVE_FAILED: '토큰 저장에 실패했습니다.',
		RETRIEVE_FAILED: '토큰을 가져오는 데 실패했습니다.',
		DELETE_FAILED: '토큰 삭제에 실패했습니다.'
	},
	AUTH: {
		OTHER_SERVICE_USER: '다른 서비스로 가입된 사용자입니다.'
	}
} as const
