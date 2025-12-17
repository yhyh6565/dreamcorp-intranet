import { Room } from '@/data/floorData';
import { cn } from '@/lib/utils';
import React from 'react';

interface FloorRoomProps {
    room: Room;
}

const FloorRoom = ({ room }: FloorRoomProps) => {
    // Door Rendering Logic
    const renderDoor = () => {
        if (!room.hasDoor) return null;

        let style: React.CSSProperties = {};
        const doorSize = "4cqw";

        switch (room.hasDoor) {
            case 'bottom':
                style = { left: '50%', bottom: 0, transform: 'translate(-50%, 0)' };
                break;
            case 'top':
                style = { left: '50%', top: 0, transform: 'translate(-50%, 0) rotate(180deg)' };
                break;
            case 'left':
                style = { left: 0, top: '50%', transform: 'translate(0, -50%) rotate(90deg)' };
                break;
            case 'right':
                style = { right: 0, top: '50%', transform: 'translate(0, -50%) rotate(-90deg)' };
                break;
        }

        return (
            <div className="absolute inset-0 pointer-events-none overflow-visible">
                <svg className="w-full h-full overflow-visible">
                    <foreignObject x="0" y="0" width="100%" height="100%" className="overflow-visible">
                        <div className={`absolute w-[${doorSize}] h-[${doorSize}] pointer-events-none`} style={{ ...style, width: '4cqw', height: '4cqw' }}>
                            <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible">
                                {/* Door Leaf */}
                                <line x1="0" y1="40" x2="0" y2="5" stroke="#f59e0b" strokeWidth="3" />
                                {/* Swing Arc */}
                                <path d="M 0,40 A 35,35 0 0,1 35,5" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                            </svg>
                        </div>
                    </foreignObject>
                </svg>
            </div>
        );
    };

    return (
        <div
            className={cn(
                "absolute border border-slate-600/60 bg-slate-800/40 transition-colors flex items-center justify-center group/room",
                room.id === 'entrance' ? "border-none bg-transparent" : "hover:bg-slate-700/50 hover:border-blue-500/50",
                room.id === 'desk' && "rounded-full border-blue-500/50 bg-slate-800"
            )}
            style={{
                left: `${room.x}%`,
                top: `${room.y}%`,
                width: `${room.width}%`,
                height: `${room.height}%`,
            }}
        >
            <div className="text-center px-1 pointer-events-none z-10">
                {/* Default Room Name */}
                {room.id !== 'staff_gate' && room.id !== 'entrance' && (
                    <>
                        <p className="text-[1.6cqw] text-slate-400 font-medium truncate group-hover/room:text-blue-300 transition-colors">
                            {room.name}
                        </p>
                        {room.nameEn && (
                            <p className="text-[1cqw] text-slate-600 uppercase tracking-tighter mt-[0.2cqw] group-hover/room:text-blue-400/50">
                                {room.nameEn}
                            </p>
                        )}
                    </>
                )}
                {/* Staff Door Text */}
                {room.id === 'staff_gate' && (
                    <span className="text-[1.2cqw] text-red-500/70 whitespace-nowrap absolute -top-[1.5cqw] w-[15cqw] -left-[4cqw]">
                        관계자용
                    </span>
                )}
                {/* Entrance Text */}
                {room.id === 'entrance' && (
                    <span className="text-[1.2cqw] text-emerald-500 font-bold whitespace-nowrap border border-emerald-500/50 px-[0.5cqw] py-[0.2cqw] rounded bg-emerald-950/30">
                        Main Entrance
                    </span>
                )}
            </div>

            {renderDoor()}
        </div>
    );
};

export default FloorRoom;
