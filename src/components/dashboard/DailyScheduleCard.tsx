import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { useShadowStore } from '@/store/shadowStore';
import { useUserStore } from '@/store/userStore';
import { generateSchedule } from '@/utils/scheduleUtils';
import { isToday } from '@/utils/dateUtils';

const DailyScheduleCard = () => {
    const navigate = useNavigate();
    const { shadows } = useShadowStore();
    const { userName } = useUserStore();

    // Get today's schedule for assigned shadows
    const todayEvent = (() => {
        const myShadows = shadows.filter(s => s.assigneeName === userName);
        for (const shadow of myShadows) {
            const schedule = generateSchedule(shadow);
            const todayItem = schedule.find(item => isToday(item.date) && item.status !== 'completed'); // Show upcoming for today
            if (todayItem) {
                return {
                    title: todayItem.title,
                    time: todayItem.timeStr.replace(' 예정', ''),
                    shadowName: shadow.name
                };
            }
        }
        return null;
    })();

    return (
        <Card
            className="md:col-span-1 border-none shadow-md bg-gradient-to-br from-primary to-blue-600 text-white relative overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform duration-300 h-full"
            onClick={() => navigate('/calendar')}
        >
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>오늘의 일정</span>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-2">
                    <span className="text-4xl font-bold tracking-tight">
                        {todayEvent ? 'D-Day' : 'No Plan'}
                    </span>
                    <p className="text-blue-100 text-sm mt-1">
                        {todayEvent ? '예정된 점검 진행' : '오늘 예정된 점검이 없습니다'}
                    </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex justify-between items-center text-sm">
                        {todayEvent ? (
                            <>
                                <span>{todayEvent.time}</span>
                                <span className="opacity-80 truncate ml-2">
                                    {todayEvent.shadowName} - {todayEvent.title}
                                </span>
                            </>
                        ) : (
                            <>
                                <span>-</span>
                                <span className="opacity-80">휴식</span>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DailyScheduleCard;
