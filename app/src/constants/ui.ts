export const UI = {
	COMMON: {
		NEXT: '다음',
		CONFIRM: '확인',
		SEND: '전송',
		RESEND: '재전송',
		CLOSE: '닫기',
		ACCEPT: '수락',
		REJECT: '거절',
		CANCEL: '취소',
		WAITING: '대기중',
		ACCEPTED: '수락완료',
		SECONDS: '초',
		SETTINGS: '환경설정',
		APP_VERSION: '앱 버전',
		CURRENT_VERSION: '현재 버전',
		LATEST_VERSION: '최신 버전',
		TERMS_AND_POLICIES: '약관 및 정책',
		CUSTOMER_SUPPORT: '고객센터',
		FEEDBACK: '피드백',
		NOTICE: '공지사항',
		BUSINESS_INFO: '사업자 정보',
		NOTIFICATION: '알림',
		SETTING_NOTIFICATION: '알림 설정',
		NOTIFICATION_DESCRIPTION:
			'티켓 초대 , 티켓 일정 알림을 실시간으로 안내해드립니다.',
		SETTING_MARKETING_NOTIFICATION: '마케팅 알림 수신 동의',
		MY_PROFILE: '마이',

		START_ACTION: '시작하기',
		CANCEL_ACTION: '취소하기',
		SHARE_ACTION: '공유하기',

		ACCEPT_CONFIRM: '수락 하시겠습니까?',
		REJECT_CONFIRM: '거절 하시겠습니까?',

		ACCOUNT_DELETION_PLACEHOLDER: '탈퇴 사유를 입력해주세요',

		CONTACT_PERMISSION_REQUIRED: '연락처 접근 권한이 없습니다.'
	},
	AUTH: {
		AGREE_TO_TERMS: '서비스 이용을 위해\n약관에 동의해주세요.',
		CHECK_PROFILE_TITLE: '정보확인',
		RECENT_LOGIN: '가장 최근 로그인',
		SELECT_CARRIER: '통신사 선택',
		LOGOUT_CONFIRM: '로그아웃 하시겠습니까?',

		NAVER_LOGIN: '네이버로 시작하기',
		KAKAO_LOGIN: '카카오로 시작하기',
		APPLE_LOGIN: 'apple로 시작하기',

		CODE_PLACEHOLDER: '인증번호 6자리를 입력해주세요',
		AUTHENTICATED: '인증완료'
	},
	EVENTS: {
		REACTION_TITLE: '반응하기',
		REACTION_DESCRIPTION: '행사에 참여한 사람들의 반응입니다',
		LIKE: '좋아요',
		DISLIKE: '별로예요'
	},
	TICKETS: {
		VIEW_DETAIL: '상세보기 >',
		NOT_EXIST: '티켓이 없습니다.',
		MY_TICKETS: '내 티켓 관리',
		SENT_TICKETS: '보낸 티켓',
		RECEIVED_TICKETS: '받은 티켓',
		SHARABLE_TICKETS: '공유 가능한 티켓',
		SHARE_MESSAGE:
			'React Native | A framework for building native apps using React',

		ACCEPTED_TITLE: '초대에 수락하셨습니다.',
		SENT_ACCEPTED_TITLE: '초대장 전달이 완료되었습니다.',
		SENT_REJECTED_TITLE: '초대장 전달이 거절되었습니다.',
		SENT_CANCELED_TITLE: '초대장 전달이 취소되었습니다.',
		CANCEL_DIALOG_TITLE: '초대장 전달을 취소하시겠습니까?',
		SHARE_COMPLETE_TITLE: '초대장 발송이 완료되었습니다.',

		USED_STATUS: '입장완료',
		EXPIRED_STATUS: '입장 만료',
		CANCELED_STATUS: '입장 취소',

		CANCEL: '방문 취소',
		CANCEL_TRANSFER: '초대장 전달 취소',
		CANCEL_TRANSFER_ACTION: '전달 취소',

		CANCEL_NOTICE_TITLE: '취소 전 꼭 확인해주세요!',
		ACCOUNT_DELETION_DESTRUCTION_NOTICE:
			'탈퇴 완료 시 사용자가 있는 모든 티켓은 소멸됩니다.',
		CANCEL_DESTRUCTION_NOTICE: '취소 완료 시 해당 티켓은 소멸됩니다.',
		RECOVERY_NOTICE:
			'소멸된 티켓은 복구가 어려우니 신중하게 결정하고 취소해주세요.',
		SHARE_NOTICE:
			'틱스(TIXX) 어플이 설치되지 않은 분께는 초대장을 발송할 수 없습니다. 아래의 공유 버튼을 눌러 문자로 링크를 공유해 주세요.',

		AVAILABLE_TAB: '이용가능',
		USED_TAB: '사용 완료',
		EXPIRED_OR_CANCELED_TAB: '만료/취소',

		SEARCH_CONTACT_PLACEHOLDER: '이름을 찾아보세요!',
		NO_SEARCH_RESULT: '검색 결과가 없습니다.'
	},
	USERS: {
		NAME: '이름',
		NICKNAME: '닉네임',
		EMAIL: '이메일',
		PHONE: '전화번호',
		BIRTH: '생년월일',
		CONNECT_SNS: 'SNS 연결',
		EDIT_MY_PROFILE: '프로필 수정',

		NICKNAME_PLACEHOLDER: '닉네임을 입력해주세요',

		QR_MODAL_TITLE: '님의 QR코드',
		QR_MODAL_DESCRIPTION: '이용하려는 시설에\nQR코드로 체크인해주세요.',

		PROFILE_EDIT_TITLE: '프로필 수정',
		PROFILE_EDIT_SUBTITLE: '프로필을 수정해주세요.',
		PROFILE_EDIT_NOTICE:
			'프로필 수정 시에는 최대한 신중하게 작성해주시기 바랍니다.',
		PROFILE_EDIT_COMPLETE: '프로필 수정이 완료되었습니다.',
		PROFILE_EDIT_CONFIRM: '프로필 수정을 완료하시겠습니까?',
		PROFILE_EDIT_CANCEL: '프로필 수정을 취소하시겠습니까?'
	}
} as const
