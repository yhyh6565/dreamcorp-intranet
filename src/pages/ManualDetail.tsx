import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { fetchManuals, getStatusLabel, DarknessManualItem } from '@/data/manualData';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/components/ui/use-toast';
import { SYSTEM_MESSAGES } from '@/constants/messages';
import {
  ArrowLeft,
  Printer,
  FileEdit,
  FileText,
  Loader2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// New Components
import { ManualHeader } from '@/components/manual/ManualHeader';
import { ManualMetaBox } from '@/components/manual/ManualMetaBox';
import { ManualTOC } from '@/components/manual/ManualTOC';
import { CalloutManualContent } from '@/components/manual/CalloutManualContent';
import { StandardManualContent } from '@/components/manual/StandardManualContent';

const ManualActionButtons = ({ onRevision, onPrint }: { onRevision: () => void, onPrint: () => void }) => (
  <>
    <Button variant="outline" size="sm" onClick={onRevision}>
      <FileEdit className="h-4 w-4 mr-2" />
      개정 신청
    </Button>
    <Button variant="outline" size="sm" onClick={onPrint}>
      <Printer className="h-4 w-4 mr-2" />
      인쇄하기
    </Button>
  </>
);

const ManualDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { checkSecurityClearance, isLoggedIn } = useUserStore();
  const { toast } = useToast();

  const [manual, setManual] = useState<DarknessManualItem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/', { state: { from: location }, replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchManuals();
        const found = data.find(item => item.id === id);
        setManual(found);
      } catch (e) {
        console.error("Failed to load manual", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handlePrint = () => {
    // Dummy button (Functionality removed by request)
  };

  const handleRequestRevision = () => {
    console.log('Revision requested');
  };

  const scrollToSection = (sectionId: string) => {
    const viewport = document.querySelector('#main-scroll-area [data-radix-scroll-area-viewport]') as HTMLElement;
    const element = document.getElementById(sectionId);

    if (viewport && element) {
      const offset = 24; // Small offset for visual breathing room
      const elementRect = element.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();

      const relativeTop = elementRect.top - viewportRect.top;
      const currentScroll = viewport.scrollTop;

      viewport.scrollTo({
        top: currentScroll + relativeTop - offset,
        behavior: 'smooth'
      });
    }
  };

  // Security Helper
  const isAccessAllowed = (level?: string) => {
    if (!level) return true;
    return checkSecurityClearance(level);
  };

  const handleLockedClick = (e: React.MouseEvent, requiredLevel: string) => {
    e.stopPropagation();
    toast({
      variant: "destructive",
      title: SYSTEM_MESSAGES.SECURITY_VERIFICATION.title,
      description: SYSTEM_MESSAGES.SECURITY_VERIFICATION.description(requiredLevel),
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-slate-500 font-mono">문서를 로딩중입니다...</p>
        </div>
      </Layout>
    );
  }

  if (!manual) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <FileText className="h-16 w-16 text-slate-300" />
          <h1 className="text-xl font-bold text-slate-900">문서를 찾을 수 없습니다</h1>
          <p className="text-slate-500">요청하신 문서 식별 코드가 존재하지 않습니다.</p>
          <Button onClick={() => navigate('/manual')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로
          </Button>
        </div>
      </Layout>
    );
  }

  const statusInfo = getStatusLabel(manual.status);

  // Custom Headers for Qterw-D-16
  const isQterw16 = manual.id === 'Qterw-D-16';
  const tocEntryTitle = isQterw16 ? "2. 정차역 유형별 분석" : "2. 진입 프로토콜";
  const tocGuideTitle = isQterw16 ? "3. 이레귤러 상황 및 안내방송 대응" : "3. 탐사 및 대응 가이드";

  const sectionTitles = {
    entry: isQterw16 ? "정차역 유형별 분석" : "진입 프로토콜",
    guide: isQterw16 ? "이레귤러 상황 및 안내방송 대응" : "탐사 및 대응 가이드",
    toggleEntry: isQterw16 ? "ANALYSIS BY STATION TYPE" : "CLASSIFIED ACCESS METHOD"
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 pb-20 print:p-0 print:max-w-none">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <Button
            variant="ghost"
            onClick={() => navigate('/manual')}
            className="w-fit pl-0 hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            목록으로 돌아가기
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <ManualActionButtons onRevision={handleRequestRevision} onPrint={handlePrint} />
          </div>
        </div>

        {/* 1. Manual Header */}
        <ManualHeader manual={manual} statusInfo={statusInfo} />

        {/* Split Info Section: Left (Meta) + Right (TOC) */}
        <div className="grid grid-cols-2 md:grid-cols-[1fr_240px] gap-3 md:gap-6">

          {/* Left: Meta Info */}
          <ManualMetaBox manual={manual} />

          {/* Right: Table of Contents */}
          <ManualTOC
            manual={manual}
            scrollToSection={scrollToSection}
            tocEntryTitle={tocEntryTitle}
            tocGuideTitle={tocGuideTitle}
          />
        </div>

        {/* Content Sections - Paper Style */}
        <div className="grid grid-cols-1 gap-12 relative">
          {/* Background Paper Effect for Content Area */}
          <div className="absolute inset-0 bg-slate-50 border border-slate-200 rounded-xl shadow-sm -z-10" />
          {/* Watermark Repetitive */}
          <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 -rotate-12 pointer-events-none select-none opacity-[0.02] z-0">
            <span className="text-8xl font-black uppercase text-slate-900 whitespace-nowrap">Project Darkness</span>
          </div>

          <div className="p-8 space-y-12">
            {manual.calloutOnlyMode ? (
              <CalloutManualContent manual={manual} />
            ) : (
              <StandardManualContent
                manual={manual}
                sectionTitles={sectionTitles}
                isAccessAllowed={isAccessAllowed}
                handleLockedClick={handleLockedClick}
              />
            )}
          </div>

        </div>

        {/* Footer */}
        <Separator className="my-8" />
        <div className="text-center text-slate-400 text-xs font-mono">
          CONFIDENTIAL DOCUMENT - DO NOT DISTRIBUTE
        </div>

        {/* Mobile Only: Bottom Action Buttons */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          <ManualActionButtons onRevision={handleRequestRevision} onPrint={handlePrint} />
        </div>
      </div>
    </Layout>
  );
};

export default ManualDetail;
