# TIXX Mobile App - React Native

> React Native로 구현한 크로스 플랫폼 이벤트 티켓 관리 앱

## 프로젝트 개요

TIXX 모바일 앱은 React Native를 활용하여 iOS와 Android에서 동일한 사용자 경험을 제공하는 이벤트 티켓 관리 애플리케이션입니다. QR 코드 기반의 디지털 티켓 시스템을 통해 빠르고 효율적인 입장 절차를 지원합니다.

배포 링크: [Google Play](https://play.google.com/store/apps/details?id=com.tixx.mobile&pli=1) / [App Store](https://apps.apple.com/kr/app/tixx/id6737306169)


## 주요 기능

- 홈: 이벤트 및 베뉴 탐색, 검색
- 티켓: QR 코드 생성/검증, 연락처 연동을 통한 티켓 공유/회수
- 이벤트: 상세 정보, 일정/장소
- 알림: 티켓 수신/상태 변경 PUSH 알림, 읽음 처리
- 지도: 네이버 지도 연동(정적/동적), 근처 이벤트, 위치 권한 처리
- 설정/계정: 프로필 수정, 로그인/로그아웃, 알림 설정
- 딥링크: AppsFlyer OneLink로 이벤트/호스트 상세 진입

## 기술 스택

### 프레임워크 & 언어
- **React Native** 0.74.5 - 크로스 플랫폼 모바일 개발
- **TypeScript** 5.0.4 - 타입 안전성 보장

### 상태 관리
- **Zustand** 4.5.5 - 전역 상태 관리
- **TanStack Query** 5.51.23 - 서버 상태 관리 및 캐싱
- **React Hook Form** 7.52.2 - 폼 상태 관리

### UI/UX
- **NativeWind + Tailwind CSS** - 유틸리티 우선 스타일링
- **React Native Paper** 5.12.5 - Material Design 컴포넌트
- **React Native Reanimated** 3.15.1 - 고성능 애니메이션
- **React Native Gesture Handler** 2.19.0 - 제스처 처리

## 아키텍처 설계

### 폴더 구조
```
src
 ┣ apis           # 기능별 API 요청 함수
 ┣ assets         # SVG, 폰트, 이미지 등 정적 에셋
 ┣ components  
 ┃ ┣ [features]   # 특정 기능을 담당하는 UI 컴포넌트
 ┃ ┗ ui           # 공통적으로 사용되는 재사용 가능한 UI 컴포넌트
 ┣ constants      # 프로젝트 전역에서 사용되는 상수 값
 ┣ hooks 
 ┃ ┣ queries      # TanStack Query 기반 쿼리 및 뮤테이션 커스텀 훅
 ┃ ┗ ...          # 기타 커스텀 훅
 ┣ locales        # 언어별 번역 파일
 ┣ navigation     # 내비게이션 구조와 관련된 로직과 컴포넌트
 ┣ screens        # 라우팅 구조 기반으로 화면을 구성하는 컴포넌트
 ┣ stores         # Zustand 전역 상태 관리 로직
 ┣ theme          # Tailwind CSS와 React Native Paper 등에서 사용되는 색상 및 폰트 테마 정의
 ┣ types          # 타입 정의
 ┣ utils          
 ┃ ┣ schemas      # zod 스키마
 ┃ ┗ ...          # 유틸리티 함수
 ┗ App.tsx        # 앱의 진입점
```

### 내비게이션 구조
```
Root(Stack)
 ├─ Auth(Stack)
 └─ Main(Stack)
     ├─ MainTab(BottomTabs)
     │   ├─ Home
     │   ├─ Tickets
     │   ├─ QRCode
     │   ├─ Search
     │   └─ MyPage
     └─ Detail/Utility Screens
         (EventDetail, HostDetail, MyTickets, Notification,
          Settings, Profile, BuyTicket, Payment, ...)
```

### 국제화(i18n)
- i18next 기반 다국어(ko/en) 지원
- 번역 리소스: `src/locales/*`

### 권한(모바일)
- 알림(Push), 위치(지도/근처 이벤트), 연락처(티켓 공유)
- 플랫폼 권한 요청/안내는 `react-native-permissions`로 처리

### 알림/딥링크
- FCM(Notifee)로 Foreground, Background, Quit 상태 알림 처리
- 알림 클릭 → 해당 화면으로 라우팅 + 관련 쿼리 무효화
- AppsFlyer 딥링크 이벤트에 따라 초기 라우팅 분기

### 에러/로깅
- `ErrorBoundary` + `Toast` 패턴
- `@sentry/react-native`로 오류/세션 수집

### OTA 업데이트
- `react-native-stallion`을 통한 OTA 번들 업데이트
- 필수 업데이트 시 앱 재시작 처리
