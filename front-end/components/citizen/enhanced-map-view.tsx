"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, CheckCircle, Navigation, Locate, ZoomIn, ZoomOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface Report {
  id: string
  type: string
  description: string
  location: string
  coordinates?: { lat: number; lng: number }
  status: "Pending" | "In Progress" | "Resolved"
  submittedAt: string
  photoName?: string
}

export default function EnhancedMapView() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(12)
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })

  useEffect(() => {
    const citizenReports = JSON.parse(localStorage.getItem("citizenReports") || "[]")
    const demoReports = [
      {
        id: "demo1",
        type: "Pothole",
        description: "Large pothole on Main Street causing traffic issues",
        location: "40.7128, -74.0060",
        coordinates: { lat: 40.7128, lng: -74.006 },
        status: "In Progress" as const,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        photoName: "pothole_main_st.jpg",
      },
      {
        id: "demo2",
        type: "Streetlight Issue",
        description: "Broken streetlight near Central Park entrance",
        location: "40.7829, -73.9654",
        coordinates: { lat: 40.7829, lng: -73.9654 },
        status: "Resolved" as const,
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        photoName: "streetlight_park.jpg",
      },
      {
        id: "demo3",
        type: "Trash/Garbage",
        description: "Overflowing trash bins on 5th Avenue",
        location: "40.7614, -73.9776",
        coordinates: { lat: 40.7614, lng: -73.9776 },
        status: "Pending" as const,
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        photoName: "trash_5th_ave.jpg",
      },
      {
        id: "demo4",
        type: "Water Leak",
        description: "Burst water pipe flooding the street",
        location: "40.7505, -73.9934",
        coordinates: { lat: 40.7505, lng: -73.9934 },
        status: "Pending" as const,
        submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        photoName: "water_leak_broadway.jpg",
      },
    ]

    const parsedCitizenReports = citizenReports.map((report: any) => {
      if (report.location && typeof report.location === "string") {
        const coords = report.location.split(",").map((coord: string) => Number.parseFloat(coord.trim()))
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          return { ...report, coordinates: { lat: coords[0], lng: coords[1] } }
        }
      }
      return report
    })

    setReports([...demoReports, ...parsedCitizenReports])
  }, [])

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setMapCenter({ lat: latitude, lng: longitude })
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      )
    } else {
      setIsLoadingLocation(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Theme Toggle Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Civic Issue Map</h1>
        <ThemeToggle />
      </div>

      {/* Location Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Location Services
            </span>
            <Button variant="outline" size="sm" onClick={getCurrentLocation} disabled={isLoadingLocation}>
              {isLoadingLocation ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Locate className="w-4 h-4 mr-2" />
              )}
              {userLocation ? "Update Location" : "Get My Location"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userLocation ? (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>
                Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enable location services to see nearby issues and get directions
            </p>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Street Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Interactive Street Map
              {userLocation && <Badge variant="secondary">GPS Enabled</Badge>}
            </span>
            <div className="flex gap-2">
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
                <pattern id="streetGrid" x="0" y="0" width="40" height="30" patternUnits="userSpaceOnUse">
                  <rect width="40" height="30" fill="transparent" />
                  <path
                    d="M 40 0 L 0 0 0 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-gray-300 dark:text-gray-600"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#streetGrid)" />

              {/* Major Roads */}
              <line
                x1="0"
                y1="150"
                x2="400"
                y2="150"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-400 dark:text-gray-500"
              />
              <line
                x1="200"
                y1="0"
                x2="200"
                y2="300"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-400 dark:text-gray-500"
              />
              <line
                x1="0"
                y1="75"
                x2="400"
                y2="75"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-300 dark:text-gray-600"
              />
              <line
                x1="0"
                y1="225"
                x2="400"
                y2="225"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-300 dark:text-gray-600"
              />
              <line
                x1="100"
                y1="0"
                x2="100"
                y2="300"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-300 dark:text-gray-600"
              />
              <line
                x1="300"
                y1="0"
                x2="300"
                y2="300"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-300 dark:text-gray-600"
              />

              {/* City Blocks */}
              <rect
                x="50"
                y="40"
                width="80"
                height="60"
                fill="currentColor"
                className="text-green-200 dark:text-green-800"
                opacity="0.3"
              />
              <rect
                x="150"
                y="40"
                width="80"
                height="60"
                fill="currentColor"
                className="text-blue-200 dark:text-blue-800"
                opacity="0.3"
              />
              <rect
                x="250"
                y="40"
                width="80"
                height="60"
                fill="currentColor"
                className="text-yellow-200 dark:text-yellow-800"
                opacity="0.3"
              />
              <rect
                x="50"
                y="180"
                width="80"
                height="60"
                fill="currentColor"
                className="text-purple-200 dark:text-purple-800"
                opacity="0.3"
              />
              <rect
                x="150"
                y="180"
                width="80"
                height="60"
                fill="currentColor"
                className="text-red-200 dark:text-red-800"
                opacity="0.3"
              />
              <rect
                x="250"
                y="180"
                width="80"
                height="60"
                fill="currentColor"
                className="text-indigo-200 dark:text-indigo-800"
                opacity="0.3"
              />

              {/* Street Labels */}
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
            </svg>

            {/* User location pin */}
            {userLocation && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{
                  left: `${50 + (userLocation.lng - mapCenter.lng) * 1000}%`,
                  top: `${50 - (userLocation.lat - mapCenter.lat) * 1000}%`,
                }}
              >
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse">
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  You are here
                </div>
              </div>
            )}

            {/* Issue pins with GPS coordinates */}
            {reports.slice(0, 8).map((report, index) => {
              const position = report.coordinates
                ? {
                    left: `${Math.max(5, Math.min(95, 50 + (report.coordinates.lng - mapCenter.lng) * 1000))}%`,
                    top: `${Math.max(5, Math.min(95, 50 - (report.coordinates.lat - mapCenter.lat) * 1000))}%`,
                  }
                : {
                    left: `${20 + (index % 4) * 20}%`,
                    top: `${25 + Math.floor(index / 4) * 25}%`,
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
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                      report.status === "Resolved"
                        ? "bg-green-500"
                        : report.status === "In Progress"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-white" />
                  </div>

                  {/* GPS coordinates tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <div className="font-medium">{report.type}</div>
                    {report.coordinates && (
                      <div className="text-gray-300">
                        {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}

            {/* Map info overlay */}
            <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Zoom: {zoomLevel}x | Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">{reports.length} issues mapped</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
