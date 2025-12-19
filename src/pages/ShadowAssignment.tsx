import { useState } from 'react';
import { useShadowStore, ShadowEntity } from '@/store/shadowStore';
import { useUserStore } from '@/store/userStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import ShadowAssignmentModal from '@/components/modals/ShadowAssignmentModal';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import IdentityVerificationFailedModal from '@/components/modals/IdentityVerificationFailedModal';

const ShadowAssignment = () => {
    const { shadows, assignShadow } = useShadowStore();
    const { userName, team } = useUserStore();
    const { toast } = useToast();

    const [selectedShadow, setSelectedShadow] = useState<ShadowEntity | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFailModalOpen, setIsFailModalOpen] = useState(false);

    // Filter only unassigned shadows
    const unassignedShadows = shadows.filter(s => !s.isAssigned);

    const handleRegisterClick = (shadow: ShadowEntity) => {
        if (userName === '■■■') {
            setIsFailModalOpen(true);
            return;
        }
        setSelectedShadow(shadow);
        setIsModalOpen(true);
    };

    const handleConfirmAssignment = () => {
        if (selectedShadow && userName) {
            assignShadow(selectedShadow.code, userName, team);

            toast({
                title: "관리물 등록 완료",
                description: `${selectedShadow.name}의 담당자로 등록되었습니다.`,
                duration: 3000,
            });

            setSelectedShadow(null);
        }
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return 'bg-slate-200 text-slate-800';
            case 'B': return 'bg-blue-100 text-blue-800';
            case 'C': return 'bg-green-100 text-green-800';
            case 'D': return 'bg-yellow-100 text-yellow-800';
            case 'E': return 'bg-orange-100 text-orange-800';
            case 'F': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <ShieldAlert className="h-6 w-6 text-red-600" />
                            담당 어둠 배정
                        </h2>
                        <p className="text-slate-500 mt-1">
                            현재 <span className="font-bold text-red-600">{unassignedShadows.length}</span>건의 관리 부재 항목이 있습니다. 즉시 담당자를 배정하십시오.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[100px]">GRADE</TableHead>
                                <TableHead>CODE</TableHead>
                                <TableHead>LOCATION</TableHead>
                                <TableHead>NAME</TableHead>
                                <TableHead className="text-right">ACTION</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {unassignedShadows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle2 className="h-8 w-8 text-green-500/50" />
                                            <span>모든 관리물에 담당자가 배정되었습니다.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                unassignedShadows.map((shadow) => (
                                    <TableRow key={shadow.code} className="hover:bg-slate-50/50">
                                        <TableCell>
                                            <Badge variant="secondary" className={`${getGradeColor(shadow.grade)} font-bold border-none`}>
                                                {shadow.grade}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono font-medium text-slate-700">
                                            {shadow.code}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {shadow.locationText}
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-800">
                                            {shadow.name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="hover:bg-slate-900 hover:text-white transition-colors"
                                                onClick={() => handleRegisterClick(shadow)}
                                            >
                                                등록
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {selectedShadow && (
                    <ShadowAssignmentModal
                        open={isModalOpen}
                        onOpenChange={setIsModalOpen}
                        shadowName={selectedShadow.name}
                        shadowCode={selectedShadow.code}
                        onConfirm={handleConfirmAssignment}
                    />
                )}

                <IdentityVerificationFailedModal
                    open={isFailModalOpen}
                    onOpenChange={setIsFailModalOpen}
                />
            </div>
        </Layout>
    );
};

export default ShadowAssignment;
