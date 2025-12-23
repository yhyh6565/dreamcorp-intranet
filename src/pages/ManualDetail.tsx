import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { getManualById, getGradeColor, getStatusLabel } from '@/data/manualData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Home, 
  ChevronRight, 
  ArrowLeft, 
  FileText, 
  DoorOpen, 
  Compass, 
  AlertCircle,
  Shield,
  Target,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ManualDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const manual = id ? getManualById(id) : undefined;

  if (!manual) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-xl font-bold text-foreground">매뉴얼을 찾을 수 없습니다</h1>
          <p className="text-muted-foreground">요청하신 문서가 존재하지 않거나 삭제되었습니다.</p>
          <Button onClick={() => navigate('/manual')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>
      </Layout>
    );
  }

  const statusInfo = getStatusLabel(manual.status);

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="h-4 w-4 cursor-pointer hover:text-foreground" onClick={() => navigate('/dashboard')} />
          <ChevronRight className="h-3 w-3" />
          <span className="cursor-pointer hover:text-foreground" onClick={() => navigate('/manual')}>어둠 관리 매뉴얼</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{manual.title}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {manual.title} 매뉴얼
            </h1>
            <p className="text-muted-foreground font-mono text-sm">{manual.id}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/manual')}
            className="w-full md:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
        </div>

        {/* Summary Card */}
        <Card className="border-border bg-background">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">식별 코드</p>
                <p className="font-mono font-medium text-foreground">{manual.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">등급</p>
                <span className={cn(
                  "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                  getGradeColor(manual.grade)
                )}>
                  {manual.grade}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">관리 상태</p>
                <span className={cn(
                  "inline-flex px-2 py-1 text-xs rounded-md border",
                  statusInfo.className
                )}>
                  {statusInfo.label}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  담당 부서
                </p>
                <p className="font-medium text-foreground">{manual.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="space-y-4">
          {/* Section 1: Overview */}
          <Card className="border-border bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                개요 (Overview)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {manual.overview}
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Entry Protocol */}
          <Card className="border-border bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DoorOpen className="h-5 w-5 text-primary" />
                진입 방법 (Entry Protocol)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="entry" className="border-none">
                  <AccordionTrigger className="text-sm text-yellow-500 hover:text-yellow-400 py-2">
                    ⚠ 오염 방지를 위해 접힘 처리됨 - 클릭하여 열람
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-secondary/50 rounded-lg mt-2">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {manual.entryMethod}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Section 3: Exploration Guide */}
          <Card className="border-border bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Compass className="h-5 w-5 text-primary" />
                탐사 가이드 (Exploration Guide)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Survival Rules */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Shield className="h-4 w-4 text-red-500" />
                  생존 수칙
                </h4>
                <ul className="space-y-2">
                  {manual.explorationGuide.survivalRules.map((rule, index) => (
                    <li 
                      key={index} 
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Clear Condition */}
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Target className="h-4 w-4 text-green-500" />
                  클리어 조건
                </h4>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-muted-foreground leading-relaxed">
                    {manual.explorationGuide.clearCondition}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Special Notes (Optional) */}
          {manual.specialNotes && (
            <Card className="border-border bg-background">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  특이사항 (Special Notes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {manual.specialNotes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/manual')}
            className="w-full md:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default ManualDetail;
