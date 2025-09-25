import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  MapPin, 
  FileText, 
  Search,
  Phone,
  Settings,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { categoryIcons, categoryLabels, mockReports } from '@/data/mockData';
import type { ReportCategory } from '@/types/report';

const CitizenHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const quickServices = [
    {
      icon: Camera,
      title: 'Report Issue',
      subtitle: 'Take photo & report',
      color: 'bg-civic-red',
      action: () => navigate('report')
    },
    {
      icon: MapPin,
      title: 'View Map',
      subtitle: 'See all reports',
      color: 'bg-civic-blue',
      action: () => navigate('map')
    },
    {
      icon: FileText,
      title: 'My Reports',
      subtitle: 'Track your issues',
      color: 'bg-civic-green',
      action: () => navigate('my-reports')
    },
    {
      icon: Phone,
      title: 'Emergency',
      subtitle: 'Call 100/102/108',
      color: 'bg-civic-orange',
      action: () => {}
    }
  ];

  const categories = Object.entries(categoryLabels).map(([key, label]) => ({
    id: key as ReportCategory,
    name: label,
    icon: categoryIcons[key as ReportCategory],
    count: mockReports.filter(r => r.category === key).length
  }));

  const recentActivity = mockReports.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-civic-blue/5 to-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome Citizen!</h1>
              <p className="text-muted-foreground text-sm">Report civic issues in your area</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/login')}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search for services, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background/50 text-sm"
              />
            </div>
            
            {/* Quick Categories - Near Search */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 4).map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 flex items-center gap-2 text-xs hover:bg-civic-blue/5"
                  onClick={() => navigate('report', { state: { category: category.id } })}
                >
                  <span className="text-sm">{category.icon}</span>
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-xs h-4 px-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Services</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickServices.map((service, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm"
                onClick={service.action}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-full ${service.color} flex-shrink-0`}>
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{service.title}</h3>
                      <p className="text-xs text-muted-foreground">{service.subtitle}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3">All Issue Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm"
                onClick={() => navigate('report', { state: { category: category.id } })}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-12 h-12 bg-civic-blue/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{category.name}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {category.count} issues
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('my-reports')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((report) => (
              <Card key={report.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Report Image */}
                    {report.images && report.images.length > 0 && (
                      <div className="flex-shrink-0">
                        <img 
                          src={report.images[0]} 
                          alt={report.title}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    
                    {/* Category Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-civic-blue/10 rounded-full flex items-center justify-center">
                        <span className="text-xl">{categoryIcons[report.category]}</span>
                      </div>
                    </div>
                    
                    {/* Report Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium truncate pr-2">{report.title}</h4>
                        {report.status === 'pending' && (
                          <Badge variant="outline" className="text-xs bg-status-pending/10 text-status-pending border-status-pending/20 flex-shrink-0">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {report.status === 'in-progress' && (
                          <Badge variant="outline" className="text-xs bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20 flex-shrink-0">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            In Progress
                          </Badge>
                        )}
                        {report.status === 'resolved' && (
                          <Badge variant="outline" className="text-xs bg-status-resolved/10 text-status-resolved border-status-resolved/20 flex-shrink-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground truncate mt-1">{report.location.address}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>📅 {new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Notice */}
        <Card className="bg-civic-red/5 border-civic-red/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-civic-red mt-0.5" />
              <div>
                <h3 className="font-medium text-sm text-civic-red">Emergency Services</h3>
                <p className="text-xs text-civic-red/80">For urgent issues, call: Police (100), Medical (108), Fire (101)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CitizenHome;