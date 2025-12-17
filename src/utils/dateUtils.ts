// 실시간 날짜/시간 유틸리티
export const formatDate = (date: Date, format: 'full' | 'short' | 'time' | 'korean' = 'full') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

  switch (format) {
    case 'full':
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
    case 'short':
      return `${month}/${day} (${dayOfWeek})`;
    case 'time':
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    case 'korean':
      return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
    default:
      return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
  }
};

export const getRelativeDate = (daysOffset: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date;
};

export const getLastFridayOfMonth = (date: Date): Date => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const dayOfWeek = lastDay.getDay();
  const offset = dayOfWeek >= 5 ? dayOfWeek - 5 : dayOfWeek + 2;
  lastDay.setDate(lastDay.getDate() - offset);
  return lastDay;
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// 한국 공휴일 체크 (간단 버전)
export const getKoreanHolidays = (year: number): Date[] => {
  return [
    new Date(year, 0, 1),   // 신정
    new Date(year, 2, 1),   // 삼일절
    new Date(year, 4, 5),   // 어린이날
    new Date(year, 5, 6),   // 현충일
    new Date(year, 7, 15),  // 광복절
    new Date(year, 9, 3),   // 개천절
    new Date(year, 9, 9),   // 한글날
    new Date(year, 11, 25), // 크리스마스
  ];
};

export const isHoliday = (date: Date): boolean => {
  const holidays = getKoreanHolidays(date.getFullYear());
  return holidays.some(h => 
    h.getDate() === date.getDate() && 
    h.getMonth() === date.getMonth()
  );
};

// 괴담 목록 (랜덤 배정용)
export const anomalyList = [
  { id: 'Qterw-A-104', name: '웅얼거리는 맨홀', class: 'A' },
  { id: 'Qterw-D-43', name: '소곤대는 벤치', class: 'D' },
  { id: 'Qterw-A-37', name: '눈 감은 동상', class: 'A' },
  { id: 'Qterw-C-1642', name: '미완성 악보', class: 'C' },
  { id: 'Qterw-B-11', name: '거울 속 그림자', class: 'B' },
  { id: 'Qterw-B-666', name: '웃는 마네킹', class: 'B' },
  { id: 'Qterw-B-191', name: '비어있는 의자', class: 'B' },
  { id: 'Qterw-C-402', name: '멈춘 시계', class: 'C' },
  { id: 'Qterw-C-51', name: '젖은 발자국', class: 'C' },
  { id: 'Qterw-C-818', name: '끊긴 전화기', class: 'C' },
  { id: 'Qterw-C-1603', name: '녹슨 문고리', class: 'C' },
  { id: 'Qterw-C-5012', name: '낡은 인형', class: 'C' },
  { id: 'Qterw-D-210', name: '속삭이는 벽', class: 'D' },
  { id: 'Qterw-D-2367', name: '빈 사물함', class: 'D' },
  { id: 'Qterw-D-718', name: '흔들리는 커튼', class: 'D' },
  { id: 'Qterw-D-2076', name: '떨어지는 그림', class: 'D' },
  { id: 'Qterw-F-243', name: '잊혀진 일기장', class: 'F' },
];

export const getRandomAnomaly = () => {
  return anomalyList[Math.floor(Math.random() * anomalyList.length)];
};
