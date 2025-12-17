import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, getRelativeDate } from '@/utils/dateUtils';
import JumpscareOverlay from '@/components/JumpscareOverlay';
import { useUserStore } from '@/store/userStore';

const NoticeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { jumpscareViewed, setJumpscareViewed } = useUserStore();
  const [showJumpscare, setShowJumpscare] = useState(false);

  // 트랩 게시글 (분실물)일 경우 5초 후 점프스케어 - 세션당 1회만
  useEffect(() => {
    if (id === '3' && !jumpscareViewed) {
      const timer = setTimeout(() => {
        setShowJumpscare(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [id, jumpscareViewed]);

  const handleJumpscareComplete = () => {
    setShowJumpscare(false);
    setJumpscareViewed();
    navigate('/notices');
  };

  const notices = {
    '1': {
      tag: '경영',
      title: '[경영] 사내 보안 시스템 점검 안내',
      author: '경영지원본부 보안팀',
      date: formatDate(getRelativeDate(-7)),
      content: `임직원 여러분, 안녕하십니까.

안전하고 쾌적한 근무 환경 조성을 위해 아래와 같이 사내 보안 시스템 정기 점검을 실시합니다.
점검 시간 동안 일부 인트라넷 서비스 이용이 제한될 수 있으니, 업무에 참고하시기 바랍니다.

■ 점검 일시
${formatDate(getRelativeDate(3))} 02:00 ~ 04:00 (2시간)

■ 점검 대상
- 사내 인트라넷 접속 게이트웨이
- 그룹웨어 메신저 및 전자결재 시스템
- 각 층 비상 구역(Emergency Zone) 차폐막 구동 서버

■ 주요 업데이트 내용
- 생체 인식 알고리즘 고도화: 출입 시 판별 속도 0.5초 단축
- 오염 방지 방화벽 패치: 텍스트 기반 인지재해(Cognito-hazard) 필터링 강화
- CCTV 사각지대 보정: 본관 엘리베이터 및 비상계단 감시 모드 추가

■ 임직원 협조 및 유의사항 (필독)
1. 점검 시간 중 사내에 잔류하는 임직원은 반드시 자신의 자리를 지켜주십시오. 복도를 배회할 경우 센서 오작동으로 인해 '침입자'로 분류되어 소각 시스템이 가동될 수 있습니다.

2. 인트라넷 접속 시 평소와 다른 팝업창(예: 붉은색 대화상자, 웃고 있는 얼굴 등)이 뜰 경우, 절대 클릭하지 말고 즉시 모니터 전원을 끄고 보안팀(내선 666)으로 신고 바랍니다.

3. 업데이트 완료 후, 사원증 태그 시 '삐-' 소리가 3번 이상 울리면 즉시 뒤를 돌아보지 말고 가장 가까운 화장실로 대피하십시오.

안전은 타협할 수 없는 백일몽의 핵심 가치입니다.
임직원 여러분의 적극적인 협조 부탁드립니다.

감사합니다.

(주)백일몽 경영지원본부장 (직인 생략)`
    },
    '2': {
      tag: '안내',
      title: '[안내] 하반기 독감 예방접종 지원 안내',
      author: '인사팀 / 보건관리실',
      date: formatDate(getRelativeDate(-14)),
      content: `임직원 여러분, 안녕하십니까.

환절기 임직원 여러분의 건강 관리를 위하여 하반기 독감(인플루엔자) 예방접종을 지원합니다.
올겨울 건강한 회사 생활을 위해 임직원분들의 많은 참여 바랍니다.

■ 접종 대상
- 백일몽 주식회사 전 임직원 (정규직, 계약직 포함)
- 임직원 직계 가족 (최대 2인까지 할인 혜택 적용)

■ 접종 기간
${formatDate(getRelativeDate(7))} ~ ${formatDate(getRelativeDate(30))}

■ 접종 장소
- 사내: 본관 3층 부속 의무실 (매주 화, 목 14:00~17:00)
- 사외: 회사 제휴 병원 5곳 (지정 병원 리스트 첨부 파일 참조)

■ 비용 지원
- 본인: 전액 회사 지원 (무료)
- 가족: 접종 비용의 50% 지원 (영수증 제출 시 급여 계좌로 환급)

■ 신청 방법
- 인트라넷 [자원예약] > [의무실 예약] 메뉴에서 원하는 날짜/시간 선택
- 사외 접종 희망 시 별도 신청 없이 사원증 지참 후 제휴 병원 방문

■ 유의사항
- 접종 당일은 격렬한 운동이나 음주를 삼가시기 바랍니다.
- 발열 등 컨디션이 좋지 않은 경우 접종을 연기해주십시오.
- 과거 백신 부작용 경험이 있는 분은 반드시 의사와 상담 후 접종 바랍니다.

건강이 최우선입니다. 미리 예방하시고 건강한 겨울 보내시길 바랍니다.

감사합니다.`
    },
    '3': {
      tag: '필독',
      title: '[필독] 3층 휴게실 분실물 습득 안내',
      author: '총무팀',
      date: formatDate(getRelativeDate(-3)),
      content: `임직원 여러분, 안녕하십니까. 총무팀입니다.

금일 오전, 본관 3층 직원 휴게실 환경 미화 작업 중 습득된 분실물을 안내드립니다.
주인을 찾기 위해 내부를 확인하였으나 인적 사항을 확인할 수 없어 공지합니다.
분실하신 분께서는 아래 내용을 확인하시고 총무팀 리셉션 데스크로 방문하여 수령하시기 바랍니다.

■ 습득 일시 및 장소
- 일시: ${formatDate(getRelativeDate(-3))} 09:30경
- 장소: 본관 3층 임직원 라운지 (C 구역 안쪽 1인용 소파 틈새)

■ 분실물 상세
- 품목: 포켓 사이즈 가죽 수첩 (다이어리)
- 색상: 짙은 붉은색 (버건디)
- 특징:
  • 표지가 많이 낡아 있으며 별도의 이름표나 부서명이 부착되어 있지 않음.
  • 내용 확인 결과, 업무 관련 내용은 없으며 알아볼 수 없는 낙서와 반복된 기호만 가득 적혀 있어 주인 식별이 불가능함.

■ 수령 및 보관 안내
- 보관 장소: 본관 1층 총무팀 분실물 센터
- 보관 기간: 공지일로부터 7일간 (기간 경과 시 사내 규정에 따라 폐기 처분 예정)

본인의 물건이 맞는지 사진을 확인하시기 바랍니다.

감사합니다.

[첨부파일] 
☒ 습득물_현장사진_01.jpg (이미지를 불러올 수 없습니다)
☒ 습득물_현장사진_02.jpg (이미지를 불러올 수 없습니다)`
    }
  };

  const notice = notices[id as keyof typeof notices];

  if (!notice) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">존재하지 않는 공지사항입니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/notices')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          공지사항 목록
        </Button>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={id === '3' ? 'destructive' : 'secondary'}>
                {notice.tag}
              </Badge>
            </div>
            <CardTitle className="text-xl">{notice.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <span>작성자: {notice.author}</span>
              <span>작성일: {notice.date}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
              {notice.content}
            </pre>
          </CardContent>
        </Card>
      </div>

      {showJumpscare && (
        <JumpscareOverlay onComplete={handleJumpscareComplete} />
      )}
    </div>
  );
};

export default NoticeDetail;
