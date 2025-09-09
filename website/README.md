# TIXX Client Website - React

> React + TypeScript로 구현한 이벤트/티켓/참가자 운영 대시보드

## 프로젝트 개요

TIXX 웹사이트는 이벤트 주최자를 위한 대시보드입니다. 이벤트 생성·편집부터 티켓 발행/관리, 참가자/입장 현황, 채널(호스트) 설정, QR 스캔까지 운영 흐름 전반을 웹에서 효율적으로 처리합니다.

## 주요 기능

- 대시보드: 진행 상태별 이벤트 현황, 검색/필터
- 이벤트: 생성/수정, 일정·장소·이미지 관리
- 티켓: 생성/가격/재고, 상태별 관리, 엑셀 템플릿으로 초대
- 참가자: 목록/상태(입장/미입장), 검색/정렬/필터
- 채널(호스트): 프로필/설정, 인사이트
- 정산: 이벤트별 정산 현황 확인, 데이터 내보내기
- QR 스캔: 브라우저 카메라 기반 입장 처리

## 기술 스택

### 프레임워크 & 언어
- **React** 18.3.1
- **TypeScript** 5.6.2

### 상태 관리
- **TanStack Query** 5.66.5
- **Zustand** 5.0.3
- **React Hook Form** 7.54.2

### UI/UX
- **Radix UI** (Shadcn) 
- **Tailwind CSS** 3.4.15


## 아키텍처 설계

### 폴더 구조
```
src
 ┣ apis           # 기능별 API 요청 함수
 ┣ assets         # 아이콘/이미지/폰트 등 정적 자원
 ┣ components     
 ┃ ┣ [features]   # 특정 기능을 담당하는 UI 컴포넌트
 ┃ ┗ ui           # 공통적으로 사용되는 재사용 가능한 UI 컴포넌트
 ┣ constants      # 프로젝트 전역에서 사용되는 상수 값
 ┣ lib            # Axios 인스턴스/QueryClient, Zod 스키마, 공통 유틸리티
 ┣ locales        # 언어별 번역 파일
 ┣ hooks          
 ┃ ┣ queries      # TanStack Query 기반 쿼리 및 뮤테이션 커스텀 훅
 ┃ ┗ ...          # 기타 커스텀 훅
 ┣ pages          # 라우트 단위 페이지
 ┣ routes         # 라우팅 구성
 ┣ stores         # Zustand 전역 상태 관리
 ┣ types          # 전역 타입 정의
 ┗ utils          # 헬퍼/공통 로직
```

### 내비게이션 구조
```
Root(Stack)
 ├─ Public
 │   ├─ Login
 │   ├─ Signup
 │   └─ FindPassword
 └─ Private(MainLayout)
     ├─ Main (이벤트 목록/검색)
     ├─ Channel (overview / settings / settlement / insight)
     ├─ Events (create / edit / ticket / invite)
     └─ QR (scan / result)
```

### 국제화(i18n)
- i18next 기반 다국어(ko/en) 지원
- 브라우저 언어 감지로 초기 언어 자동 설정
- 번역 리소스: `src/locales/*`

### 권한(모바일)
- 웹 브라우저 카메라 권한(HTTPS) 요청 및 안내 처리(QR 스캔)

### 알림/딥링크
- 웹 푸시는 현재 미사용
- 라우팅 기반 내부 링크 공유 및 진입 분기

### 에러/로깅
- 전역 오류 처리 + 토스트 피드백(Sonner)
- 네트워크 오류 메시지 일관화, 재시도/무효화 정책(TanStack Query)

### OTA 업데이트
- 웹 배포는 CI/CD와 캐시 무효화 전략으로 최신화(OTA 불필요)