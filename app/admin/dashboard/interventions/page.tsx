"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Trash2, AlertCircle, CheckCircle, Loader2, MapPin } from "lucide-react"

export default function InterventionsManagement() {
  const [interventions, setInterventions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("conference")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchInterventions()
  }, [])

  const fetchInterventions = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/interventions")
      const data = await res.json()
      setInterventions(data.interventions || [])
    } catch (error) {
      console.error("Error fetching interventions:", error)
      setError("Failed to load interventions")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim() || !date.trim() || !location.trim() || !type.trim()) {
      setError("Title, date, location, and type are required")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/admin/interventions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          date,
          location,
          description,
          type,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add intervention")
      }

      // Reset form
      setTitle("")
      setDate("")
      setLocation("")
      setDescription("")
      setType("conference")

      setSuccess("Intervention added successfully")
      fetchInterventions()
    } catch (error) {
      console.error("Error adding intervention:", error)
      setError(error instanceof Error ? error.message : "Failed to add intervention")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this intervention?")) return

    try {
      const res = await fetch(`/api/admin/interventions/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete intervention")
      }

      setSuccess("Intervention deleted successfully")
      fetchInterventions()
    } catch (error) {
      console.error("Error deleting intervention:", error)
      setError(error instanceof Error ? error.message : "Failed to delete intervention")
    }
  }

  const interventionTypes = [
    { value: "conference", label: "Conference" },
    { value: "lecture", label: "Lecture" },
    { value: "surgery", label: "Surgery" },
    { value: "meeting", label: "Meeting" },
    { value: "workshop", label: "Workshop" },
  ]

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen p-6 rounded-xl shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Calendar className="mr-3 h-8 w-8 text-indigo-600" />
            <span>Interventions Management</span>
          </h1>
          <div className="text-sm text-gray-500">Manage your events and interventions</div>
        </div>

        {/* Add Intervention Form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Add New Intervention</h2>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 bg-green-50 border-l-4 border-green-500 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter intervention title"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {interventionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter description"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Intervention
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Interventions List */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Your Interventions</h2>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded-md"></div>
                </div>
              ))}
            </div>
          ) : interventions.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interventions yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add your first intervention using the form above. Interventions will appear in the Agenda section of
                your website.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {interventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full mr-2">
                          {intervention.type.charAt(0).toUpperCase() + intervention.type.slice(1)}
                        </span>
                        <h3 className="font-medium text-gray-900">{intervention.title}</h3>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                          <span>{intervention.date}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-indigo-500" />
                          <span>{intervention.location}</span>
                        </div>
                      </div>

                      {intervention.description && (
                        <p className="text-sm text-gray-600 mt-2">{intervention.description}</p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(intervention.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
