import { Marker } from '@/data/markerData';
import { cn } from '@/lib/utils';
import { Info, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface FloorMarkerProps {
    marker: Marker;
    onMouseEnter: (id: string) => void;
    onMouseLeave: () => void;
}

const FloorMarker = ({ marker, onMouseEnter, onMouseLeave }: FloorMarkerProps) => {
    const navigate = useNavigate();

    const getStatusColor = (status: Marker['status']) => {
        switch (status) {
            case 'stable': return 'bg-emerald-500 shadow-emerald-500/50';
            case 'caution': return 'bg-amber-500 shadow-amber-500/50';
            case 'danger': return 'bg-rose-500 shadow-rose-500/50';
            case 'dormant': return 'bg-slate-500 shadow-slate-500/50';
            case 'restricted': return 'bg-red-600 shadow-red-600/50';
            default: return 'bg-slate-500 shadow-slate-500/50';
        }
    };

    const getStatusText = (status: Marker['status']) => {
        switch (status) {
            case 'stable': return '안정';
            case 'caution': return '주의';
            case 'danger': return '위험';
            case 'dormant': return '동면 중';
            case 'restricted': return '접근 금지';
            default: return '알 수 없음';
        }
    };

    return (
        <div
            className="absolute z-20"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
        >
            {/* Marker Button */}
            <button
                className={cn(
                    "w-[3cqw] h-[3cqw] rounded-full shadow-lg border-2 border-white/20 flex items-center justify-center transition-transform hover:scale-125",
                    getStatusColor(marker.status),
                    marker.status === 'danger' || marker.status === 'restricted' ? "animate-pulse" : ""
                )}
                style={{ transform: 'translate(-50%, -50%)' }}
                onMouseEnter={() => onMouseEnter(marker.id)}
                onMouseLeave={() => onMouseLeave()}
                onClick={() => {
                    if (marker.id === 'marker-2') navigate('/calendar');
                }}
            >
                {marker.status === 'restricted' || marker.status === 'danger'
                    ? <ShieldAlert className="h-[1.5cqw] w-[1.5cqw] text-white" />
                    : <Info className="h-[1.5cqw] w-[1.5cqw] text-white" />
                }
            </button>
        </div>
    );
};

export default FloorMarker;
