import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginGateway from "./pages/LoginGateway";
import Dashboard from "./pages/Dashboard";
import WelfareMall from "./pages/WelfareMall";
import FloorMap from "./pages/FloorMap";
import CalendarPage from "./pages/CalendarPage";
import NoticeList from "./pages/NoticeList";
import NoticeDetail from "./pages/NoticeDetail";
import MessageList from "./pages/MessageList";
import MessageDetail from "./pages/MessageDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginGateway />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/welfare-mall" element={<WelfareMall />} />
          <Route path="/floor-map" element={<FloorMap />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notices" element={<NoticeList />} />
          <Route path="/notices/:id" element={<NoticeDetail />} />
          <Route path="/messages" element={<MessageList />} />
          <Route path="/messages/:id" element={<MessageDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
