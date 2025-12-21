import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import Layout from '@/components/Layout';
import FacilityStatusCard from '@/components/dashboard/FacilityStatusCard';
import DailyScheduleCard from '@/components/dashboard/DailyScheduleCard';
import NoticeWidget from '@/components/dashboard/NoticeWidget';
import MessageWidget from '@/components/dashboard/MessageWidget';

import QuickLinksWidget from '@/components/dashboard/QuickLinksWidget';

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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[calc(100vh-140px)]">
        {/* Adjusted height to fit viewport better if needed, or remove h-full */}

        {/* Left Column Group (Facility, Schedule, Links, Notices) */}
        <div className="md:col-span-8 lg:col-span-9 h-auto md:h-full flex flex-col gap-6">

          {/* Row 1: Top Widgets (Fixed Height or based on content) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-9 gap-6">
            <div className="md:col-span-2 xl:col-span-4">
              <FacilityStatusCard />
            </div>
            <div className="md:col-span-1 xl:col-span-3">
              <DailyScheduleCard />
            </div>
            <div className="md:col-span-1 xl:col-span-2">
              <QuickLinksWidget />
            </div>
          </div>

          {/* Row 2: Notices (Fills remaining space) */}
          <div className="flex-1 min-h-[300px] md:min-h-0">
            <NoticeWidget />
          </div>
        </div>

        {/* Right Column: Messages Only */}
        <div className="md:col-span-4 lg:col-span-3 h-auto md:h-full">
          <MessageWidget />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
