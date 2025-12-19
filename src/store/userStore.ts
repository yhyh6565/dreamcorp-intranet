import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShadowStore } from './shadowStore';

interface UserState {
  userName: string;
  team: string;
  rank: string;
  employeeId: string;
  points: number;
  isLoggedIn: boolean;
  hasWelfareMallAccess: boolean;
  welfareMallLoginId: string;
  welfareMallHiddenAccess: boolean;
  backButtonCount: number;
  spamMessageDeleted: boolean;
  jumpscareViewed: boolean;
  isNavigationDisabled: boolean;

  login: (id: string) => void;
  logout: () => void;
  loginToWelfareMall: (id: string, password: string) => boolean;
  deductPoints: (amount: number) => void;
  incrementBackButton: () => void;
  resetBackButton: () => void;
  deleteSpamMessage: () => void;
  corruptUserName: () => void;
  setJumpscareViewed: () => void;
  setNavigationDisabled: (disabled: boolean) => void;
  securityTimerActive: boolean;
  securityMessageTriggered: boolean;
  isSecurityMessageRead: boolean;
  isSecurityToastShown: boolean;
  securityEasterEggDone: boolean;
  startSecurityTimer: () => void;
  triggerSecurityMessage: () => void;
  markSecurityMessageRead: () => void;
  setSecurityToastShown: () => void;
  completeSecurityEasterEgg: () => void;
  isPointGlitching: boolean;
  setPointGlitching: (isGlitching: boolean) => void;
}

const getRandomTeam = () => {
  const teams = ['X조', 'Y조', 'Z조'];
  return teams[Math.floor(Math.random() * teams.length)];
};

const generateRandomName = () => {
  const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
  const firstNames = ['민준', '서준', '도윤', '예준', '시우', '하준', '지호', '지유', '서윤', '서연', '민재', '현우', '건우', '지훈', '우진', '수아', '하은', '도현', '연우', '민수'];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  return `${last}${first}`;
};

const generateRandomEmployeeId = () => {
  return `Qterw-Z-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const PREDEFINED_USERS: Record<string, { name: string; team: string; rank: string; points: number }> = {
  '김솔음': { name: '김솔음', team: 'D조', rank: '주임', points: 154000 },
  '백석주': { name: '백석주', team: 'A조', rank: '과장', points: 423000 },
  '진나솔': { name: '진나솔', team: 'A조', rank: '대리', points: 305000 },
  '이석종': { name: '이석종', team: 'A조', rank: '대리', points: 102000 },
  '이성해': { name: '이성해', team: 'B조', rank: '대리', points: 201000 },
  '강도준': { name: '강도준', team: 'C조', rank: '대리', points: 8000 },
  '이자헌': { name: '이자헌', team: 'D조', rank: '과장', points: 365000 },
  '은하제': { name: '은하제', team: 'D조', rank: '대리', points: 165000 },
  '박민성': { name: '박민성', team: 'D조', rank: '주임', points: 150200 },
  '백사헌': { name: '백사헌', team: 'F조', rank: '사원', points: 51000 },
  '장허운': { name: '장허운', team: 'F조', rank: '사원', points: 12000 },
  '강이학': { name: '강이학', team: 'I조', rank: '사원', points: 48000 },
  '고영은': { name: '고영은', team: 'R조', rank: '사원', points: 31000 },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userName: '',
      team: '',
      rank: '',
      employeeId: '',
      points: 15400,
      isLoggedIn: false,
      hasWelfareMallAccess: false,
      welfareMallLoginId: '',
      welfareMallHiddenAccess: false,
      backButtonCount: 0,
      spamMessageDeleted: false,
      jumpscareViewed: false,
      isNavigationDisabled: false,

      login: (id: string) => {
        const user = PREDEFINED_USERS[id];
        if (user) {
          set({
            userName: user.name,
            team: user.team,
            rank: user.rank,
            employeeId: '',
            points: user.points,
            isLoggedIn: true,
          });
        } else {
          set({
            userName: generateRandomName(),
            team: getRandomTeam(),
            rank: '사원',
            employeeId: generateRandomEmployeeId(),
            points: 520,
            isLoggedIn: true,
          });
        }
      },

      logout: () => {
        set({
          userName: '',
          team: '',
          rank: '',
          employeeId: '',
          isLoggedIn: false,
          hasWelfareMallAccess: false,
          welfareMallLoginId: '',
          welfareMallHiddenAccess: false,
          backButtonCount: 0,
          spamMessageDeleted: false,
          jumpscareViewed: false,
          isNavigationDisabled: false,
          securityTimerActive: false,
          securityMessageTriggered: false,
          isSecurityMessageRead: false,
          isSecurityToastShown: false,
          securityEasterEggDone: false,
        });
        useShadowStore.getState().resetShadows();
      },

      loginToWelfareMall: (id: string, password: string) => {
        const isHiddenAccess = id === 'yongj1111' && password === 'Dydajflgodks!111';
        set((state) => ({
          hasWelfareMallAccess: true,
          welfareMallLoginId: id,
          welfareMallHiddenAccess: isHiddenAccess,
          points: isHiddenAccess ? 365000 : state.points // Update points for hidden persona
        }));
        return true;
      },

      deductPoints: (amount: number) => {
        set((state) => ({ points: Math.max(0, state.points - amount) }));
      },

      incrementBackButton: () => {
        set((state) => ({ backButtonCount: state.backButtonCount + 1 }));
      },

      resetBackButton: () => {
        set({ backButtonCount: 0 });
      },

      deleteSpamMessage: () => {
        set({ spamMessageDeleted: true });
      },

      corruptUserName: () => {
        set({ userName: '■■■' });
      },

      setJumpscareViewed: () => {
        set({ jumpscareViewed: true });
      },

      securityTimerActive: false,
      securityMessageTriggered: false,
      isSecurityMessageRead: false,
      isSecurityToastShown: false,
      securityEasterEggDone: false,

      startSecurityTimer: () => {
        if (get().securityEasterEggDone) return;
        set({ securityTimerActive: true });
      },

      triggerSecurityMessage: () => {
        set({ securityTimerActive: false, securityMessageTriggered: true });
      },

      markSecurityMessageRead: () => {
        set({ isSecurityMessageRead: true });
      },

      setSecurityToastShown: () => {
        set({ isSecurityToastShown: true });
      },

      completeSecurityEasterEgg: () => {
        set({
          securityMessageTriggered: false,
          securityTimerActive: false,
          securityEasterEggDone: true,
        });
      },

      setNavigationDisabled: (disabled: boolean) => {
        set({ isNavigationDisabled: disabled });
      },

      isPointGlitching: false,
      setPointGlitching: (isGlitching: boolean) => {
        set({ isPointGlitching: isGlitching });
      },
    }),
    {
      name: 'daydream-user-storage',
    }
  )
);
