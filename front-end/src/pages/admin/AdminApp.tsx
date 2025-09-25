import { useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminReports from './AdminReports';
import AdminMap from './AdminMap';
import AdminSettings from './AdminSettings';
import AdminHeader from '@/components/admin/AdminHeader';

const AdminApp = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/reports" element={<AdminReports />} />
              <Route path="/map" element={<AdminMap />} />
              <Route path="/settings" element={<AdminSettings />} />
              <Route path="/" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminApp;