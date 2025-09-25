"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MapPin, Filter, Clock, CheckCircle, AlertCircle, Search, Users } from "lucide-react"

interface Report {
  id: string
  type: string
  description: string
  location: string
  coordinates?: { lat: number; lng: number }
  status: "Pending" | "In Progress" | "Resolved"
  submittedAt: string
  priority: "Low" | "Medium" | "High"
}

interface AdminMapProps {
  reports: Report[]
}

export default function AdminMap({ reports }: AdminMapProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 }) // Default to NYC
  const [zoomLevel, setZoomLevel] = useState(12)

  const filteredReports = reports.filter((report) => {
    const statusMatch = statusFilter === "all" || report.status === statusFilter
    const typeMatch = typeFilter === "all" || report.type === typeFilter
    const priorityMatch = priorityFilter === "all" || report.priority === priorityFilter
    const searchMatch =
      searchQuery === "" ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase())

    return statusMatch && typeMatch && priorityMatch && searchMatch
  })

  const mapStats = {
    total: filteredReports.length,
    pending: filteredReports.filter((r) => r.status === "Pending").length,
    inProgress: filteredReports.filter((r) => r.status === "In Progress").length,
    resolved: filteredReports.filter((r) => r.status === "Resolved").length,
    highPriority: filteredReports.filter((r) => r.priority === "High").length,
  }

  const centerMapOnArea = (area: string) => {
    const areas = {
      downtown: { lat: 40.7128, lng: -74.006 },
      midtown: { lat: 40.7549, lng: -73.984 },
      uptown: { lat: 40.7831, lng: -73.9712 },
      brooklyn: { lat: 40.6782, lng: -73.9442 },
    }
    const coords = areas[area as keyof typeof areas]
    if (coords) {
      setMapCenter(coords)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "In Progress":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case "Resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "Low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const issueTypes = [...new Set(reports.map((r) => r.type))]

  return (
    <div className="space-y-6">
      {/* Map Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{mapStats.total}</div>
            <p className="text-xs text-gray-500">Total Issues</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{mapStats.pending}</div>
            <p className="text-xs text-gray-500">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{mapStats.inProgress}</div>
            <p className="text-xs text-gray-500">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{mapStats.resolved}</div>
            <p className="text-xs text-gray-500">Resolved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{mapStats.highPriority}</div>
            <p className="text-xs text-gray-500">High Priority</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {issueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={centerMapOnArea}>
              <SelectTrigger>
                <SelectValue placeholder="Jump to area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="midtown">Midtown</SelectItem>
                <SelectItem value="uptown">Uptown</SelectItem>
                <SelectItem value="brooklyn">Brooklyn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Map View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Municipal Issue Map ({filteredReports.length} issues)
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Live View
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(zoomLevel === 12 ? 15 : 12)}>
                {zoomLevel === 12 ? "Zoom In" : "Zoom Out"}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg h-96 flex items-center justify-center overflow-hidden">
            {/* Map center indicator */}
            <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg z-10">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
              </div>
              <div className="text-xs text-gray-500">Zoom: {zoomLevel}x</div>
            </div>

            {/* Map pins with enhanced positioning */}
            <div className="absolute inset-0 p-8">
              {filteredReports.slice(0, 12).map((report, index) => {
                const position = report.coordinates
                  ? {
                      left: `${Math.max(10, Math.min(90, 50 + (report.coordinates.lng - mapCenter.lng) * 1000))}%`,
                      top: `${Math.max(10, Math.min(90, 50 - (report.coordinates.lat - mapCenter.lat) * 1000))}%`,
                    }
                  : {
                      left: `${15 + (index % 4) * 20}%`,
                      top: `${20 + Math.floor(index / 4) * 20}%`,
                    }

                return (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group ${
                      selectedReport?.id === report.id ? "scale-125 z-10" : "hover:scale-110"
                    } transition-all duration-200`}
                    style={position}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                        report.status === "Resolved"
                          ? "bg-green-500"
                          : report.status === "In Progress"
                            ? "bg-blue-500"
                            : report.priority === "High"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    {report.priority === "High" && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                    )}

                    {/* Enhanced tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      <div className="font-medium">{report.type}</div>
                      <div className="text-gray-300">{report.priority} Priority</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="text-center text-gray-600 dark:text-gray-400 z-0">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-lg font-medium">Municipal Issue Map</p>
              <p className="text-sm">Click on pins to view and manage issues</p>
              <p className="text-xs mt-1">Red pins indicate high priority issues</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Report Details */}
      {selectedReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Issue Management</span>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(selectedReport.priority)}>{selectedReport.priority} Priority</Badge>
                <Badge className={getStatusColor(selectedReport.status)}>
                  {getStatusIcon(selectedReport.status)}
                  <span className="ml-1">{selectedReport.status}</span>
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white text-lg">{selectedReport.type}</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedReport.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{selectedReport.location}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Reported: {new Date(selectedReport.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant={selectedReport.status === "Pending" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  // Update status logic would go here
                  console.log("Update to Pending")
                }}
              >
                Mark Pending
              </Button>
              <Button
                variant={selectedReport.status === "In Progress" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  // Update status logic would go here
                  console.log("Update to In Progress")
                }}
              >
                In Progress
              </Button>
              <Button
                variant={selectedReport.status === "Resolved" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  // Update status logic would go here
                  console.log("Update to Resolved")
                }}
              >
                Mark Resolved
              </Button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">Report ID: #{selectedReport.id.slice(-6)}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
