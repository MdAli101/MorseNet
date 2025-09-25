import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Filter, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { mockReports, categoryIcons, categoryLabels, statusLabels } from '@/data/mockData';
import type { ReportStatus, ReportCategory } from '@/types/report';

const AdminReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-civic-blue" />
          <div>
            <h1 className="text-3xl font-bold">Issue Reports</h1>
            <p className="text-muted-foreground">Manage and track civic issues</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filter Tags - Close to Search */}
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground mr-2">Filters:</span>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | 'all')}>
                <SelectTrigger className="w-auto min-w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(key as ReportStatus)}
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ReportCategory | 'all')}>
                <SelectTrigger className="w-auto min-w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{categoryIcons[key as ReportCategory]}</span>
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-4 flex-1">
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
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{categoryIcons[report.category]}</span>
                    </div>
                  </div>
                  
                  {/* Report Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold truncate pr-2">{report.title}</h3>
                      <Badge variant="outline" className={`flex-shrink-0 ${
                        report.status === 'pending' ? 'bg-status-pending/10 text-status-pending border-status-pending/20' :
                        report.status === 'in-progress' ? 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20' :
                        report.status === 'resolved' ? 'bg-status-resolved/10 text-status-resolved border-status-resolved/20' :
                        'bg-status-rejected/10 text-status-rejected border-status-rejected/20'
                      }`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          <span className="text-xs font-medium">{statusLabels[report.status]}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
                    
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-1">📍</span>
                        <span className="truncate">{report.location.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-1">👤</span>
                        <span>{report.citizenName}</span>
                        <span className="mx-2">•</span>
                        <span className="mr-1">📞</span>
                        <span>{report.citizenPhone}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="mr-1">📅</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span className="mr-1">🕐</span>
                        <span>{new Date(report.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                      <Button size="sm" className="bg-civic-green hover:bg-civic-green/90 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Update Status
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;