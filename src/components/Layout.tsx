import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import {
  Mail,
  Bell,
  Calendar,
  MapPin,
  LogOut,
  Gift,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  FileSignature,
  Menu,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// --- Reusable Sidebar Content Component ---
const SidebarContent = ({
  isCollapsed,
  onNavigate,
  isMobile = false
}: {
  isCollapsed: boolean;
  onNavigate?: () => void;
  isMobile?: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, rank, team, employeeId, points, logout, securityMessageTriggered, isNavigationDisabled, isSecurityMessageRead } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate('/');
    if (onNavigate) onNavigate();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const menuItems = [
    { icon: Bell, label: '공지사항', path: '/notices' },
    { icon: Mail, label: '쪽지함', path: '/messages', badge: (securityMessageTriggered && !isSecurityMessageRead) ? '+1' : undefined },
    { icon: Calendar, label: '일정 관리', path: '/calendar' },
    { icon: MapPin, label: '시설 안내도', path: '/floor-map' },
    { icon: ShieldAlert, label: '담당 어둠 배정', path: '/shadow-assignment' },
    { icon: BookOpen, label: '어둠 관리 매뉴얼', path: '/manual' },
    { icon: Gift, label: '복지몰', path: '/welfare-mall' },
    { icon: FileSignature, label: '전자결재', path: '/approvals', disabled: true },
    { icon: User, label: 'HR 포털', path: '/hr-portal', disabled: true },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header Logo Area */}
      {(!isCollapsed || isMobile) && (
        <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
          <div
            className="flex items-center gap-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation('/dashboard')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
              <img src="/pic/logo_cloud.png" alt="Logo" className="w-[60%] h-[60%] object-contain brightness-0 invert" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight whitespace-nowrap">(주)백일몽</span>
          </div>
        </div>
      )}

      {/* Collapsed Logo (Desktop Only) */}
      {isCollapsed && !isMobile && (
        <div className="h-16 flex items-center justify-center border-b border-border shrink-0">
          <div
            className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation('/dashboard')}
          >
            <span className="text-lg font-bold text-primary-foreground leading-none pb-0.5">백</span>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <ScrollArea className="flex-1 py-4">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-1 px-2">
            {menuItems.map((item) => (
              (isCollapsed && !isMobile) ? (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={'ghost'}
                      disabled={item.disabled}
                      className={cn(
                        "w-full justify-center h-10 transition-all duration-200 relative",
                        item.disabled
                          ? "text-muted-foreground/40 cursor-not-allowed"
                          : location.pathname.startsWith(item.path)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                      onClick={() => !item.disabled && handleNavigation(item.path)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.badge && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium bg-slate-900 text-white border-slate-800 ml-2">
                    {item.label} {item.badge && `(${item.badge})`}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  key={item.path}
                  variant={'ghost'}
                  disabled={item.disabled}
                  className={cn(
                    "w-full justify-start gap-3 h-10 text-sm font-medium transition-all duration-200 px-3 relative",
                    item.disabled
                      ? "text-muted-foreground/40 cursor-not-allowed"
                      : location.pathname.startsWith(item.path)
                        ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  onClick={() => !item.disabled && handleNavigation(item.path)}
                >
                  <item.icon className={cn("h-4 w-4", item.disabled ? "text-muted-foreground/40" : location.pathname.startsWith(item.path) ? "text-primary" : "text-muted-foreground")} />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Button>
              )
            ))}
          </div>
        </TooltipProvider>
      </ScrollArea>

      {/* User Profile */}
      <div className={cn(
        "border-t border-border bg-background/50 backdrop-blur-sm transition-all duration-300",
        (isCollapsed && !isMobile) ? "p-2" : "p-4"
      )}>
        {(!isCollapsed || isMobile) ? (
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center border border-border cursor-default hover:bg-slate-200 transition-colors">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2 mb-2 p-3 min-w-[150px]">
                  <p className="font-bold">{userName} {rank}</p>
                  <p className="text-xs text-muted-foreground">{team}</p>

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
    </div>
  );
};


const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { securityMessageTriggered, isNavigationDisabled, securityTimerActive, triggerSecurityMessage, isSecurityToastShown, setSecurityToastShown } = useUserStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Security Timer Logic (30s delay)
  React.useEffect(() => {
    if (securityTimerActive) {
      const timer = setTimeout(() => {
        triggerSecurityMessage();
      }, 30000); // 30 seconds delay
      return () => clearTimeout(timer);
    }
  }, [securityTimerActive, triggerSecurityMessage]);

  // Toast Auto-hide Logic (5s display) + Show handling
  React.useEffect(() => {
    if (securityMessageTriggered && !isSecurityToastShown) {
      setShowToast(true);
      setSecurityToastShown(); // Mark as shown to prevent repeat on nav
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000); // 5 seconds display
      return () => clearTimeout(timer);
    }
  }, [securityMessageTriggered, isSecurityToastShown, setSecurityToastShown]);

  // Global Scroll Reset on Navigation
  React.useEffect(() => {
    // Locate the Radix ScrollArea Viewport and reset its scroll position
    const viewport = document.querySelector('#main-scroll-area [data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = 0;
    }
  }, [location.pathname]);

  const hideSidebar = false;
  const extraSidebarClasses = isNavigationDisabled ? "pointer-events-none grayscale opacity-50" : "";

  return (
    <div className="flex h-screen bg-secondary/30 overflow-hidden font-sans">

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-50 flex items-center justify-between px-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <img src="/pic/logo_cloud.png" alt="Logo" className="w-[60%] h-[60%] object-contain brightness-0 invert" />
          </div>
          <span className="text-base font-bold text-foreground tracking-tight">(주)백일몽</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent isCollapsed={false} isMobile={true} onNavigate={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation Bar (LNB) */}
      {
        !hideSidebar && (
          <aside
            className={cn(
              "hidden md:flex flex-shrink-0 bg-background border-r border-border flex-col z-50 transition-all duration-300 ease-in-out relative",
              isCollapsed ? "w-[70px]" : "w-[240px]",
              extraSidebarClasses
            )}
          >
            {/* Collapse Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-6 w-6 absolute -right-3 top-6 bg-background border border-border rounded-full shadow-sm z-50 hover:bg-slate-100")}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
            </Button>

            <SidebarContent isCollapsed={isCollapsed} />
          </aside>
        )
      }

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative pt-14 md:pt-0">
        <ScrollArea className="flex-1 bg-secondary/30" id="main-scroll-area">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full animate-fade-in">
            {children}
          </div>
        </ScrollArea>
      </main>

      {/* Security Message Toast */}
      {
        showToast && (location.pathname === '/dashboard') && (
          <div className="fixed bottom-8 right-8 z-[100] animate-slide-up-fade">
            <div
              className="bg-slate-900 text-white p-4 rounded-lg shadow-2xl border border-slate-700 flex items-center gap-4 cursor-pointer hover:bg-slate-800 transition-colors max-w-sm"
              onClick={() => navigate('/messages/security-breach')}
            >
              <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center shrink-0 animate-pulse">
                <Mail className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-sm text-red-400 mb-0.5">새로운 쪽지가 도착했습니다</p>
                <p className="text-xs text-slate-400">보낸이: 정보보안팀</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-500 animate-ping ml-2" />
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Layout;
