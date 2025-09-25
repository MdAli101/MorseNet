import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, Navigation, Filter } from 'lucide-react';
import { mockReports, categoryIcons, statusLabels } from '@/data/mockData';

const AdminMap = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Map className="h-8 w-8 text-civic-blue" />
          <div>
            <h1 className="text-3xl font-bold">Geographic Overview</h1>
            <p className="text-muted-foreground">View all issues on the map</p>
          </div>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="h-96 bg-gradient-to-br from-civic-blue/20 to-civic-green/20 relative overflow-hidden rounded-lg">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Interactive Map</h3>
                  <p className="text-muted-foreground">All civic issues plotted geographically</p>
                </div>
              </div>
              
              {/* Map Pins */}
              {mockReports.slice(0, 6).map((report, index) => (
                <Button
                  key={report.id}
                  size="sm"
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                    report.status === 'resolved' ? 'bg-civic-green' :
                    report.status === 'in-progress' ? 'bg-civic-blue' :
                    'bg-civic-orange'
                  }`}
                  style={{
                    left: `${20 + (index * 12)}%`,
                    top: `${30 + (index * 8)}%`
                  }}
                >
                  {categoryIcons[report.category]}
                </Button>
              ))}

              {/* Map Controls */}
              <div className="absolute top-4 right-4">
                <Button size="icon" variant="outline" className="bg-white/90">
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend & Stats */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Map Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-civic-orange rounded-full"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <Badge variant="outline">{mockReports.filter(r => r.status === 'pending').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-civic-blue rounded-full"></div>
                    <span className="text-sm">In Progress</span>
                  </div>
                  <Badge variant="outline">{mockReports.filter(r => r.status === 'in-progress').length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-civic-green rounded-full"></div>
                    <span className="text-sm">Resolved</span>
                  </div>
                  <Badge variant="outline">{mockReports.filter(r => r.status === 'resolved').length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Heat Map Areas</h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <strong>High Activity:</strong> Central District
                </div>
                <div className="text-sm">
                  <strong>Medium Activity:</strong> Residential Areas
                </div>
                <div className="text-sm">
                  <strong>Low Activity:</strong> Industrial Zone
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminMap;