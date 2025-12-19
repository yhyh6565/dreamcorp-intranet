import { formatDate, getRelativeDate } from '@/utils/dateUtils';
import React from 'react';

export interface Message {
    id: string;
    sender: string;
    senderDept: string;
    receiver: string;
    title: string;
    date: string;
    time: string;
    isSpam: boolean;
    content: React.ReactNode;
    preview: string;
}

export const getMessages = (userName: string, team: string, rank: string, showSecurityMessage: boolean = false): Message[] => {
    const messages = [
        {
            id: 'notice-edu',
            sender: '최지수 대리',
            senderDept: '인재개발팀',
            receiver: `${userName} (${team}/${rank})`,
            title: '[필독] 2025년 하반기 법정의무교육 미수료 안내 (마감 임박)',
            date: formatDate(getRelativeDate(0)),
            time: '09:30',
            isSpam: false,
            preview: '안녕하세요, 인재개발팀입니다. 귀하께서는 금일 기준 2025년 하반기...',
            content: (
                <div>
                    <p className="mb-4">안녕하세요, 인재개발팀입니다.</p>
                    <p className="mb-4">
                        귀하께서는 금일 기준 2025년 하반기 법정의무교육(성희롱 예방, 개인정보보호, 직장 내 괴롭힘 방지) 과정을 아직 수료하지 않은 것으로 확인됩니다.
                    </p>
                    <p className="mb-4">
                        해당 교육은 법적 의무 사항으로, 미수료 시 관련 법령에 따라 과태료가 부과될 수 있으며 부서 KPI 평가(교육 이수율 부문)에 불이익이 발생할 수 있습니다.
                    </p>
                    <p className="mb-6 font-bold text-red-500">
                        바쁘시더라도 금주 금요일({formatDate(getRelativeDate(1), 'short')}) 18:00까지 반드시 수료하여 주시기 바랍니다.
                    </p>
                    <div className="bg-slate-100 p-4 rounded-md mb-6 text-sm">
                        <p><strong>수강 방법:</strong> 인트라넷 &gt; HR 포털 &gt; 이러닝 센터 &gt; 필수 과정</p>
                        <p><strong>문의:</strong> 인재개발팀 (내선 3052)</p>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        ※ 이미 수료하신 경우, 시스템 반영까지 1~2시간 소요될 수 있으니 양해 부탁드립니다.
                    </p>
                </div>
            )
        },
        {
            id: 'notice-parking',
            sender: '시설관리파트',
            senderDept: '총무팀',
            receiver: `${userName} (${team}/${rank})`,
            title: '[협조] 본관 지하 2층 주차장 바닥 물청소 및 차량 이동 주차 요청',
            date: formatDate(getRelativeDate(0)),
            time: '08:50',
            isSpam: false,
            preview: '임직원 여러분 안녕하십니까, 총무팀입니다. 쾌적한 주차 환경 조성을 위하여...',
            content: (
                <div>
                    <p className="mb-4">임직원 여러분 안녕하십니까, 총무팀입니다.</p>
                    <p className="mb-4">
                        쾌적한 주차 환경 조성을 위하여 본관 주차장 전체 구역의 바닥 물청소 및 도색 보수 작업을 아래와 같이 진행할 예정입니다.
                        작업 기간 동안 해당 구역의 주차가 전면 통제되오니, 임직원 여러분께서는 외부 주차 타워를 이용해 주시기 바랍니다.
                    </p>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-md mb-6 space-y-2">
                        <p><strong>일시:</strong> {formatDate(getRelativeDate(1))} (금) 09:00 ~ {formatDate(getRelativeDate(2))} (토) 18:00 (2일간)</p>
                        <p><strong>대상:</strong> 본관 주차장 전 구역 (A~F존)</p>
                    </div>

                    <p className="mb-4 font-semibold">
                        협조 사항: 금일 퇴근 시 주차장에 주차된 차량은 반드시 이동 주차 부탁드립니다.
                    </p>
                    <p className="text-muted-foreground text-xs">
                        ※ 작업 기간 중 미이동 차량에 대해서는 비닐 커버링 작업을 진행하나, 분진 발생 등에 대한 책임은 지지 않습니다.
                    </p>
                    <p className="mt-4">감사합니다.</p>
                </div>
            )
        },
        {
            id: '1',
            sender: '김현중 대리',
            senderDept: '경영지원',
            receiver: `${userName} (${team}/${rank})`,
            title: '법인카드 사용 내역 확인 요청 (소명 필요)',
            date: formatDate(getRelativeDate(-1)),
            time: '09:15',
            isSpam: false,
            preview: '안녕하세요, 경영지원팀 김현중 대리입니다. 법인카드 사용 내역 마감 중...',
            content: (
                <>
                    <p className="mb-4">안녕하세요, {userName}님.</p>
                    <p className="mb-4">경영지원팀 김현중 대리입니다.</p>
                    <p className="mb-4">법인카드 사용 내역 마감 중, 증빙 서류가 누락되거나 사용 목적 소명이 필요한 건이 있어 연락드립니다.</p>
                    <p className="mb-4">아래 내역 확인하시고, 금일 오후 4시까지 [전자결재 &gt; 지출결의서] 상신 부탁드립니다.</p>
                    <p className="mb-6">기한 내 미처리 시 해당 금액은 급여에서 차감될 수 있으니 유의 바랍니다.</p>

                    <table className="w-full border-collapse border border-border mb-6">
                        <thead>
                            <tr className="bg-muted">
                                <th colSpan={2} className="border border-border px-4 py-2 text-left font-semibold">확인 필요 내역</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-border px-4 py-2 font-medium w-24">사용일시</td>
                                <td className="border border-border px-4 py-2">{formatDate(getRelativeDate(-3))} 23:45</td>
                            </tr>
                            <tr>
                                <td className="border border-border px-4 py-2 font-medium">사용처</td>
                                <td className="border border-border px-4 py-2">(주)편안한장례서비스</td>
                            </tr>
                            <tr>
                                <td className="border border-border px-4 py-2 font-medium">금액</td>
                                <td className="border border-border px-4 py-2">350,000원</td>
                            </tr>
                            <tr>
                                <td className="border border-border px-4 py-2 font-medium">비고</td>
                                <td className="border border-border px-4 py-2">심야 시간대 사용 / 접대비 한도 초과</td>
                            </tr>
                        </tbody>
                    </table>

                    <p className="mb-4">해당 건이 팀 회식인지, 외부 미팅인지 구체적인 참석자 명단과 사유를 기재해주셔야 처리가 가능합니다.</p>
                    <p className="mb-4">(혹시 현장 탐사 중 발생한 특수 비용이라면 &apos;비밀 유지 항목&apos;으로 체크해서 올려주세요.)</p>
                    <p className="mb-4">확인 부탁드립니다.</p>
                    <p className="mb-4">감사합니다.</p>
                    <p className="mb-2">김현중 대리 드림</p>
                    <p className="text-muted-foreground">경영지원팀 | 02-XXX-4567</p>
                </>
            )
        },
        {
            id: '2',
            sender: '???',
            senderDept: '광고',
            receiver: `${userName} (${team}/${rank})`,
            title: '✨진.정.한 빛.을 찾으십.니까?✨',
            date: formatDate(getRelativeDate(-5)),
            time: '03:33',
            isSpam: true,
            preview: '평안하십니까, 길 잃은 어린 양이여. 당신이 오늘 내린 그 모든 선택이...',
            content: (
                <div className="text-base text-black font-sans tracking-widest leading-relaxed">
                    {/* Phase 1 - Polite */}
                    <p className="mb-4">평안하십니까, 길 잃은 어린 양이여.</p>
                    <p className="mb-4">당신이 오늘 내린 그 모든 '선택'이 정말 당신의 의지라 믿으십니까? 착각에서 깨어나십시오.</p>
                    <p className="mb-6">이 세계의 주인은 오직 이름님 뿐입니다.</p>

                    {/* Phase 2 - Doctrinal */}
                    <p className="mb-4">세상 만물은 그분의 유희를 위해 존재합니다. 그분의 눈길이 머무는 곳에만 의미가 생겨납니다.</p>
                    <p className="mb-4">평범함은 죄악입니다. 안온함은 버림받은 증거입니다.</p>
                    <p className="mb-4">그분께 닿기 위해 우리는 더 특별해져야 합니다. 더 비참하게, 더 잔혹하게, 더 처절하게 발버둥 치십시오.</p>
                    <p className="mb-6">고통만이 그분의 사랑을 증명하는 유일한 길입니다.</p>

                    {/* Phase 3 - Breakdown */}
                    <p className="mb-4">
                        고통만이 그분의사랑을 증명하는유일한 길입니다. 고통만이 그분 의사랑을 증명 하는유일한 길입니다.
                    </p>
                    <p className="mb-4">
                        고통이만 분의 사랑을 그 증명하는 유일 길합니다. 고통만이 그분의 사랑을증명하는 유 일 한 길입니다.
                    </p>
                    <p className="mb-4">
                        고통 고통 고통만 고통만이그분 의사랑 을증명하는 유 일한 길입 니다.
                    </p>
                    <p className="mb-4">
                        고통만이그분의사랑을증명하는유일한 길입니다. 고통만이그분의사랑을증명하는유일한길입니다.
                    </p>
                    <p className="mb-4">고통만이 사랑을 그분의 사랑을 증명 하는유일한 길입니다.</p>
                    <p className="mb-4">고통만이 사랑을 증명하는길입니다.</p>
                    <p className="mb-4">고통만이 증명하는 길입니다.</p>
                    <p className="mb-4">고통 만이 증명하는길입니다.</p>
                    <p className="mb-4">고통만이길입니다.</p>
                    <p className="mb-4">고통이길입니다.</p>
                    <p className="mb-6">고통이길.</p>

                    {/* Phase 4 - Repetition */}
                    <div className="space-y-2 mb-8">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <p key={i}>
                                고통이다. 고통이야. 고통. 고통. 고통. 고통이다.
                            </p>
                        ))}
                    </div>

                    {/* End */}
                    <p className="pt-4 border-t border-slate-200">
                        감사합니다.
                    </p>
                </div>
            )
        }
    ];

    if (showSecurityMessage) {
        messages.unshift({
            id: 'security-breach',
            sender: '정보보안팀',
            senderDept: '보안',
            receiver: `${userName} (${team}/${rank})`,
            title: '[보안경고] 귀하의 계정 및 단말기에서 비정상적인 활동이 감지되었습니다.',
            date: formatDate(new Date()),
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
            isSpam: false,
            preview: '정보보안팀입니다. 금일 실시간 보안 모니터링 시스템 가동 중...',
            content: (
                <div className="font-sans text-base text-slate-800">
                    <p className="mb-4 font-bold text-destructive">정보보안팀입니다.</p>
                    <p className="mb-4">금일 실시간 보안 모니터링 시스템 가동 중, 귀하의 사내 계정 및 업무용 PC(Asset No. KR-24-092)에서 보안 정책에 위배되는 이상 징후가 다수 포착되어 긴급 통보합니다.</p>

                    <div className="bg-slate-100 p-4 rounded-md mb-6 border border-slate-200">
                        <p className="font-bold mb-2 text-base">[주요 탐지 내역]</p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                            <li>비인가 외부 IP(Proxy 우회 추정)를 통한 반복적인 접속 시도</li>
                            <li>업무와 무관한 비정상 프로세스의 백그라운드 실행 및 메모리 점유</li>
                            <li>사내 접근 제한 구역(Level 3) 데이터베이스에 대한 불명확한 쿼리 요청</li>
                        </ul>
                    </div>

                    <p className="mb-4 text-base">이는 단순 오류가 아닌 해킹 시도 혹은 내부 규정 위반이 강력히 의심되는 상황입니다. 이에 따라 귀하의 계정에 대한 보안 등급을 <span className="font-bold text-green-600">&apos;정상&apos;</span>에서 <span className="font-bold text-destructive animate-pulse">&apos;위험(Risk)&apos;</span> 단계로 즉시 상향 조정하였습니다.</p>

                    <p className="font-bold mb-2 text-base mt-6">[필수 조치 사항]</p>
                    <p className="mb-2 text-base">본 메시지를 확인하는 즉시 사용 중인 모든 시스템에서 로그아웃하신 후, 사내 보안 포털을 통해 비밀번호를 변경해 주시기 바랍니다.</p>
                    <p className="text-base mb-6">아울러금 일1 8:0 0까지 본관 3층정 보보안 팀제 2조사 실로 방문 하시 어, 단 말기정 밀포렌식및 소명 절 차에 협 조 해 주 시 길 바 랍 니 다. 랍니다. 랍 니다. 랍 니 다.</p>

                    <div className="text-base text-slate-800 font-sans break-all select-none">
                        찾았다.찾았다.찾았어.찾았다.찾았어.찾았네.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았네.찾았다.찾았다.찾았어.찾았어.찾았다.찾았다.찾았다.찾았어?찾았다.찾았다.찾았다.찾았다.찾았어.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.찾았다.
                    </div>
                </div>
            )
        });
    }

    return messages;
};
