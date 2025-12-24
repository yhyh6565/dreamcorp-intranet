import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ChevronRight, Clock, ShieldAlert } from 'lucide-react';
import { formatDate, getRelativeDate } from '@/utils/dateUtils';
import { useShadowStore } from '@/store/shadowStore';
import { useUserStore } from '@/store/userStore';

const FacilityStatusCard = () => {
    const navigate = useNavigate();
    const { shadows } = useShadowStore();
    const { userName } = useUserStore();

    const myShadows = shadows.filter(s => s.assigneeName === userName);
    let hasShadow = myShadows.length > 0;
    let mainShadow = hasShadow ? myShadows[0] : null;
    let displayCount = myShadows.length;



    return (
        <Card
            className="group overflow-hidden relative border-none shadow-md bg-white hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
            onClick={() => navigate(hasShadow ? '/my-shadows' : '/shadow-assignment')}
        >
            <div className={`absolute top-0 left-0 w-1 h-full ${hasShadow ? 'bg-blue-500' : 'bg-red-500'}`} />
            <CardHeader className="pb-2 relative">
                <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                    <div className="flex items-center gap-2">
                        {hasShadow ? (
                            <MapPin className="h-4 w-4 text-primary" />
                        ) : (
                            <ShieldAlert className="h-4 w-4 text-red-500" />
                        )}
                        <span>담당 어둠</span>
                        {hasShadow && (
                            <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600">
                                {displayCount}
                            </Badge>
                        )}
                    </div>
                </CardTitle>
                {/* Last Update Moved to Top Right (Absolute or Flex) */}
                <div className="absolute top-6 right-6 flex md:hidden items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>
                        {hasShadow
                            ? `${formatDate(getRelativeDate(-5))} 14:30`
                            : '-'
                        }
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between w-full">
                    <div className="flex-1 mr-2 min-w-0">
                        {/* Desktop: Code above Name */}
                        {hasShadow && <div className="hidden md:block text-xs font-mono text-slate-500 mb-1">{mainShadow?.code}</div>}

                        <div className="flex items-baseline gap-2">
                            <h3 className={`text-xl md:text-2xl font-bold transition-colors truncate ${hasShadow ? 'text-slate-900 group-hover:text-primary' : 'text-red-900/80'}`}>
                                {hasShadow
                                    ? (myShadows.length > 1 ? `${mainShadow!.name} 외 ${myShadows.length - 1}개` : mainShadow!.name)
                                    : '담당 어둠 등록 요망'}
                            </h3>
                            {/* Mobile: Code next to Name */}
                            {hasShadow && <div className="md:hidden text-xs font-mono text-slate-500 truncate shrink-0">{mainShadow?.code}</div>}
                        </div>

                        <p className="text-sm text-slate-400 mt-1 truncate">
                            {hasShadow ? `위치: ${mainShadow!.locationText}` : '관리물이 배정되지 않았습니다.'}
                        </p>
                    </div>

                    {/* Badge always on right (desktop and mobile) */}
                    {hasShadow ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 shrink-0 mb-auto md:mb-1">안정</Badge>
                    ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 animate-pulse shrink-0 mb-auto md:mb-1">미배정</Badge>
                    )}
                </div>


                {/* Desktop-only Bottom Last Update */}
                <div className="hidden md:flex mt-4 pt-4 border-t border-slate-100 items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>
                        {hasShadow
                            ? `마지막 점검: ${formatDate(getRelativeDate(-5))} 14:30`
                            : '즉시 담당 어둠 배정 페이지에서 등록을 진행하십시오.'
                        }
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default FacilityStatusCard;
