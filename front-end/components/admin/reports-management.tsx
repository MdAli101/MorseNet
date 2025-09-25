"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Clock, CheckCircle, AlertCircle, MapPin, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Report {
  id: string
  type: string
  description: string
  location: string
  status: "Pending" | "In Progress" | "Resolved"
  submittedAt: string
  priority: "Low" | "Medium" | "High"
}

interface ReportsManagementProps {
  reports: Report[]
  setReports: (reports: Report[]) => void
}

export default function ReportsManagement({ reports, setReports }: ReportsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const { toast } = useToast()

  const filteredReports = reports.filter((report) => {
    const searchMatch =
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = statusFilter === "all" || report.status === statusFilter
    const typeMatch = typeFilter === "all" || report.type === typeFilter
    const priorityMatch = priorityFilter === "all" || report.priority === priorityFilter
    return searchMatch && statusMatch && typeMatch && priorityMatch
  })

  const updateReportStatus = (reportId: string, newStatus: "Pending" | "In Progress" | "Resolved") => {
    const updatedReports = reports.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report))
    setReports(updatedReports)

    // Update localStorage for demo
    const citizenReports = JSON.parse(localStorage.getItem("citizenReports") || "[]")
    const updatedCitizenReports = citizenReports.map((report: any) =>
      report.id === reportId ? { ...report, status: newStatus } : report,
    )
    localStorage.setItem("citizenReports", JSON.stringify(updatedCitizenReports))

    toast({
      title: "Status Updated",
      description: `Report #${reportId.slice(-6)} has been marked as ${newStatus}`,
    })
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
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Reports ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{report.type}</h3>
                      <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {getStatusIcon(report.status)}
                        <span className="ml-1">{report.status}</span>
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{report.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{report.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Reported: {new Date(report.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant={report.status === "Pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateReportStatus(report.id, "Pending")}
                    disabled={report.status === "Pending"}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={report.status === "In Progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateReportStatus(report.id, "In Progress")}
                    disabled={report.status === "In Progress"}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={report.status === "Resolved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateReportStatus(report.id, "Resolved")}
                    disabled={report.status === "Resolved"}
                  >
                    Resolved
                  </Button>
                  <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 self-center">
                    ID: #{report.id.slice(-6)}
                  </div>
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No reports found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
