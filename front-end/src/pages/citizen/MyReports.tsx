import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { mockReports } from '@/data/mockData';
import { categoryIcons, categoryLabels, statusLabels } from '@/data/mockData';
import type { ReportStatus } from '@/types/report';

const MyReports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');

  // Filter reports based on search and status
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
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
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const statusCounts = {
    all: mockReports.length,
    pending: mockReports.filter(r => r.status === 'pending').length,
    'in-progress': mockReports.filter(r => r.status === 'in-progress').length,
    resolved: mockReports.filter(r => r.status === 'resolved').length,
    rejected: mockReports.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-civic-blue/5 to-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('../')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">My Reports</h1>
              <p className="text-sm text-muted-foreground">Track your submitted issues</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search your reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status as ReportStatus | 'all')}
                className="whitespace-nowrap"
              >
                {status === 'all' ? 'All' : statusLabels[status as ReportStatus]} ({count})
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-civic-blue/5 to-civic-blue/10 border-civic-blue/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-civic-blue">{mockReports.length}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-civic-green/5 to-civic-green/10 border-civic-green/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-civic-green">
                {statusCounts.resolved}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'You haven\'t submitted any reports yet.'
                }
              </p>
              <Button onClick={() => navigate('/report')}>
                Report New Issue
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <Card key={report.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                   <div className="flex items-start space-x-3">
                     {/* Report Image */}
                     {report.images && report.images.length > 0 && (
                       <div className="flex-shrink-0">
                         <img 
                           src={report.images[0]} 
                           alt={report.title}
                           className="w-20 h-20 object-cover rounded-lg border"
                         />
                       </div>
                     )}

                     {/* Category Icon */}
                     <div className="flex-shrink-0">
                       <div className="w-12 h-12 bg-civic-blue/10 rounded-full flex items-center justify-center">
                         <span className="text-2xl">{categoryIcons[report.category]}</span>
                       </div>
                     </div>

                     {/* Content */}
                     <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-base leading-tight mb-1">
                            {report.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {categoryLabels[report.category]}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`ml-2 ${getStatusColor(report.status)} flex items-center space-x-1`}
                        >
                          {getStatusIcon(report.status)}
                          <span className="text-xs">{statusLabels[report.status]}</span>
                        </Badge>
                      </div>

                      {/* Description */}
                      {report.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {report.description}
                        </p>
                      )}

                      {/* Location & Date */}
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{report.location.address}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                      </div>

                      {/* Progress Info */}
                      {report.status === 'in-progress' && report.assignedTo && (
                        <div className="mt-2 p-2 bg-civic-blue/10 rounded-lg border border-civic-blue/20">
                          <p className="text-xs text-civic-blue">
                            <strong>Assigned to:</strong> {report.assignedTo}
                          </p>
                          {report.estimatedResolution && (
                            <p className="text-xs text-civic-blue">
                              <strong>Expected completion:</strong> {formatDate(report.estimatedResolution)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Resolution Info */}
                      {report.status === 'resolved' && report.actualResolution && (
                        <div className="mt-2 p-2 bg-civic-green/10 rounded-lg border border-civic-green/20">
                          <p className="text-xs text-civic-green">
                            <strong>Resolved on:</strong> {formatDate(report.actualResolution)}
                          </p>
                        </div>
                      )}

                      {/* Notes */}
                      {report.notes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Latest Update:</p>
                          <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                            {report.notes[report.notes.length - 1]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => navigate('report')}
            size="lg"
            className="h-14 w-14 rounded-full bg-civic-green hover:bg-civic-green/90 shadow-lg"
          >
            <span className="text-2xl">+</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyReports;