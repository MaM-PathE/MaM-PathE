"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { GraduationCap, Plus, Trash2, AlertCircle, CheckCircle, Loader2, Building, Calendar, User } from "lucide-react"

export default function SupervisionsManagement() {
  const [supervisions, setSupervisions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [studentName, setStudentName] = useState("")
  const [projectTitle, setProjectTitle] = useState("")
  const [institution, setInstitution] = useState("")
  const [period, setPeriod] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"ongoing" | "completed">("ongoing")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchSupervisions()
  }, [])

  const fetchSupervisions = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/supervisions")
      const data = await res.json()
      setSupervisions(data.supervisions || [])
    } catch (error) {
      console.error("Error fetching supervisions:", error)
      setError("Failed to load supervisions")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!studentName.trim() || !projectTitle.trim() || !institution.trim() || !period.trim()) {
      setError("Student name, project title, institution, and period are required")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/admin/supervisions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_name: studentName,
          project_title: projectTitle,
          institution,
          period,
          description,
          status,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to add supervision")
      }

      // Reset form
      setStudentName("")
      setProjectTitle("")
      setInstitution("")
      setPeriod("")
      setDescription("")

      setSuccess("Supervision added successfully")
      fetchSupervisions()
    } catch (error) {
      console.error("Error adding supervision:", error)
      setError(error instanceof Error ? error.message : "Failed to add supervision")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this supervision?")) return

    try {
      const res = await fetch(`/api/admin/supervisions/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete supervision")
      }

      setSuccess("Supervision deleted successfully")
      fetchSupervisions()
    } catch (error) {
      console.error("Error deleting supervision:", error)
      setError(error instanceof Error ? error.message : "Failed to delete supervision")
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen p-6 rounded-xl shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <GraduationCap className="mr-3 h-8 w-8 text-indigo-600" />
            <span>Supervisions Management</span>
          </h1>
          <div className="text-sm text-gray-500">Manage your academic supervisions</div>
        </div>

        {/* Add Supervision Form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Add New Supervision</h2>

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
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                  Student Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter student name"
                />
              </div>

              <div>
                <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="projectTitle"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter project title"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution <span className="text-red-500">*</span>
                </label>
                <Input
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter institution name"
                />
              </div>

              <div>
                <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                  Period <span className="text-red-500">*</span>
                </label>
                <Input
                  id="period"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  required
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., 2020-2022"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as "ongoing" | "completed")} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
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
                placeholder="Enter project description"
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
                    Add Supervision
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Supervisions List */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-indigo-100">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Your Supervisions</h2>

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
          ) : supervisions.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No supervisions yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add your first supervision using the form above. Supervisions will appear in the Supervision section of
                your website.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {supervisions.map((supervision) => (
                <div
                  key={supervision.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900">{supervision.project_title}</h3>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-indigo-500" />
                          <span>{supervision.student_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1 text-indigo-500" />
                          <span>{supervision.institution}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                          <span>{supervision.period}</span>
                        </div>
                      </div>

                      {supervision.description && (
                        <p className="text-sm text-gray-600 mt-2">{supervision.description}</p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(supervision.id)}
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
