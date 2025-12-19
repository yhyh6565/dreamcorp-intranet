import { useNavigate } from 'react-router-dom';
import { useShadowStore, ShadowEntity } from '@/store/shadowStore';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, MapPin, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import Layout from '@/components/Layout';
import { getRelativeDate, formatDate } from '@/utils/dateUtils';
import { generateSchedule } from '@/utils/scheduleUtils';

const MyShadows = () => {
    const navigate = useNavigate();
    const { shadows } = useShadowStore();
    const { employeeId, userName } = useUserStore();

    const myShadows = shadows.filter(s => s.assigneeName === userName);

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'B': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'C': return 'bg-green-50 text-green-700 border-green-200';
            case 'D': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'E': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'F': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-slate-50 text-slate-500 border-slate-200';
        }
    };

    // Simple seeded random function
    const seededRandom = (seed: string) => {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
    };

    // Generate schedule items based on shadow code
    const generateSchedule = (shadow: ShadowEntity) => {
        const seedBase = shadow.code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        // Helper to get a random non-weekend date
        const getSafeDate = (baseOffset: number, variance: number, seedOffset: number) => {
            let offset = baseOffset + (Math.floor(Math.abs(Math.sin(seedBase + seedOffset) * 10000) % variance));
            let date = getRelativeDate(offset);

            // Adjust if weekend (Sunday=0, Saturday=6)
            let day = date.getDay();
            if (day === 0) date = getRelativeDate(offset + 1); // Sun -> Mon
            else if (day === 6) date = getRelativeDate(offset + 2); // Sat -> Mon

            return date;
        };

        const randomTime = (seedOffset: number) => {
            const h = 9 + (Math.floor(Math.abs(Math.sin(seedBase + seedOffset) * 10000) % 9)); // 09:00 ~ 17:00
            const m = (Math.floor(Math.abs(Math.sin(seedBase + seedOffset + 1) * 10000) % 6)) * 10;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        const completedDate = getSafeDate(-3, 3, 1); // 0~3 days ago
        const upcomingDate = getSafeDate(0, 2, 2); // Today or Tomorrow
        const futureDate = getSafeDate(3, 5, 3); // 3~8 days later

        return [
            {
                id: 1,
                title: '일일 상태 점검',
                date: completedDate,
                timeStr: '09:00 - 10:00',
                status: 'completed',
                statusText: '완료됨',
                color: 'green'
            },
            {
                id: 2,
                title: '정기 심층 분석',
                date: upcomingDate,
                timeStr: `${randomTime(10)} 예정`,
                status: 'upcoming',
                statusText: isToday(upcomingDate) ? '오늘 예정' : '내일 예정',
                color: 'indigo'
            },
            {
                id: 3,
                title: '주간 보고서 작성',
                date: futureDate,
                timeStr: randomTime(20),
                status: 'future',
                statusText: '예정',
                color: 'slate'
            }
        ];
    };

    // Check if date is today for UI display
    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-indigo-600" />
                        담당 어둠 (Assigned Shadows)
                    </h2>
                    <p className="text-slate-500 mt-1">
                        {userName} 님의 담당 부재 관리 현황입니다.
                    </p>
                </div>

                {myShadows.length === 0 ? (
                    <Card className="border-dashed border-2 shadow-sm bg-slate-50/50">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                            <ShieldAlert className="h-12 w-12 mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold text-slate-600">배정된 관리물이 없습니다</h3>
                            <p className="mb-6 max-w-sm">
                                아직 담당하고 있는 어둠이 없습니다. '담당 어둠 배정' 메뉴에서 관리물을 등록해 주세요.
                            </p>
                            <Button onClick={() => navigate('/shadow-assignment')}>
                                배정하러 가기
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {myShadows.map(shadow => {
                            const schedule = generateSchedule(shadow);

                            return (
                                <Card key={shadow.code} className="overflow-hidden border-l-4 border-l-indigo-500 shadow-md">
                                    <CardHeader className="bg-slate-50 pb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline" className={`${getGradeColor(shadow.grade)}`}>
                                                        Grade {shadow.grade}
                                                    </Badge>
                                                    <span className="text-xs font-mono text-slate-400">{shadow.code}</span>
                                                </div>
                                                <CardTitle className="text-xl font-bold text-slate-800">
                                                    {shadow.name}
                                                </CardTitle>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => navigate('/floor-map')}>
                                                <MapPin className="h-4 w-4 mr-2" />
                                                위치 확인
                                            </Button>
                                        </div>
                                        <CardDescription className="flex items-center gap-1 mt-1">
                                            <MapPin className="h-3 w-3" />
                                            {shadow.locationText} (Floor: {shadow.floor}F)
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-slate-500" />
                                            점검 스케쥴 (Inspection Schedule)
                                        </h4>

                                        <div className="space-y-3">
                                            {/* Completed Item */}
                                            <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-md shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">{schedule[0].title}</p>
                                                        <p className="text-xs text-slate-400">{schedule[0].timeStr}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">{schedule[0].statusText}</Badge>
                                            </div>

                                            {/* Upcoming Item */}
                                            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-md shadow-sm ring-1 ring-indigo-500/20">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{schedule[1].title}</p>
                                                        <p className="text-xs text-slate-500">{schedule[1].statusText} ({formatDate(schedule[1].date, 'short')})</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="default" className="h-7 text-xs">
                                                    점검 시작
                                                </Button>
                                            </div>

                                            {/* Future Item */}
                                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-md opacity-60">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-2 rounded-full bg-slate-300" />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-600">{schedule[2].title}</p>
                                                        <p className="text-xs text-slate-400">{formatDate(schedule[2].date, 'short')} {schedule[2].timeStr}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400">{schedule[2].statusText}</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-100">
                                            <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-slate-500" />
                                                특이사항
                                            </h4>
                                            <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-sm text-amber-900 flex gap-2 items-start">
                                                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                                <p>{shadow.note || "특이사항 없음"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyShadows;
