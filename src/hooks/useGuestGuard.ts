import { useUserStore } from '@/store/userStore';
import { useToast } from '@/hooks/use-toast';

export const useGuestGuard = () => {
    const { isGuest } = useUserStore();
    const { toast } = useToast();

    /**
     * Checks if the current user is a guest.
     * If the user is a guest, a toast notification is displayed with the given message,
     * and the function returns false (access denied).
     * If the user is not a guest, returns true (access allowed).
     * 
     * @param deniedMessage - The message to display in the toast if access is denied.
     * @returns boolean - true if access is allowed (not a guest), false otherwise.
     */
    const requireAuth = (deniedMessage: string) => {
        if (isGuest) {
            toast({
                title: "접근 거부됨",
                description: `게스트 권한으로는 ${deniedMessage}`,
                variant: "destructive"
            });
            return false;
        }
        return true;
    };

    return { requireAuth, isGuest };
};
