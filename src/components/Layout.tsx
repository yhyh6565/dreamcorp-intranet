import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import {
  Building2,
  Home,
  Mail,
  Bell,
  Calendar,
  MapPin,
  LogOut,
  Gift,
  LayoutDashboard,
  User,
  Menu,
  ChevronLeft,
  ChevronRight,
  Cat,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AnnexVisitModal from '@/components/modals/AnnexVisitModal';
import FoxCounselingModal from '@/components/modals/FoxCounselingModal';
import StorageRentalModal from '@/components/modals/StorageRentalModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, team, rank, points, logout, isNavigationDisabled } = useUserStore();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Modal states for Quick Links
  const [showAnnexVisit, setShowAnnexVisit] = useState(false);
  const [showFoxCounseling, setShowFoxCounseling] = useState(false);
  const [showStorageRental, setShowStorageRental] = useState(false);

  const isSoleum = userName === '김솔음';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: '대시보드', path: '/dashboard' },
    { icon: Bell, label: '공지사항', path: '/notices' },
    { icon: Mail, label: '쪽지함', path: '/messages' },
    { icon: Calendar, label: '일정 관리', path: '/calendar' },
    { icon: MapPin, label: '시설 안내', path: '/floor-map' },
    { icon: Gift, label: '복지몰', path: '/welfare-mall' },
  ];

  const quickLinks = [
    {
      icon: Building2,
      label: '별관 방문',
      action: () => setShowAnnexVisit(true),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Cat,
      label: '여우상담실',
      action: () => setShowFoxCounseling(true),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Archive,
      label: '대여창고',
      action: () => setShowStorageRental(true),
      color: 'text-slate-600',
      bgColor: 'bg-slate-100'
    }
  ];

  const extraSidebarClasses = isNavigationDisabled ? "pointer-events-none grayscale opacity-20" : "";

  return (
    <div className="flex h-screen bg-secondary/30 overflow-hidden font-sans">
      {/* Left Navigation Bar (LNB) */}
      <aside
        className={cn(
          "flex-shrink-0 bg-background border-r border-border flex flex-col z-50 transition-all duration-300 ease-in-out relative",
          isCollapsed ? "w-[70px]" : "w-[240px]",
          extraSidebarClasses
        )}
      >
        <div className={cn("h-16 flex items-center px-4 border-b border-border", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <span className="text-lg font-bold text-primary-foreground leading-none pb-0.5">백</span>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight whitespace-nowrap">(주)백일몽</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <span className="text-lg font-bold text-primary-foreground leading-none pb-0.5">백</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6 absolute -right-3 top-6 bg-background border border-border rounded-full shadow-sm z-50 hover:bg-slate-100")}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <TooltipProvider delayDuration={0}>
            <div className="space-y-1 px-2">
              {menuItems.map((item) => (
                isCollapsed ? (
                  <Tooltip key={item.path} side="right">
                    <TooltipTrigger asChild>
                      <Button
                        variant={'ghost'}
                        className={cn(
                          "w-full justify-center h-10 transition-all duration-200",
                          location.pathname.startsWith(item.path)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium bg-slate-900 text-white border-slate-800 ml-2">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    key={item.path}
                    variant={'ghost'}
                    className={cn(
                      "w-full justify-start gap-3 h-10 text-sm font-medium transition-all duration-200 px-3",
                      location.pathname.startsWith(item.path)
                        ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className={cn("h-4 w-4", location.pathname.startsWith(item.path) ? "text-primary" : "text-muted-foreground")} />
                    {item.label}
                  </Button>
                )
              ))}
            </div>
          </TooltipProvider>

          {/* Quick Links Section */}
          {!isCollapsed && quickLinks.length > 0 && (
            <div className="mt-6 px-4 animate-fade-in">
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">Quick Links</p>
              <div className="space-y-1">
                {quickLinks.map((link, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-9 text-sm text-slate-600 hover:text-slate-900 px-3"
                    onClick={link.action}
                  >
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0", link.bgColor)}>
                      <link.icon className={cn("h-3 w-3", link.color)} />
                    </div>
                    {link.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {isCollapsed && quickLinks.length > 0 && (
            <>
              <Separator className="my-4 mx-2 w-auto bg-slate-200" />
              <div className="space-y-1 px-2">
                <TooltipProvider delayDuration={0}>
                  {quickLinks.map((link, idx) => (
                    <Tooltip key={idx} side="right">
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-center h-10"
                          onClick={link.action}
                        >
                          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", link.bgColor)}>
                            <link.icon className={cn("h-3.5 w-3.5", link.color)} />
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium bg-slate-900 text-white border-slate-800 ml-2">
                        {link.label}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>
            </>
          )}

        </ScrollArea>

        {/* User Profile Section in LNB */}
        <div className={cn(
          "border-t border-border bg-background/50 backdrop-blur-sm transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border border-border shrink-0">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{userName} {rank}</p>
                  <p className="text-xs text-muted-foreground truncate">{team}</p>
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">보유 포인트</span>
                  <span className="font-bold text-primary">{points.toLocaleString()} P</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-colors h-9 text-xs"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                로그아웃
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <TooltipProvider delayDuration={0}>
                <Tooltip side="right">
                  <TooltipTrigger asChild>
                    <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border border-border cursor-default hover:bg-slate-200 transition-colors">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="ml-2 mb-2 p-3 min-w-[150px]">
                    <p className="font-bold">{userName} {rank}</p>
                    <p className="text-xs text-muted-foreground mb-2">{team}</p>
                    <div className="flex justify-between text-xs border-t border-slate-700 pt-2 mt-1">
                      <span>Points</span>
                      <span className="text-primary font-bold">{points.toLocaleString()}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Scrollable Content (Header removed as per request) */}
        <ScrollArea className="flex-1 bg-secondary/30">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-fade-in">
            {children}
          </div>
        </ScrollArea>
      </main>

      {/* Re-integrated Modals to be accessible anywhere in Layout */}
      <AnnexVisitModal open={showAnnexVisit} onClose={() => setShowAnnexVisit(false)} />
      <FoxCounselingModal open={showFoxCounseling} onClose={() => setShowFoxCounseling(false)} />
      <StorageRentalModal open={showStorageRental} onClose={() => setShowStorageRental(false)} />
    </div>
  );
};

export default Layout;
