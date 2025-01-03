# TIXX

> ⚠️ 이 리포지토리는 TIXX의 모바일 앱 부분을 포트폴리오 용도로 재구성한 것입니다.

**배포 링크**

- [Google Play Store](https://play.google.com/store/apps/details?id=com.tixx.mobile&pli=1)
- [App Store](https://apps.apple.com/kr/app/tixx/id6737306169)

## 서비스 소개

TIXX는 클럽 파티 게스트 초대의 불편함에서 시작된 프로젝트로 클럽, 페스티벌, 파티, 팝업 행사 등 다양한 이벤트를 위한 예약 및 입장 관리 기능을 제공하는 모바일 애플리케이션입니다. 사용자에게 QR 코드 기반의 디지털 티켓을 발급하여 빠르고 효율적인 입장 절차를 지원하며, 이벤트 관련 정보를 포함한 다양한 부가 기능을 제공합니다.

![screenshot](https://github.com/user-attachments/assets/9963a563-f5a7-493e-afe0-74baf89a8f32)

### 주요 기능

- **홈**

  - 사용 가능한 티켓을 날짜별로 그룹화된 카드 형태로 확인 가능
  - Pan 제스쳐로 티켓 넘기기 인터렉션
  - 나의 QR코드 생성

- **마이 페이지**

  - 내 티켓: 사용 가능, 사용 완료, 만료/취소 상태별로 티켓을 필터링
  - 보낸 티켓: 친구에게 전송된 티켓 목록 및 상태 확인
  - 받은 티켓: 친구에게 받은 티켓 목록 확인

- **이벤트**

  - 이벤트 세부 정보 확인 (날짜, 장소, 주최자 정보)
  - 네이버 지도를 사용하여 이벤트 위치를 정적 지도 및 동적 지도 형식으로 제공
  - 이벤트 평가하기

- **티켓**

  - 내 연락처 API를 활용하여 친구와 티켓을 공유
  - 티켓의 정보 확인

- **설정**

  - PUSH 알림 토글 및 시스템 알림 설정으로 이동
  - 내 정보 수정

- **알림**
  - 친구에게 티켓을 받으면 PUSH 알림 수신
  - 알림 스크린에서 알림 읽음 처리

## 사용 기술 스택

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-2366D1?style=for-the-badge&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?style=for-the-badge&logo=react-hook-form&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-1B1F24?style=for-the-badge&logoColor=white)

## 디렉토리 구조

```bash
src
 ┣ apis        # 기능별 API 요청 함수
 ┣ assets      # SVG, 폰트, 이미지 등 정적 에셋
 ┣ components
 ┃ ┣ features  # 특정 기능을 담당하는 UI 컴포넌트
 ┃ ┗ ui        # 공통적으로 사용되는 재사용 가능한 UI 컴포넌트
 ┣ constants   # 프로젝트 전역에서 사용되는 상수 값
 ┣ hooks
 ┃ ┣ queries   # TanStack Query 기반 쿼리 및 뮤테이션 커스텀 훅
 ┃ ┗ ...       # 기타 커스텀 훅
 ┣ navigation  # 네비게이션 구조와 관련된 로직과 컴포넌트
 ┣ screens     # 라우팅 구조 기반으로 화면을 구성하는 컴포넌트
 ┣ stores      # Zustand 전역 상태 관리 로직
 ┣ theme       # Tailwind CSS와 React Native Paper 등에서 사용되는 색상 및 폰트 테마 정의
 ┣ types       # 타입 정의
 ┣ utils       # 유틸리티 함수
 ┗ App.tsx     # 앱의 진입점
```

## 실행 방법

```bash
# 프로젝트 클론
git clone https://github.com/5unk3n/tixx-app.git

# 의존성 설치
cd app && yarn install

# ios 의존성 설치 (필요한 경우)
cd ios && pod install

# 앱 실행
yarn start
```
