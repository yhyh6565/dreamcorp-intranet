export type DarknessGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type DarknessStatus = 'Active' | 'Isolated' | 'Disposed';

export interface DarknessManualItem {
  id: string;           // 식별 코드 (Qterw-...)
  title: string;        // 어둠 명칭
  grade: DarknessGrade; // 등급
  status: DarknessStatus; // 관리 상태
  department: string;   // 담당 부서

  // 상세 내용
  overview: string;           // 개요
  entryMethod: string;        // 진입 방법
  explorationGuide: {         // 탐사 가이드
    survivalRules: string[];  // 생존 수칙 리스트
    clearCondition: string;   // 클리어/탈출 조건
  };
  specialNotes?: string;      // 특이사항 (Optional)

  isRestricted: boolean;      // S, A등급 여부 (true면 모달 띄움)
}

export const manualData: DarknessManualItem[] = [
  {
    id: 'Qterw-A-104',
    title: '산제물의 합창가',
    grade: 'S',
    status: 'Isolated',
    department: 'A조',
    overview: '폐교에서 발생하는 집단 무아지경 현상. 특정 음계의 노래가 들리기 시작하면 진입이 시작된다. 1987년 ■■초등학교에서 최초 보고되었으며, 현재까지 12건의 추가 발현이 확인되었다.',
    entryMethod: '밤 11시 이후, 폐교 음악실에서 "고요한 밤 거룩한 밤"의 첫 소절이 들릴 때 눈을 감고 따라 부르면 진입된다. 단, 반드시 혼자여야 하며 녹음 장비는 작동하지 않는다.',
    explorationGuide: {
      survivalRules: [
        '절대로 노래를 멈추지 말 것',
        '다른 목소리가 들려도 뒤돌아보지 말 것',
        '음악실 창문 너머의 무언가와 눈을 마주치지 말 것',
        '지휘자의 박자에 맞춰야 함'
      ],
      clearCondition: '마지막 소절까지 완창 후 지휘자가 고개를 끄덕이면 탈출 가능. 박수 소리가 들리면 실패.'
    },
    specialNotes: '현재 격리 상태. 담당자 이외 접근 금지. 노래를 기억하는 자는 정기적으로 기억 소거 조치를 받아야 한다.',
    isRestricted: true
  },
  {
    id: 'Qterw-E-63',
    title: '안녕 교통정보',
    grade: 'B',
    status: 'Active',
    department: 'D조',
    overview: '심야 시간대 특정 주파수(FM 87.3MHz)에서 수신되는 비정상적 라디오 방송. 존재하지 않는 도로와 사고 정보를 안내하며, 해당 경로를 따라가면 진입이 발생한다.',
    entryMethod: '새벽 2시~4시 사이, 차량 내에서 FM 87.3MHz 수신 후 안내 멘트에 따라 운전하면 진입. 반드시 혼자 탑승해야 하며, 차량은 10년 이상 된 모델이어야 한다.',
    explorationGuide: {
      survivalRules: [
        '방송이 끊길 때까지 절대 차를 세우지 말 것',
        '사이드미러에 보이는 것은 무시할 것',
        '갈림길에서 방송 지시와 반대로 가지 말 것',
        '연료 게이지를 확인하지 말 것'
      ],
      clearCondition: '"안녕히 가십시오. 안전 운전 하세요."라는 멘트가 나오면 다음 주유소에서 탈출 가능.'
    },
    specialNotes: '박민성 주임 담당. 주 1회 모니터링 중.',
    isRestricted: false
  },
  {
    id: 'Qterw-F-2073',
    title: '양자택일',
    grade: 'C',
    status: 'Active',
    department: 'D조',
    overview: '선택지가 제시되는 공간에 갇히는 현상. 잘못된 선택 시 ■■ 발생. 별관 3층 격리실에서 관리 중이다. 진입자는 반드시 "선택"이라는 단어에 반응하게 된다.',
    entryMethod: '별관 3층 302호 격리실에서 "둘 중 하나를 선택해"라고 말하면 진입. 조명이 깜빡인 후 두 개의 문이 나타난다.',
    explorationGuide: {
      survivalRules: [
        '주어진 시간 내에 반드시 선택할 것',
        '선택을 번복하지 말 것',
        '"둘 다" 또는 "안 고를래"라고 말하지 말 것',
        '문 너머를 들여다보지 말 것'
      ],
      clearCondition: '7회 연속 올바른 선택 시 탈출. 정답은 매번 바뀌며, 패턴 분석 진행 중.'
    },
    specialNotes: '김솔음 주임 담당. 현재 정답률 약 23% 수준.',
    isRestricted: false
  },
  {
    id: 'Qterw-B-441',
    title: '엘리베이터 게임',
    grade: 'A',
    status: 'Active',
    department: 'B조',
    overview: '10층 이상 건물의 엘리베이터에서 특정 순서로 버튼을 누르면 진입하는 이계. 1990년대 한국 인터넷에서 도시전설로 퍼졌으나, 실제 사례가 확인되어 관리 대상으로 지정되었다.',
    entryMethod: '4층 → 2층 → 6층 → 2층 → 10층 순서로 이동 후, 5층 버튼을 누른다. 여성이 탑승하면 말을 걸지 말고 1층 버튼을 누른다. 그래도 10층으로 가면 진입 성공.',
    explorationGuide: {
      survivalRules: [
        '절대로 여자에게 말을 걸거나 쳐다보지 말 것',
        '엘리베이터 밖으로 나가면 혼자여야 함',
        '불이 꺼져도 휴대폰 불빛을 사용하지 말 것',
        '10층에서 내릴 때 뒤를 돌아보지 말 것'
      ],
      clearCondition: '역순으로 층 이동 후 1층에서 하차. 다만 창문 밖이 붉은색이면 즉시 탈출 불가.'
    },
    specialNotes: '전 세계적으로 유사 사례 다수 보고됨. 국제 공조 필요.',
    isRestricted: true
  },
  {
    id: 'Qterw-D-892',
    title: '자정의 편의점',
    grade: 'D',
    status: 'Active',
    department: 'C조',
    overview: '자정에 특정 조건을 만족하는 편의점에 진입 시 발생하는 시간 정지 현상. 편의점 내부는 무한히 확장되며, "손님"들이 배회한다.',
    entryMethod: '자정 정각에 간판 불빛이 깜빡이는 편의점에 들어가 "삼각김밥 있나요?"라고 물으면 진입. 점원의 대답이 "네, 뒤쪽에요"이면 진입 성공.',
    explorationGuide: {
      survivalRules: [
        '다른 손님에게 말을 걸지 말 것',
        '삼각김밥 외의 물건을 집지 말 것',
        '계산대에서 정확한 금액을 지불할 것',
        '영수증을 버리지 말 것'
      ],
      clearCondition: '삼각김밥을 구매하고 영수증에 적힌 시간이 00:00:00이 아니면 탈출 가능.'
    },
    specialNotes: '비교적 안전한 등급으로 신입 훈련용으로 활용됨.',
    isRestricted: false
  },
  {
    id: 'Qterw-C-156',
    title: '거울 속의 방',
    grade: 'B',
    status: 'Isolated',
    department: 'A조',
    overview: '오래된 거울을 통해 진입하는 반전된 공간. 거울 속 세계는 현실과 미세하게 다르며, 장시간 체류 시 원래 세계로의 복귀가 불가능해진다.',
    entryMethod: '50년 이상 된 거울 앞에서 촛불을 켜고 자신의 이름을 세 번 속삭이면 진입. 거울 속 자신이 다르게 움직이기 시작하면 진입 성공.',
    explorationGuide: {
      survivalRules: [
        '거울 속 자신과 대화하지 말 것',
        '30분 이상 체류하지 말 것',
        '거울 속에서 다른 거울을 보지 말 것',
        '거울 속 자신이 웃으면 즉시 탈출할 것'
      ],
      clearCondition: '진입했던 거울을 통해 역으로 나오면 탈출. 단, 거울이 깨져 있으면 영구 실종.'
    },
    specialNotes: '격리 중인 거울 2점 보유. 무단 반입/반출 시 징계 대상.',
    isRestricted: false
  },
  {
    id: 'Qterw-S-01',
    title: '[데이터 말소]',
    grade: 'S',
    status: 'Disposed',
    department: '■■팀',
    overview: '■■■■■■■■ ■■■ ■■■■■■■ ■■■■■■ ■■■■ ■■■■■■ ■■■ ■■■■■■■■■■ ■■■ ■■■■■.',
    entryMethod: '[열람 권한 없음]',
    explorationGuide: {
      survivalRules: [
        '[열람 권한 없음]',
        '[열람 권한 없음]',
        '[열람 권한 없음]'
      ],
      clearCondition: '[열람 권한 없음]'
    },
    specialNotes: '강■■ 팀장 최종 확인 후 폐기 처리됨. 관련 기록 일체 말소.',
    isRestricted: true
  }
];

export const getManualById = (id: string): DarknessManualItem | undefined => {
  return manualData.find(item => item.id === id);
};

export const getGradeColor = (grade: DarknessGrade): string => {
  const colors: Record<DarknessGrade, string> = {
    'S': 'bg-red-600 text-white',
    'A': 'bg-orange-500 text-white',
    'B': 'bg-yellow-500 text-black',
    'C': 'bg-green-500 text-white',
    'D': 'bg-blue-500 text-white',
    'E': 'bg-indigo-500 text-white',
    'F': 'bg-gray-500 text-white'
  };
  return colors[grade];
};

export const getStatusLabel = (status: DarknessStatus): { label: string; className: string } => {
  const statusMap: Record<DarknessStatus, { label: string; className: string }> = {
    'Active': { label: '활성', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
    'Isolated': { label: '격리', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    'Disposed': { label: '폐기', className: 'bg-red-500/20 text-red-400 border-red-500/30' }
  };
  return statusMap[status];
};
