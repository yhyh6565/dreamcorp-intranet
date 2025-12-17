# 백일몽 주식회사 인트라넷 (Daydream Corp. Intranet)

> **⚠ 저작권 및 2차 창작 안내 (Disclaimer)**
>
> 이 프로젝트는 **백덕수 작가님의 웹소설 '괴담에 떨어져도 출근을 해야 하는구나'**를 기반으로 제작된 팬 메이드(Fan-made) 작품입니다.
>
> 본 프로젝트는 **비영리적 목적**으로 제작되었으며, 원작의 저작권을 침해할 의도가 전혀 없음을 밝힙니다. 모든 세계관과 설정의 저작권은 원작자에게 있습니다.

📚 **원작 보러가기 (KakaoPage):** [괴담에 떨어져도 출근을 해야 하는구나](https://page.kakao.com/content/65171279)

---

## 📖 프로젝트 소개 (Overview)

백일몽 주식회사(Daydream Corp.)의 임직원들이 사용하는 사내 인트라넷 시스템을 웹 환경으로 구현한 프로젝트입니다.

일반적인 기업용 그룹웨어(ERP)의 건조하고 보수적인 UI/UX를 모방하여, 사용자가 실제 회사 시스템에 접속한 듯한 몰입감을 주도록 설계되었습니다.

## 🛠 기술 스택 (Tech Stack)

이 프로젝트는 최신 웹 기술을 기반으로 빠르고 안정적인 SPA(Single Page Application)로 구축되었습니다.

* **Core:** [React](https://react.dev/) (v18), [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Package Manager:** Bun (or npm)

## 📂 프로젝트 구조 (Project Structure)

주요 디렉토리 및 파일 구성은 다음과 같습니다.

```text
src/
├── assets/             # 이미지 및 정적 리소스 (상품 이미지 등)
├── components/         # 재사용 가능한 UI 컴포넌트
│   ├── modals/         # 기능별 모달 (별관 방문, 상담 신청 등)
│   └── ui/             # 버튼, 카드, 입력창 등 기본 디자인 시스템 컴포넌트
├── pages/              # 주요 페이지 라우트
│   ├── LoginGateway.tsx  # 진입(로그인) 페이지
│   ├── Dashboard.tsx     # 메인 대시보드
│   ├── MessageList.tsx   # 사내 메신저함
│   ├── NoticeList.tsx    # 공지사항 게시판
│   ├── WelfareMall.tsx   # 임직원 복지몰
│   ├── CalendarPage.tsx  # 일정 캘린더
│   └── FloorMap.tsx      # 사내 배치도
├── store/              # 전역 상태 관리 (유저 세션 등)
└── utils/              # 날짜 포맷팅 등 유틸리티 함수
