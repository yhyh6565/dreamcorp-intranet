import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ChevronRight, Clock } from 'lucide-react';
import { formatDate, getRelativeDate } from '@/utils/dateUtils';

interface FacilityStatusCardProps {
    isSoleum: boolean;
}

const FacilityStatusCard = ({ isSoleum }: FacilityStatusCardProps) => {
    const navigate = useNavigate();

    return (
        <Card
            className="md:col-span-2 group overflow-hidden relative border-none shadow-md bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => navigate('/floor-map')}
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>담당 관리 구역</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                            {isSoleum ? '양자택일' : '웅얼거리는 맨홀'}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            {isSoleum ? '식별코드: Qterw-F-2073' : '위치: 지하 2층 B-04 구역'}
                        </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">안정</Badge>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>마지막 점검: {formatDate(getRelativeDate(-5))} 14:30</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default FacilityStatusCard;
