import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Bell, 
  Search, 
  User, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockReports } from '@/data/mockData';

const AdminHeader = () => {
  const [notifications] = useState(
    mockReports.filter(report => report.status === 'pending').slice(0, 3)
  );

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">Municipal Dashboard</h1>
          <p className="text-sm text-muted-foreground">Civic Issue Management System</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-civic-red">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <h4 className="font-semibold">Recent Notifications</h4>
            </div>
            {notifications.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground">
                No new notifications
              </div>
            ) : (
              notifications.map((report) => (
                <DropdownMenuItem key={report.id} className="p-3">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-4 w-4 text-civic-orange mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{report.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {report.location.address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <div className="flex flex-col">
                <span className="font-medium">Administrator</span>
                <span className="text-xs text-muted-foreground">admin@municipal.gov</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Indicators */}
        <div className="hidden lg:flex items-center space-x-3 ml-4 pl-4 border-l">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-status-pending" />
            <span className="text-sm">
              {mockReports.filter(r => r.status === 'pending').length} Pending
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-status-in-progress" />
            <span className="text-sm">
              {mockReports.filter(r => r.status === 'in-progress').length} Active
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-status-resolved" />
            <span className="text-sm">
              {mockReports.filter(r => r.status === 'resolved').length} Resolved
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;