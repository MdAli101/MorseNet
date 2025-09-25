import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, Bell, Shield } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-civic-blue" />
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start">Add New Admin</Button>
            <Button className="w-full justify-start" variant="outline">Manage Permissions</Button>
            <Button className="w-full justify-start" variant="outline">View Activity Logs</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start">Email Settings</Button>
            <Button className="w-full justify-start" variant="outline">SMS Configuration</Button>
            <Button className="w-full justify-start" variant="outline">Alert Preferences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start">Change Password</Button>
            <Button className="w-full justify-start" variant="outline">Two-Factor Auth</Button>
            <Button className="w-full justify-start" variant="outline">Session Management</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;