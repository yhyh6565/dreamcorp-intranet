import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import Layout from '@/components/Layout';
import FacilityStatusCard from '@/components/dashboard/FacilityStatusCard';
import DailyScheduleCard from '@/components/dashboard/DailyScheduleCard';
import NoticeWidget from '@/components/dashboard/NoticeWidget';
import MessageWidget from '@/components/dashboard/MessageWidget';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userName, isLoggedIn } = useUserStore();
  const isSoleum = userName === '김솔음';

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Row 1: Key Metrics (Facility & Schedule) */}
        <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FacilityStatusCard isSoleum={isSoleum} />
          <DailyScheduleCard />
          <NoticeWidget />
        </div>

        {/* Right Column: Messages Only (Expanded) */}
        <div className="md:col-span-4 lg:col-span-3 space-y-6">
          <MessageWidget />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
