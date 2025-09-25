"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Camera, FileText, Users, BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

// Sample data for charts
const issueTypeData = [
  { name: "Road Issues", value: 35, color: "#3b82f6" },
  { name: "Waste Management", value: 25, color: "#10b981" },
  { name: "Water Supply", value: 20, color: "#f59e0b" },
  { name: "Street Lights", value: 15, color: "#ef4444" },
  { name: "Others", value: 5, color: "#8b5cf6" },
]

const monthlyData = [
  { month: "Jan", reports: 45, resolved: 38 },
  { month: "Feb", reports: 52, resolved: 45 },
  { month: "Mar", reports: 48, resolved: 42 },
  { month: "Apr", reports: 61, resolved: 55 },
  { month: "May", reports: 55, resolved: 48 },
  { month: "Jun", reports: 67, resolved: 58 },
]

const stats = [
  { label: "Total Reports", value: "1,234", icon: FileText, color: "text-blue-600" },
  { label: "Resolved Issues", value: "987", icon: CheckCircle, color: "text-green-600" },
  { label: "Avg Response Time", value: "2.3 days", icon: Clock, color: "text-orange-600" },
  { label: "Active Users", value: "456", icon: Users, color: "text-purple-600" },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-balance">CivicReport</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-pretty">
            Empowering communities to report civic issues and helping municipalities respond efficiently
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Issue Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={issueTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value">
                    {issueTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {issueTypeData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="reports" fill="#3b82f6" name="Reports" />
                  <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">Resolved</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Citizen Interface */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Report an Issue</CardTitle>
              <CardDescription>Submit civic issues in your community with photos and location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Auto-location detection</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Camera className="w-4 h-4" />
                <span>Photo & voice notes</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <FileText className="w-4 h-4" />
                <span>Track your reports</span>
              </div>
              <Link href="/citizen" className="block">
                <Button className="w-full mt-6">Start Reporting</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Interface */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              <CardDescription>Municipal staff portal for managing and resolving civic reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Interactive issue mapping</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>Report management</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & insights</span>
              </div>
              <Link href="/admin/login" className="block">
                <Button variant="outline" className="w-full mt-6 bg-transparent">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Report</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Citizens capture and submit civic issues with photos and location
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Track</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Issues are automatically routed to relevant municipal departments
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-green-600 dark:text-green-400 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Resolve</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Municipal staff address issues and update status in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
