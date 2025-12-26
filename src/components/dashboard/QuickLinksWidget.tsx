import { useState } from 'react';
import { useUserStore, PREDEFINED_USERS } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Building2, Cat, Archive, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGuestGuard } from '@/hooks/useGuestGuard';

import AnnexVisitModal from '@/components/modals/AnnexVisitModal';
import FoxCounselingModal from '@/components/modals/FoxCounselingModal';
import StorageRentalModal from '@/components/modals/StorageRentalModal';

const QuickLinksWidget = () => {
    const navigate = useNavigate();
    const { checkRank } = useUserStore();
    const { requireAuth } = useGuestGuard();
    const [showAnnexVisit, setShowAnnexVisit] = useState(false);
    const [showFoxCounseling, setShowFoxCounseling] = useState(false);
    const [showStorageRental, setShowStorageRental] = useState(false);

    // Logic: Special Authority (Privileged) if Rank is '주임' (Senior Staff) or higher.
    const hasPrivilegedAccess = checkRank('주임');

    const quickLinks = [
        {
            icon: Building2,
            label: '별관 방문',
            action: () => {
                if (!requireAuth("별관 방문 신청을 할 수 없습니다.")) return;
                setShowAnnexVisit(true);
            },
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            visible: true
        },
        {
            icon: Cat,
            label: '여우상담실',
            action: () => setShowFoxCounseling(true),
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            visible: hasPrivilegedAccess
        },
        {
            icon: Archive,
            label: '대여창고',
            action: () => setShowStorageRental(true),
            color: 'text-slate-600',
            bgColor: 'bg-slate-100',
            visible: hasPrivilegedAccess
        },
        {
            icon: Gift,
            label: '복지몰',
            action: () => navigate('/welfare-mall'),
            color: 'text-pink-600',
            bgColor: 'bg-pink-100',
            visible: true // Added Welfare Mall explicitly as per image request "복지몰"
        }
    ].filter(link => link.visible);

    const shouldUseGrid = quickLinks.length >= 4;

    return (
        <>
            <div className={cn(
                "grid gap-3 h-full",
                shouldUseGrid ? "grid-cols-2 md:grid-cols-1" : "grid-cols-1"
            )}>
                {quickLinks.map((link, idx) => (
                    <Button
                        key={idx}
                        variant="outline"
                        className="w-full justify-start gap-3 h-auto min-h-[60px] md:min-h-0 md:h-full bg-white hover:bg-slate-50 border-slate-200 shadow-sm transition-all hover:shadow-md py-4 md:py-0"
                        onClick={link.action}
                    >
                        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0", link.bgColor)}>
                            <link.icon className={cn("h-3 w-3", link.color)} />
                        </div>
                        <span className="font-medium text-slate-700 truncate">{link.label}</span>
                    </Button>
                ))}
            </div>

            <AnnexVisitModal open={showAnnexVisit} onClose={() => setShowAnnexVisit(false)} />
            <FoxCounselingModal open={showFoxCounseling} onClose={() => setShowFoxCounseling(false)} />
            <StorageRentalModal open={showStorageRental} onClose={() => setShowStorageRental(false)} />
        </>
    );
};

export default QuickLinksWidget;
