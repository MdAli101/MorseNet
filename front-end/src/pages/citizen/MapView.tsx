import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  MapPin,
  Navigation,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { mockReports } from '@/data/mockData';
import { categoryIcons, categoryLabels, statusLabels } from '@/data/mockData';
import type { ReportStatus, ReportCategory } from '@/types/report';

const MapView = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all');

  // Filter reports
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'in-progress':
        return <AlertCircle className="h-3 w-3" />;
      case 'resolved':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-status-pending/10 text-status-pending border-status-pending/20';
      case 'in-progress':
        return 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20';
      case 'resolved':
        return 'bg-status-resolved/10 text-status-resolved border-status-resolved/20';
      case 'rejected':
        return 'bg-status-rejected/10 text-status-rejected border-status-rejected/20';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('../')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Issues Map</h1>
              <p className="text-sm text-muted-foreground">View all civic issues in your area</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search location or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 space-y-3">
              <div className="flex space-x-2 overflow-x-auto">
                <Button
                  variant={statusFilter === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All Status
                </Button>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={statusFilter === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(key as ReportStatus)}
                    className="whitespace-nowrap"
                  >
                    {label}
                  </Button>
                ))}
              </div>
              
              <div className="flex space-x-2 overflow-x-auto">
                <Button
                  variant={categoryFilter === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter('all')}
                >
                  All Types
                </Button>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={categoryFilter === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(key as ReportCategory)}
                    className="whitespace-nowrap"
                  >
                    {categoryIcons[key as ReportCategory]} {label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Map Placeholder */}
        <div className="h-80 bg-gradient-to-br from-civic-blue/20 to-civic-green/20 relative overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 opacity-30">
            <svg
              viewBox="0 0 400 320"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid Pattern */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>
              
              {/* Roads */}
              <path d="M 0 160 L 400 160" stroke="currentColor" strokeWidth="3" opacity="0.2"/>
              <path d="M 200 0 L 200 320" stroke="currentColor" strokeWidth="3" opacity="0.2"/>
              <path d="M 100 80 L 300 240" stroke="currentColor" strokeWidth="2" opacity="0.15"/>
              <path d="M 100 240 L 300 80" stroke="currentColor" strokeWidth="2" opacity="0.15"/>
            </svg>
          </div>

          {/* Map Pins */}
          <div className="absolute inset-0">
            {filteredReports.slice(0, 8).map((report, index) => (
              <Button
                key={report.id}
                variant="ghost"
                size="sm"
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full ${
                  selectedReport?.id === report.id 
                    ? 'bg-civic-blue text-white' 
                    : 'bg-white text-foreground shadow-md hover:shadow-lg'
                }`}
                style={{
                  left: `${20 + (index * 7) + Math.sin(index) * 15}%`,
                  top: `${30 + (index * 5) + Math.cos(index) * 20}%`
                }}
                onClick={() => setSelectedReport(report)}
              >
                <div className="text-lg">{categoryIcons[report.category]}</div>
              </Button>
            ))}
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button size="icon" variant="outline" className="bg-white/90">
              <Navigation className="h-4 w-4" />
            </Button>
            <div className="bg-white/90 rounded-lg p-2 text-xs text-center">
              <div className="font-medium">{filteredReports.length}</div>
              <div className="text-muted-foreground">Issues</div>
            </div>
          </div>
        </div>

        {/* Selected Report Details */}
        {selectedReport && (
          <div className="bg-white border-t shadow-lg">
            <div className="p-4">
              <Card className="border-0">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{categoryIcons[selectedReport.category]}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-base">{selectedReport.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {categoryLabels[selectedReport.category]}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(selectedReport.status)} flex items-center space-x-1`}
                        >
                          {getStatusIcon(selectedReport.status)}
                          <span className="text-xs">{statusLabels[selectedReport.status]}</span>
                        </Badge>
                      </div>

                      {selectedReport.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {selectedReport.description}
                        </p>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {selectedReport.location.address}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          Reported on {formatDate(selectedReport.createdAt)}
                        </div>
                      </div>

                      {selectedReport.status === 'in-progress' && selectedReport.assignedTo && (
                        <div className="mt-3 p-2 bg-civic-blue/10 rounded-lg">
                          <p className="text-xs text-civic-blue">
                            <strong>Being handled by:</strong> {selectedReport.assignedTo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div className="bg-white">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold">Nearby Issues ({filteredReports.length})</h2>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className={`p-3 border-b cursor-pointer hover:bg-muted/30 ${
                  selectedReport?.id === report.id ? 'bg-civic-blue/5 border-l-4 border-l-civic-blue' : ''
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{categoryIcons[report.category]}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{report.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {report.location.address}
                    </p>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(report.status)}`}>
                    {statusLabels[report.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => navigate('../report')}
            size="lg"
            className="h-14 w-14 rounded-full bg-civic-red hover:bg-civic-red/90 shadow-lg"
          >
            <span className="text-2xl">+</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapView;