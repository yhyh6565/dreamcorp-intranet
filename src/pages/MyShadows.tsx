import { useNavigate } from 'react-router-dom';
import { useShadowStore } from '@/store/shadowStore';
import { useUserStore } from '@/store/userStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, MapPin, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import Layout from '@/components/Layout';
import { getRelativeDate, formatDate } from '@/utils/dateUtils';

const MyShadows = () => {
    const navigate = useNavigate();
    const { shadows } = useShadowStore();
    const { employeeId, userName } = useUserStore();

    // Filter shadows assigned to the current user
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
                        {myShadows.map(shadow => (
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
                                        {/* Mock Schedule Data */}
                                        <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-md shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">일일 상태 점검</p>
                                                    <p className="text-xs text-slate-400">09:00 - 10:00</p>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-green-100 text-green-700">완료됨</Badge>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-md shadow-sm ring-1 ring-indigo-500/20">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">정기 심층 분석</p>
                                                    <p className="text-xs text-slate-500">오늘 14:00 예정</p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="default" className="h-7 text-xs">
                                                점검 시작
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-md opacity-60">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-slate-300" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">주간 보고서 작성</p>
                                                    <p className="text-xs text-slate-400">{formatDate(getRelativeDate(1))}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400">예정</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-slate-500" />
                                            특이사항
                                        </h4>
                                        <div className="bg-amber-50 border border-amber-100 rounded-md p-3 text-sm text-amber-900 flex gap-2 items-start">
                                            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                            <p>최근 {shadow.name} 주변에서 비정상적인 온도 저하가 감지되었습니다. 접근 시 보온 장비를 착용하십시오.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyShadows;
