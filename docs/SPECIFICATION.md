# 백일몽 주식회사 사내 인트라넷 시스템 명세서

## 📋 프로젝트 개요

**프로젝트명:** 백일몽 주식회사 사내 인트라넷  
**버전:** 1.1.0  
**기술 스택:** React, TypeScript, Vite, Tailwind CSS, Zustand, React Router  
**테마:** 공포 + 레트로 (Horror + Retro)  
**주요 폰트:** Pretendard (본문), 궁서체/Gungsuh (공포 요소), 굴림/Gulim (레트로 요소)

---

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary (Daydream Blue):** `210 100% 50%`
- **Background:** `220 25% 10%`
- **Horror Red:** `0 100% 40%`
- **Foreground:** `210 20% 98%`

### 특수 효과
- `animate-glitch`: 글리치 효과
- `animate-blink`: 깜빡임 효과
- `animate-flicker`: 포인트 깜빡임 효과

---

## 🗂️ 페이지 구조

### 1. 로그인 게이트웨이 (`/`)
**파일:** `src/pages/LoginGateway.tsx`

#### 기능
- 사원번호(이름) 입력 후 로그인
- 입력값 검증 및 에러 메시지 표시

#### 페르소나 시스템
| 사용자 | 팀 | 직급 | 포인트 |
|--------|-----|------|--------|
| 김솔음 | D조 | 주임 | 15,400 CP |
| 기타 사용자 | X/Y/Z조 (랜덤) | 사원 | 520 CP |

---

### 2. 메인 대시보드 (`/dashboard`)
**파일:** `src/pages/Dashboard.tsx`

#### 헤더
- 회사 로고 및 명칭: (주)백일몽
- 사용자 정보: 이름, 팀/직급, 보유 포인트 (간헐적 깜빡임 효과)
- 로그아웃 버튼

#### 담당 관리 구역 카드
| 사용자 | 표시 내용 |
|--------|-----------|
| 김솔음 | 양자택일 (Qterw-F-2073) / 별관 |
| 기타 | 웅얼거리는 맨홀 / 지하 2층 |

- 클릭 시 층별 배치도(`/floor-map`)로 이동

#### 일정 및 공지사항 카드
- 금주 근무 일정 표시
- 공지사항 3건 목록 (클릭 시 상세 페이지 이동)

#### 퀵 메뉴 & 쪽지함 카드

**퀵 메뉴 버튼:**
| 버튼 | 모든 사용자 | 김솔음 전용 |
|------|-------------|-------------|
| 복지몰 | ✅ | ✅ |
| 별관 방문 | ✅ | ✅ |
| 여우상담실 | ❌ | ✅ |
| 대여창고 신청 | ❌ | ✅ |

**쪽지함:**
- 일반 쪽지 및 스팸 쪽지 표시
- 스팸 쪽지는 이스터에그 발동 후 세션 내 삭제

---

### 3. 공지사항 목록 (`/notices`)
**파일:** `src/pages/NoticeList.tsx`

#### 공지사항 목록
1. **[경영] 사내 보안 시스템 점검 안내**
2. **[안내] 하반기 독감 예방접종 지원 안내**
3. **[필독] 3층 휴게실 분실물 습득 안내** ⚠️ (이스터에그 트리거)

---

### 4. 공지사항 상세 (`/notices/:id`)
**파일:** `src/pages/NoticeDetail.tsx`

#### 일반 공지 (ID: 1, 2)
- 제목, 작성자, 날짜, 본문 표시
- 뒤로가기 버튼

#### 🎃 이스터에그: 3번째 공지 (분실물)
**트리거:** 페이지 진입 후 5초 경과 (세션당 1회만 발동)

**점프스케어 시퀀스:**
1. **Phase 1 - "누구야?" 타이핑** (0~5초)
   - 검은 화면, 빨간 궁서체
   - "누구야? " 반복 타이핑, 속도 점점 가속
   - 화면 초과 시 자동 스크롤

2. **Phase 2 - "죽어" 타이핑** (5~10초)
   - "죽어" 반복 타이핑, 더 빠른 가속
   
3. **Phase 3 - 가짜 터미널 로그** (10~25초, 15초간)
   - **터미널 창 UI**: macOS 스타일 (빨강/노랑/초록 버튼)
   - **배경 투명**: 공지사항 내용이 터미널 창 뒤로 비쳐 보임
   - 정상 터미널 로그 먼저 표시 (녹색)
   - 비정상 로그 (빨간색):
     ```
     > SYSTEM ALERT: Unauthorized Access Detected.
     > User: Unknown
     > Location: Tracking....[Finish]
     > Camera: ON
     > Microphone: ON
     ```
   - 각 로그 라인에 타임스탬프 표시 (실시간 + 랜덤 과거 날짜 혼합)
   - REC ● 표시 (우상단, 깜빡임)
   - "Tracking...." 12초간 깜빡임 후 "[Finish]" 표시
   
4. **완료:** 공지사항 목록으로 리다이렉트

**세션 제한:** 한 번 경험 후 같은 로그인 세션에서는 재발동 안 됨

---

### 5. 쪽지함 목록 (`/messages`)
**파일:** `src/pages/MessageList.tsx`

#### 쪽지 목록
1. **[경영지원] 법인카드 사용 내역 확인 요청**
2. **[광고] ✨진.정.한 빛.을 찾으십.니까?✨** 🔴 (스팸 - 이스터에그)

---

### 6. 쪽지 상세 (`/messages/:id`)
**파일:** `src/pages/MessageDetail.tsx`

#### 일반 쪽지 (ID: 1)
- 법인카드 사용 내역 소명 요청
- 사용처: (주)편안한장례서비스
- 금액: 350,000원

#### 🎃 이스터에그: 2번째 쪽지 (스팸)
**콘텐츠:** "이름님" 종교적 세뇌 메시지

**트리거 조건:**
1. 스크롤하여 "감사합니다" 텍스트가 화면에 보임
2. 뒤로가기 버튼 클릭

**이스터에그 시퀀스:**
1. 뒤로가기 버튼 사라짐
2. **문자 대체 효과 시작:**
   - 원본 메시지가 첫 글자부터 한 글자씩 유니코드로 대체됨
   - 유니코드 이스케이프 텍스트:
     ```
     \uc6b0\ub9ac \ubaa8\ub450\ub294 \ud55c\ub0b1 \uc774\uc57c\uae30\uc5d0 \ubd88\uacfc\ud558\ub2e4 \uc704\ub300\ud558\uc2e0 \uc774\ub984\ub2d8
     ```
   - 타이핑 속도: 0.75ms (초고속)
   - 폰트 크기: 일반 텍스트의 절반
3. 자동 스크롤
4. **10초 후 종료 트랜지션:**
   - (1) 화면이 갑자기 검은색으로 전환 (블랙아웃)
   - (2) 2초간 완전한 정적
   - (3) 대시보드가 부드럽게 페이드인
5. **사용자 이름이 "■■■"로 변경됨**
5. **사용자 이름이 "■■■"로 변경됨**
6. 해당 세션 내 스팸 쪽지 삭제

*업데이트 (v1.1.0):*
- **Trap Mode 강화:** 이스터에그 발동 중(또는 Message 2 열람 중) 좌측 **쪽지 목록 패널이 비활성화(Lock-down)** 되어 다른 쪽지로 이동 불가. 오직 '뒤로가기'만 가능.

---

### 7. 복지몰 (`/welfare-mall`)
**파일:** `src/pages/WelfareMall.tsx`

#### 접근 제어
- 별도 로그인 필요 (모달)
- 로그인 없이 모달 닫기 시 대시보드로 리다이렉트
- **Standalone Layout**: 좌측 사이드바가 숨겨짐. '뒤로가기' 버튼을 통해서만 이탈 가능.

#### 상품 목록 (6개)
| 상품명 | 이미지 |
|--------|--------|
| 소원권 | wish-ticket.png |
| 사막방울뱀 독 | snake-venom.png |
| 재생 물약 | regen-potion.png |
| 미공개 시약 | secret-reagent.png |
| 대형 가전 랜덤박스 | mystery-box.png |
| 기적의 발모제 | hair-tonic.png |

#### 🎃 이스터에그: 우주 쇼핑몰
**트리거:** 
- 복지몰 로그인 ID: `yongj1111`
- 로그인 후 뒤로가기 버튼 5회 클릭

**SpaceShoppingMall 특징:**
- 레트로 우주 테마
- UFO, 외계인, 빨간 행성
- 스크롤 마키 제목
- 별 배경
- CTA 버튼 클릭 시 에러 메시지 후 로그인으로 리다이렉트

---

### 8. 층별 배치도 (`/floor-map`)
**파일:** `src/pages/FloorMap.tsx`

#### 건물 구조
**본관:**
- 10층: A조, B조 사무실
- 11층: C조 사무실 + 회의실
- 12층: 공용 공간 + 회의실
- 13~15층: D~Z조 사무실

**별관:**
- 1층: 안내 데스크 + 격리실
- 2~5층: 격리실
- B1층: 안내 데스크 + 보안팀 사무실

#### 마커 시스템 (6개)
#### 마커 시스템 (6개)
| # | 위치 | 담당자 | 대상 | 상태 |
|---|------|--------|------|------|
| 1 | 본관 13F D조 (Y=25%) | 박민성 주임 | 안녕 교통정보 (Qterw-E-63) | 주의 |
| 2 | 별관 3F 302호 (김솔음 전용) | 김솔음 주임 | 양자택일 (Qterw-F-2073) | 안정 |
| 3 | 별관 3F 격리실 | [현재 사용자] | 양자택일/속삭이는 벽 | 안정 |
| 4 | 본관 11F C-1 사무실 | 강■■ 팀장 | Qterw-S-01 [데이터 말소] | 접근 금지 |
| 5 | B1F 창고 | 한■■ 대리 | 식별 불가 (The Thing) | 동면 중 |
| 6 | 본관 13F H조 사무실 | 조■■ 주임 | Qterw-?-??? | 동면 중 |

*업데이트 (v1.1.0):*
- **스마트 툴팁 시스템:** 마커 위치(Y좌표)에 따라 툴팁 표시 방향 자동 전환 (상단 40% 영역은 아래로, 나머지는 위로 표시)하여 잘림 현상 방지.
- **중복 방지:** 맵 컨테이너 레벨에서 단일 툴팁 오버레이 렌더링.

---

### 9. 일정 캘린더 (`/calendar`)
**파일:** `src/pages/CalendarPage.tsx`

- 월간 캘린더 뷰
- 근무 일정 표시
- 실시간 날짜 기반

---

## 🔧 모달 컴포넌트

### 별관 방문 신청 모달
**파일:** `src/components/modals/AnnexVisitModal.tsx`
- 방문 날짜/시간 선택
- 방문 사유 입력

### 여우상담실 예약 모달 (김솔음 전용)
**파일:** `src/components/modals/FoxCounselingModal.tsx`
- 주간 캘린더 뷰
- 3시간 단위 슬롯
- 일부 슬롯 선점 표시

### 대여창고 신청 모달 (김솔음 전용)
**파일:** `src/components/modals/StorageRentalModal.tsx`
- 창고 번호 선택
- 점유 창고 선택 불가
- 대여 물품 및 사유 입력

---

## 💾 상태 관리 (Zustand)

**파일:** `src/store/userStore.ts`

### State
```typescript
interface UserState {
  userName: string;          // 사용자 이름
  team: string;              // 소속 팀
  rank: string;              // 직급
  points: number;            // 보유 포인트
  isLoggedIn: boolean;       // 로그인 상태
  hasWelfareMallAccess: boolean;  // 복지몰 접근 권한
  welfareMallLoginId: string;     // 복지몰 로그인 ID
  backButtonCount: number;   // 뒤로가기 횟수 (우주몰 이스터에그용)
  spamMessageDeleted: boolean;    // 스팸 쪽지 삭제 여부
  jumpscareViewed: boolean;       // 점프스케어 경험 여부 (세션당 1회)
}
```

### Actions
- `login(id)`: 로그인 처리 + 페르소나 할당
- `logout()`: 로그아웃 (모든 상태 초기화)
- `loginToWelfareMall(id, password)`: 복지몰 로그인
- `incrementBackButton()`: 뒤로가기 카운트 증가
- `resetBackButton()`: 뒤로가기 카운트 초기화
- `deleteSpamMessage()`: 스팸 쪽지 삭제 플래그
- `corruptUserName()`: 이름을 "■■■"로 변경
- `setJumpscareViewed()`: 점프스케어 경험 플래그 설정

### 세션 지속성
- `persist` 미들웨어 사용
- 스토리지 키: `daydream-user-storage`
- 로그아웃 시 모든 이스터에그 플래그 초기화 (재로그인 시 이스터에그 재경험 가능)

---

## 🎃 이스터에그 요약

| # | 트리거 | 효과 | 결과 | 세션 제한 |
|---|--------|------|------|-----------|
| 1 | 3번째 공지 5초 후 | 점프스케어 (타이핑 + 투명 터미널) | 공지목록으로 이동 | ✅ 1회 |
| 2 | 스팸 쪽지 스크롤 후 뒤로가기 | 문자 대체 + 블랙아웃 트랜지션 | 이름 손상 + 쪽지 삭제 | ✅ 1회 |
| 3 | 복지몰 yongj1111 + 뒤로가기 5회 | 우주 쇼핑몰 | 레트로 우주 테마 페이지 | ❌ |

---

## 📁 파일 구조

```
src/
├── assets/
│   └── products/           # 복지몰 상품 이미지
├── components/
│   ├── modals/             # 모달 컴포넌트
│   │   ├── AnnexVisitModal.tsx
│   │   ├── FoxCounselingModal.tsx
│   │   └── StorageRentalModal.tsx
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── JumpscareOverlay.tsx
│   ├── NavLink.tsx
│   └── SpaceShoppingMall.tsx
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── pages/
│   ├── CalendarPage.tsx
│   ├── Dashboard.tsx
│   ├── FloorMap.tsx
│   ├── Index.tsx
│   ├── LoginGateway.tsx
│   ├── MessageDetail.tsx
│   ├── MessageList.tsx
│   ├── NotFound.tsx
│   ├── NoticeDetail.tsx
│   ├── NoticeList.tsx
│   └── WelfareMall.tsx
├── store/
│   └── userStore.ts
├── utils/
│   └── dateUtils.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

---

## 🔄 라우팅

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | LoginGateway | 로그인 페이지 |
| `/dashboard` | Dashboard | 메인 대시보드 |
| `/notices` | NoticeList | 공지사항 목록 |
| `/notices/:id` | NoticeDetail | 공지사항 상세 |
| `/messages` | MessageList | 쪽지함 목록 |
| `/messages/:id` | MessageDetail | 쪽지 상세 |
| `/welfare-mall` | WelfareMall | 직원 복지몰 |
| `/floor-map` | FloorMap | 층별 배치도 |
| `/calendar` | CalendarPage | 일정 캘린더 |
| `*` | NotFound | 404 페이지 |

---

## 📝 유틸리티

### dateUtils.ts
- `formatDate(date, format?)`: 날짜 포맷팅
- `getRelativeDate(days)`: 상대 날짜 계산 (오늘 기준)

---

*마지막 업데이트: 2025-12-17*
