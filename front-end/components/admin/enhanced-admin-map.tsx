"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, ZoomIn, ZoomOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

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

interface EnhancedAdminMapProps {
  reports: Report[]
}

export default function EnhancedAdminMap({ reports }: EnhancedAdminMapProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })
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

  return (
    <div className="space-y-6">
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Municipal Control Center</h1>
        <ThemeToggle />
      </div>

      {/* Enhanced Street Map for Admin */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Municipal Street Map ({filteredReports.length} issues)
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                Live View
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(18, zoomLevel + 2))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(8, zoomLevel - 2))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg h-96 overflow-hidden border">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
              {/* Street Grid */}
              <defs>
                <pattern id="adminStreetGrid" x="0" y="0" width="20" height="15" patternUnits="userSpaceOnUse">
                  <rect width="20" height="15" fill="transparent" />
                  <path
                    d="M 20 0 L 0 0 0 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.3"
                    className="text-gray-300 dark:text-gray-600"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#adminStreetGrid)" />

              {/* Major Infrastructure */}
              <line
                x1="0"
                y1="150"
                x2="400"
                y2="150"
                stroke="currentColor"
                strokeWidth="4"
                className="text-blue-500 dark:text-blue-400"
              />
              <line
                x1="200"
                y1="0"
                x2="200"
                y2="300"
                stroke="currentColor"
                strokeWidth="4"
                className="text-blue-500 dark:text-blue-400"
              />

              {/* Secondary Roads */}
              <line
                x1="0"
                y1="75"
                x2="400"
                y2="75"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400 dark:text-gray-500"
              />
              <line
                x1="0"
                y1="225"
                x2="400"
                y2="225"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400 dark:text-gray-500"
              />
              <line
                x1="100"
                y1="0"
                x2="100"
                y2="300"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400 dark:text-gray-500"
              />
              <line
                x1="300"
                y1="0"
                x2="300"
                y2="300"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-400 dark:text-gray-500"
              />

              {/* District Zones */}
              <rect
                x="20"
                y="20"
                width="160"
                height="110"
                fill="currentColor"
                className="text-green-200 dark:text-green-800"
                opacity="0.2"
              />
              <rect
                x="220"
                y="20"
                width="160"
                height="110"
                fill="currentColor"
                className="text-blue-200 dark:text-blue-800"
                opacity="0.2"
              />
              <rect
                x="20"
                y="170"
                width="160"
                height="110"
                fill="currentColor"
                className="text-yellow-200 dark:text-yellow-800"
                opacity="0.2"
              />
              <rect
                x="220"
                y="170"
                width="160"
                height="110"
                fill="currentColor"
                className="text-purple-200 dark:text-purple-800"
                opacity="0.2"
              />

              {/* District Labels */}
              <text
                x="100"
                y="75"
                textAnchor="middle"
                className="text-sm font-medium fill-current text-gray-700 dark:text-gray-300"
              >
                Downtown
              </text>
              <text
                x="300"
                y="75"
                textAnchor="middle"
                className="text-sm font-medium fill-current text-gray-700 dark:text-gray-300"
              >
                Midtown
              </text>
              <text
                x="100"
                y="225"
                textAnchor="middle"
                className="text-sm font-medium fill-current text-gray-700 dark:text-gray-300"
              >
                Residential
              </text>
              <text
                x="300"
                y="225"
                textAnchor="middle"
                className="text-sm font-medium fill-current text-gray-700 dark:text-gray-300"
              >
                Industrial
              </text>

              {/* Street Names */}
              <text
                x="200"
                y="145"
                textAnchor="middle"
                className="text-xs fill-current text-gray-600 dark:text-gray-400"
              >
                Main Street
              </text>
              <text
                x="195"
                y="20"
                textAnchor="middle"
                className="text-xs fill-current text-gray-600 dark:text-gray-400"
                transform="rotate(-90 195 20)"
              >
                Broadway
              </text>
              <text
                x="200"
                y="70"
                textAnchor="middle"
                className="text-xs fill-current text-gray-500 dark:text-gray-500"
              >
                1st Avenue
              </text>
              <text
                x="200"
                y="220"
                textAnchor="middle"
                className="text-xs fill-current text-gray-500 dark:text-gray-500"
              >
                2nd Avenue
              </text>
            </svg>

            {/* Issue pins with enhanced positioning */}
            {filteredReports.slice(0, 15).map((report, index) => {
              const position = report.coordinates
                ? {
                    left: `${Math.max(5, Math.min(95, 50 + (report.coordinates.lng - mapCenter.lng) * 1000))}%`,
                    top: `${Math.max(5, Math.min(95, 50 - (report.coordinates.lat - mapCenter.lat) * 1000))}%`,
                  }
                : {
                    left: `${15 + (index % 5) * 18}%`,
                    top: `${15 + Math.floor(index / 5) * 20}%`,
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

                  {/* Enhanced admin tooltip */}
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    <div className="font-medium">{report.type}</div>
                    <div className="text-gray-300">{report.priority} Priority</div>
                    {report.coordinates && (
                      <div className="text-gray-400 text-xs">
                        GPS: {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}

            {/* Admin control overlay */}
            <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>Zoom: {zoomLevel}x</div>
                <div>
                  Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Live GPS Tracking</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="font-medium mb-2">Issue Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Resolved</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
