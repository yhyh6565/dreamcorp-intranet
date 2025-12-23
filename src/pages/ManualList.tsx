import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { manualData, getGradeColor, getStatusLabel, DarknessGrade, DarknessStatus } from '@/data/manualData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, AlertTriangle, BookOpen, ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const ManualList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Security Modal State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [pendingManualId, setPendingManualId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return manualData.filter(item => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGrade = gradeFilter === 'all' || item.grade === gradeFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesGrade && matchesStatus;
    });
  }, [searchQuery, gradeFilter, statusFilter]);

  const handleRowClick = (id: string, isRestricted: boolean) => {
    if (isRestricted) {
      setPendingManualId(id);
      setIsAgreed(false);
      setIsSecurityModalOpen(true);
    } else {
      navigate(`/manual/${id}`);
    }
  };

  const handleSecurityConfirm = () => {
    if (pendingManualId && isAgreed) {
      setIsSecurityModalOpen(false);
      navigate(`/manual/${pendingManualId}`);
    }
  };

  const grades: DarknessGrade[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
  const statuses: { value: DarknessStatus; label: string }[] = [
    { value: 'Active', label: '활성' },
    { value: 'Isolated', label: '격리' },
    { value: 'Disposed', label: '폐기' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">어둠 관리 매뉴얼</span>
        </div>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">어둠 관리 매뉴얼</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            백일몽 주식회사 공식 탐사 가이드라인입니다.
          </p>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="식별 코드 또는 어둠 명칭 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-full md:w-[140px] bg-background">
              <SelectValue placeholder="등급 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 등급</SelectItem>
              {grades.map(grade => (
                <SelectItem key={grade} value={grade}>{grade}등급</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[140px] bg-background">
              <SelectValue placeholder="관리 상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableHead className="w-[60px] text-center">No</TableHead>
                <TableHead className="w-[150px]">식별 코드</TableHead>
                <TableHead className="w-[80px] text-center">등급</TableHead>
                <TableHead>어둠 명칭</TableHead>
                <TableHead className="w-[100px] text-center hidden md:table-cell">관리 상태</TableHead>
                <TableHead className="w-[120px] hidden md:table-cell">담당 부서</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => {
                  const statusInfo = getStatusLabel(item.status);
                  return (
                    <TableRow
                      key={item.id}
                      className={cn(
                        "cursor-pointer transition-colors",
                        item.isRestricted 
                          ? "hover:bg-red-500/5 border-l-2 border-l-red-500" 
                          : "hover:bg-secondary/50"
                      )}
                      onClick={() => handleRowClick(item.id, item.isRestricted)}
                    >
                      <TableCell className="text-center font-mono text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.id}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                          getGradeColor(item.grade)
                        )}>
                          {item.grade}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.title}
                          {item.isRestricted && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <span className={cn(
                          "inline-flex px-2 py-1 text-xs rounded-md border",
                          statusInfo.className
                        )}>
                          {statusInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {item.department}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground text-right">
          총 {filteredData.length}건
        </div>
      </div>

      {/* Security Warning Modal for S/A Grade */}
      <Dialog open={isSecurityModalOpen} onOpenChange={setIsSecurityModalOpen}>
        <DialogContent className="sm:max-w-md border-red-500/50 bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              보안 경고 (Security Alert)
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                  <p className="text-red-400 font-bold text-lg mb-2">※열람 주의!※</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    유의 : 이 문서를 읽음으로써 발생하는 공포, 환청, ■■, ■■■■ 등의 문제에 대하여 (주)백일몽은 일체의 배상책임이 없습니다.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  확인 이후 진행하십시오.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center space-x-3 py-4 px-2">
            <Checkbox
              id="agree"
              checked={isAgreed}
              onCheckedChange={(checked) => setIsAgreed(checked === true)}
              className="border-red-500/50 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
            />
            <label
              htmlFor="agree"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              위 유의사항을 확인하였으며, 열람에 동의합니다.
            </label>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSecurityModalOpen(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleSecurityConfirm}
              disabled={!isAgreed}
              className={cn(
                "transition-colors",
                isAgreed 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ManualList;
