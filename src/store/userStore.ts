import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userName: string;
  team: string;
  rank: string;
  points: number;
  isLoggedIn: boolean;
  hasWelfareMallAccess: boolean;
  welfareMallLoginId: string;
  backButtonCount: number;
  spamMessageDeleted: boolean;
  jumpscareViewed: boolean;
  
  login: (id: string) => void;
  logout: () => void;
  loginToWelfareMall: (id: string, password: string) => boolean;
  incrementBackButton: () => void;
  resetBackButton: () => void;
  deleteSpamMessage: () => void;
  corruptUserName: () => void;
  setJumpscareViewed: () => void;
}

const getRandomTeam = () => {
  const teams = ['X조', 'Y조', 'Z조'];
  return teams[Math.floor(Math.random() * teams.length)];
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userName: '',
      team: '',
      rank: '',
      points: 15400,
      isLoggedIn: false,
      hasWelfareMallAccess: false,
      welfareMallLoginId: '',
      backButtonCount: 0,
      spamMessageDeleted: false,
      jumpscareViewed: false,

      login: (id: string) => {
        if (id === '김솔음') {
          set({
            userName: '김솔음',
            team: 'D조',
            rank: '주임',
            points: 15400,
            isLoggedIn: true,
          });
        } else {
          set({
            userName: id || '방문자',
            team: getRandomTeam(),
            rank: '사원',
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
          isLoggedIn: false,
          hasWelfareMallAccess: false,
          welfareMallLoginId: '',
          backButtonCount: 0,
          spamMessageDeleted: false,
          jumpscareViewed: false,
        });
      },

      loginToWelfareMall: (id: string, _password: string) => {
        set({
          hasWelfareMallAccess: true,
          welfareMallLoginId: id,
        });
        return true;
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
    }),
    {
      name: 'daydream-user-storage',
    }
  )
);
