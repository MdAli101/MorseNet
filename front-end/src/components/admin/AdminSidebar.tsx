import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  Settings, 
  LogOut,
  Shield,
  BarChart3,
  Users,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { toast } = useToast();

  const menuItems = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      title: 'Reports',
      url: '/admin/reports',
      icon: FileText,
      description: 'Manage Issues'
    },
    {
      title: 'Map View',
      url: '/admin/map',
      icon: Map,
      description: 'Geographic Overview'
    },
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: Settings,
      description: 'System Configuration'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/admin/login');
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className={`p-4 border-b border-sidebar-border ${collapsed ? 'px-2' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-civic-blue rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-sidebar-foreground">Admin Portal</h2>
                <p className="text-xs text-sidebar-foreground/70">Municipal System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="h-12"
                  >
                    <Button
                      variant="ghost"
                      onClick={() => navigate(item.url)}
                      className={`w-full justify-start ${
                        isActive(item.url) 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {!collapsed && (
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-sidebar-foreground/60">{item.description}</div>
                        </div>
                      )}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-2">
                <div className="bg-sidebar-accent/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-civic-orange" />
                    <div>
                      <div className="text-sm font-medium">Pending</div>
                      <div className="text-xs text-sidebar-foreground/60">2 issues</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-sidebar-accent/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-civic-blue" />
                    <div>
                      <div className="text-sm font-medium">This Week</div>
                      <div className="text-xs text-sidebar-foreground/60">5 resolved</div>
                    </div>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Logout */}
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {!collapsed && 'Sign Out'}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;