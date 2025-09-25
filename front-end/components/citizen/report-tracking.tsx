"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, Camera, MapPin, Calendar } from "lucide-react"

interface Report {
  id: string
  type: string
  description: string
  location: string
  status: "Pending" | "In Progress" | "Resolved"
  submittedAt: string
  estimatedResolution?: string
  photoName?: string
}

export default function ReportTracking() {
  const [reports, setReports] = useState<Report[]>([])

  useEffect(() => {
    const citizenReports = JSON.parse(localStorage.getItem("citizenReports") || "[]")
    setReports(citizenReports)
  }, [])

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

  if (reports.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No Reports Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              You haven't submitted any reports yet. Use the "Report Issue" tab to submit your first civic issue.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">My Reports ({reports.length})</h2>
      </div>

      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{report.type}</CardTitle>
              <Badge className={getStatusColor(report.status)}>
                {getStatusIcon(report.status)}
                <span className="ml-1">{report.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">{report.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{report.location}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Submitted: {new Date(report.submittedAt).toLocaleDateString()}</span>
              </div>

              {report.photoName && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Camera className="w-4 h-4" />
                  <span>{report.photoName}</span>
                </div>
              )}

              {report.estimatedResolution && (
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Est. Resolution: {new Date(report.estimatedResolution).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Progress Timeline */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      report.status === "Pending" || report.status === "In Progress" || report.status === "Resolved"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span className="text-gray-600 dark:text-gray-400">Submitted</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      report.status === "In Progress" || report.status === "Resolved" ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${report.status === "Resolved" ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span className="text-gray-600 dark:text-gray-400">Resolved</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">Report ID: #{report.id.slice(-6)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
