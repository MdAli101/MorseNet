"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Camera, MapPin, Send } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SimpleCitizenPage() {
  const [step, setStep] = useState(1)
  const [issueType, setIssueType] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const issueTypes = [
    { id: "pothole", name: "Pothole", icon: "🕳️" },
    { id: "streetlight", name: "Broken Light", icon: "💡" },
    { id: "trash", name: "Trash Issue", icon: "🗑️" },
    { id: "water", name: "Water Problem", icon: "💧" },
    { id: "other", name: "Other", icon: "❓" },
  ]

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        },
        () => {
          setLocation("Location not available")
        },
      )
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Save to localStorage
    const reports = JSON.parse(localStorage.getItem("citizenReports") || "[]")
    const newReport = {
      id: Date.now().toString(),
      type: issueTypes.find((t) => t.id === issueType)?.name || "Other",
      description,
      location,
      photoName: photo?.name || null,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    }
    reports.push(newReport)
    localStorage.setItem("citizenReports", JSON.stringify(reports))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Report Sent!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for helping improve our community. We'll look into this issue soon.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setStep(1)
                  setIssueType("")
                  setPhoto(null)
                  setLocation("")
                  setDescription("")
                }}
                className="w-full"
              >
                Report Another Issue
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Back</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= i ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                    }`}
                  >
                    {i}
                  </div>
                  {i < 4 && <div className={`w-8 h-1 ${step > i ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`} />}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {step === 1 && "What's the problem?"}
                {step === 2 && "Take a photo"}
                {step === 3 && "Where is it?"}
                {step === 4 && "Tell us more"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {issueTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setIssueType(type.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          issueType === type.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{type.icon}</span>
                          <span className="text-lg font-medium">{type.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button onClick={() => setStep(2)} disabled={!issueType} className="w-full mt-6" size="lg">
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 text-center">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
                    {photo ? (
                      <div>
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-green-600 dark:text-green-400 font-medium">Photo added!</p>
                        <p className="text-sm text-gray-500">{photo.name}</p>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Take a photo to help us understand the problem better
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label htmlFor="photo-upload">
                          <Button asChild size="lg">
                            <span>Take Photo</span>
                          </Button>
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 bg-transparent">
                      Back
                    </Button>
                    <Button onClick={() => setStep(3)} className="flex-1">
                      {photo ? "Next" : "Skip Photo"}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto text-blue-500 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      We need to know where the problem is located
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button onClick={getLocation} variant="outline" className="w-full bg-transparent" size="lg">
                      📍 Use My Current Location
                    </Button>

                    <div className="text-center text-gray-500">or</div>

                    <textarea
                      placeholder="Type the address or describe the location..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full p-3 border rounded-lg resize-none h-20 bg-background"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1 bg-transparent">
                      Back
                    </Button>
                    <Button onClick={() => setStep(4)} disabled={!location} className="flex-1">
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-gray-600 dark:text-gray-400">Tell us more about the problem (optional)</p>
                  </div>

                  <textarea
                    placeholder="Describe what you see... (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 border rounded-lg resize-none h-32 bg-background"
                  />

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep(3)} className="flex-1 bg-transparent">
                      Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1" size="lg">
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
