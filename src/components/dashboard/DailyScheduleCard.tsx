import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';

const DailyScheduleCard = () => {
    const navigate = useNavigate();

    return (
        <Card
            className="md:col-span-1 border-none shadow-md bg-gradient-to-br from-primary to-blue-600 text-white relative overflow-hidden cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
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
                    <span className="text-4xl font-bold tracking-tight">D-Day</span>
                    <p className="text-blue-100 text-sm mt-1">정기 순찰일</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex justify-between items-center text-sm">
                        <span>14:00</span>
                        <span className="opacity-80">4구역 순찰</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DailyScheduleCard;
