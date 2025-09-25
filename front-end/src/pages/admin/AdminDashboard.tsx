import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { mockReports } from '@/data/mockData';
import { categoryIcons, categoryLabels, statusLabels } from '@/data/mockData';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Calculate stats
  const totalReports = mockReports.length;
  const pendingReports = mockReports.filter(r => r.status === 'pending').length;
  const inProgressReports = mockReports.filter(r => r.status === 'in-progress').length;
  const resolvedReports = mockReports.filter(r => r.status === 'resolved').length;
  const rejectedReports = mockReports.filter(r => r.status === 'rejected').length;
  
  const resolutionRate = Math.round((resolvedReports / totalReports) * 100);
  const avgResponseTime = '2.4 hours'; // Mock data

  // Recent reports
  const recentReports = mockReports
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Category breakdown
  const categoryStats = Object.entries(categoryLabels).map(([key, label]) => ({
    category: key,
    name: label,
    icon: categoryIcons[key as keyof typeof categoryIcons],
    count: mockReports.filter(r => r.category === key).length,
    resolved: mockReports.filter(r => r.category === key && r.status === 'resolved').length
  }));

  const priorityStats = [
    { level: 'critical', count: mockReports.filter(r => r.priority === 'critical').length, color: 'text-civic-red' },
    { level: 'high', count: mockReports.filter(r => r.priority === 'high').length, color: 'text-civic-orange' },
    { level: 'medium', count: mockReports.filter(r => r.priority === 'medium').length, color: 'text-civic-blue' },
    { level: 'low', count: mockReports.filter(r => r.priority === 'low').length, color: 'text-civic-green' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-status-pending/10 text-status-pending border-status-pending/20';
      case 'in-progress': return 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20';
      case 'resolved': return 'bg-status-resolved/10 text-status-resolved border-status-resolved/20';
      case 'rejected': return 'bg-status-rejected/10 text-status-rejected border-status-rejected/20';
      default: return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Municipal Civic Issue Management System</p>
        </div>
        <div className="flex space-x-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-civic-blue/10 to-civic-blue/5 border-civic-blue/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-civic-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-civic-blue">{totalReports}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-civic-orange/10 to-civic-orange/5 border-civic-orange/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <Clock className="h-4 w-4 text-civic-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-civic-orange">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -5% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-civic-green/10 to-civic-green/5 border-civic-green/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-civic-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-civic-green">{resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -30min faster
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Issue Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-status-pending/10 border border-status-pending/20">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-status-pending" />
                      <span className="font-medium">Pending</span>
                    </div>
                    <span className="text-xl font-bold text-status-pending">{pendingReports}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-status-in-progress/10 border border-status-in-progress/20">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-status-in-progress" />
                      <span className="font-medium">In Progress</span>
                    </div>
                    <span className="text-xl font-bold text-status-in-progress">{inProgressReports}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-status-resolved/10 border border-status-resolved/20">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-status-resolved" />
                      <span className="font-medium">Resolved</span>
                    </div>
                    <span className="text-xl font-bold text-status-resolved">{resolvedReports}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-status-rejected/10 border border-status-rejected/20">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-status-rejected" />
                      <span className="font-medium">Rejected</span>
                    </div>
                    <span className="text-xl font-bold text-status-rejected">{rejectedReports}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Priority Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorityStats.map((priority) => (
                <div key={priority.level} className="flex items-center justify-between">
                  <span className={`capitalize font-medium ${priority.color}`}>
                    {priority.level}
                  </span>
                  <Badge variant="outline" className={priority.color}>
                    {priority.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="text-2xl">{categoryIcons[report.category]}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{report.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {report.location.address}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{statusLabels[report.status]}</span>
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Issue Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryStats.slice(0, 6).map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {category.resolved}/{category.count}
                    </span>
                    <Badge variant="outline">
                      {category.count}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col space-y-2 bg-civic-blue hover:bg-civic-blue/90">
              <MapPin className="h-5 w-5" />
              <span>View Map</span>
            </Button>
            <Button className="h-16 flex-col space-y-2 bg-civic-green hover:bg-civic-green/90">
              <CheckCircle className="h-5 w-5" />
              <span>Bulk Approve</span>
            </Button>
            <Button className="h-16 flex-col space-y-2 bg-civic-orange hover:bg-civic-orange/90">
              <AlertCircle className="h-5 w-5" />
              <span>Urgent Issues</span>
            </Button>
            <Button className="h-16 flex-col space-y-2 bg-civic-red hover:bg-civic-red/90">
              <Users className="h-5 w-5" />
              <span>Team Assign</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;