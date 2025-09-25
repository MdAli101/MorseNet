"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, MapPin, Upload, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReportData {
  type: string
  description: string
  location: string
  photo: File | null
  voiceNote: string
}

export default function ReportForm() {
  const [reportData, setReportData] = useState<ReportData>({
    type: "",
    description: "",
    location: "",
    photo: null,
    voiceNote: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const issueTypes = [
    "Pothole",
    "Streetlight Issue",
    "Trash/Garbage",
    "Water Leak",
    "Broken Sidewalk",
    "Traffic Signal",
    "Graffiti",
    "Other",
  ]

  const getCurrentLocation = () => {
    setIsLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

          try {
            // In a real app, you would use a geocoding service like Google Maps API
            const addressResponse = await fetch(`https://api.example.com/geocode?lat=${latitude}&lng=${longitude}`)
            if (addressResponse.ok) {
              const addressData = await addressResponse.json()
              setReportData((prev) => ({
                ...prev,
                location: addressData.formatted_address || coordinates,
              }))
            } else {
              throw new Error("Geocoding failed")
            }
          } catch (error) {
            // Fallback to coordinates if geocoding fails
            setReportData((prev) => ({
              ...prev,
              location: coordinates,
            }))
          }

          setIsLocationLoading(false)
          toast({
            title: "Location captured",
            description: `GPS coordinates: ${coordinates}`,
          })
        },
        (error) => {
          setIsLocationLoading(false)
          let errorMessage = "Unable to get your location. Please enter manually."

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable."
              break
            case error.TIMEOUT:
              errorMessage = "Location request timed out."
              break
          }

          toast({
            title: "Location error",
            description: errorMessage,
            variant: "destructive",
          })
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000, // 5 minutes
        },
      )
    } else {
      setIsLocationLoading(false)
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      })
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReportData((prev) => ({ ...prev, photo: file }))
      toast({
        title: "Photo uploaded",
        description: `${file.name} has been attached to your report`,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save to localStorage for demo
    const reports = JSON.parse(localStorage.getItem("citizenReports") || "[]")
    const newReport = {
      id: Date.now().toString(),
      ...reportData,
      photoName: reportData.photo?.name || null,
      status: "Pending",
      submittedAt: new Date().toISOString(),
      estimatedResolution: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
    reports.push(newReport)
    localStorage.setItem("citizenReports", JSON.stringify(reports))

    setIsSubmitting(false)
    setSubmitted(true)

    toast({
      title: "Report submitted successfully!",
      description: "Your civic issue has been reported and assigned a tracking ID.",
    })

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setReportData({
        type: "",
        description: "",
        location: "",
        photo: null,
        voiceNote: "",
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 3000)
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-semibold text-green-700 dark:text-green-400">
              Report Submitted Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your report has been assigned ID: <strong>#{Date.now().toString().slice(-6)}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              You can track the progress in the "My Reports" tab
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Report a Civic Issue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Issue Type</Label>
            <Select
              value={reportData.type}
              onValueChange={(value) => setReportData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={reportData.description}
              onChange={(e) => setReportData((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <Input
                id="location"
                placeholder="Enter address or coordinates"
                value={reportData.location}
                onChange={(e) => setReportData((prev) => ({ ...prev, location: e.target.value }))}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isLocationLoading}
                className="shrink-0 bg-transparent"
              >
                {isLocationLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Photo Evidence</Label>
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Photo
              </Button>
              {reportData.photo && (
                <span className="text-sm text-green-600 dark:text-green-400">✓ {reportData.photo.name}</span>
              )}
            </div>
          </div>

          {/* Voice Note */}
          <div className="space-y-2">
            <Label htmlFor="voiceNote">Additional Notes</Label>
            <Textarea
              id="voiceNote"
              placeholder="Any additional information or voice note transcription..."
              value={reportData.voiceNote}
              onChange={(e) => setReportData((prev) => ({ ...prev, voiceNote: e.target.value }))}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !reportData.type || !reportData.description || !reportData.location}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Submitting Report...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
