export type DarknessGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type DarknessStatus = 'Active' | 'Isolated' | 'Disposed';

export interface ManualSection {
  title: string;
  content?: string;
  children?: ManualSection[];
  securityLevel?: string; // e.g. 'C' for Manager only
  isCallout?: boolean; // New: For rendering callouts
}

export interface DarknessManualItem {
  id: string;           // 식별 코드 (Qterw-...)
  title: string;        // 어둠 명칭
  grade: DarknessGrade; // 등급
  status: DarknessStatus; // 관리 상태
  department: string;   // 담당 부서

  // 상세 내용
  overview: string;           // 개요
  entryMethod: string;        // 진입 방법
  entryMethodSecurityLevel?: string; // 진입 방법 보안 레벨 (NEW)
  entryNodes?: ManualSection[]; // 진입 방법 (구조화된 데이터 - 선택사항)
  explorationGuide: ManualSection[]; // 탐사 가이드 (Phase 1, 2, 3...)
  specialNotes?: string;      // 특이사항 (Optional)
  specialNotesSecurityLevel?: string; // 특이사항 보안 레벨 (NEW)
  specialNoteNodes?: ManualSection[]; // 특이사항 구조화 데이터 (NEW)

  // Callout-only mode (for special manuals like Qterw-B-666)
  calloutOnlyMode?: boolean;  // If true, render only callouts
  callouts?: string[];        // Array of callout content blocks

  isRestricted: boolean;      // S, A등급 여부 (true면 모달 띄움)
}

// Data fetching
export const fetchManuals = async (): Promise<DarknessManualItem[]> => {
  try {
    const response = await fetch(`/data/manuals.json?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch manuals');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching manuals:', error);
    return [];
  }
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
