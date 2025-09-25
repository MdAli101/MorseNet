"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, logout } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, MapPin } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface Report {
  id: string
  type: string
  description: string
  location: string
  status: "Pending" | "In Progress" | "Resolved"
  submittedAt: string
}

export default function SimpleAdminDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [activeView, setActiveView] = useState("overview")
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
      return
    }

    // Load reports
    const citizenReports = JSON.parse(localStorage.getItem("citizenReports") || "[]")
    const demoReports = [
      {
        id: "demo1",
        type: "Pothole",
        description: "Large pothole on Main Street",
        location: "Main Street & 1st Ave",
        status: "In Progress" as const,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo2",
        type: "Broken Light",
        description: "Street light not working",
        location: "Park Avenue",
        status: "Resolved" as const,
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    setReports([...demoReports, ...citizenReports])
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const updateReportStatus = (reportId: string, newStatus: "Pending" | "In Progress" | "Resolved") => {
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)))

    // Update localStorage
    const citizenReports = JSON.parse(localStorage.getItem("citizenReports") || "[]")
    const updatedReports = citizenReports.map((report: any) =>
      report.id === reportId ? { ...report, status: newStatus } : report,
    )
    localStorage.setItem("citizenReports", JSON.stringify(updatedReports))
  }

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "Pending").length,
    inProgress: reports.filter((r) => r.status === "In Progress").length,
    resolved: reports.filter((r) => r.status === "Resolved").length,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">City Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage community reports</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={handleLogout} variant="outline" className="bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveView("overview")}
            variant={activeView === "overview" ? "default" : "outline"}
            className={activeView !== "overview" ? "bg-transparent" : ""}
          >
            📊 Overview
          </Button>
          <Button
            onClick={() => setActiveView("reports")}
            variant={activeView === "reports" ? "default" : "outline"}
            className={activeView !== "reports" ? "bg-transparent" : ""}
          >
            📋 All Reports
            {stats.pending > 0 && (
              <Badge variant="destructive" className="ml-2">
                {stats.pending}
              </Badge>
            )}
          </Button>
        </div>

        {activeView === "overview" && (
          <div className="space-y-6">
            {/* Simple stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Reports</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Waiting</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Working On</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fixed</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent reports */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.slice(0, 5).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{report.type}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{report.location}</div>
                      </div>
                      <Badge
                        variant={
                          report.status === "Resolved"
                            ? "default"
                            : report.status === "In Progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === "reports" && (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{report.type}</h3>
                        <Badge
                          variant={
                            report.status === "Resolved"
                              ? "default"
                              : report.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{report.description}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {report.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {report.status === "Pending" && (
                      <Button size="sm" onClick={() => updateReportStatus(report.id, "In Progress")}>
                        Start Working
                      </Button>
                    )}
                    {report.status === "In Progress" && (
                      <Button size="sm" onClick={() => updateReportStatus(report.id, "Resolved")}>
                        Mark as Fixed
                      </Button>
                    )}
                    {report.status === "Resolved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReportStatus(report.id, "Pending")}
                        className="bg-transparent"
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
