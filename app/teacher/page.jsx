'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSubmissions, checkAssignment, addNote, deleteSubmission } from '@/app/actions'
import { supabaseClient } from '@/lib/supabaseClient'

export default function TeacherPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const [notes, setNotes] = useState({})
  const [loading, setLoading] = useState({})

  useEffect(() => {
    ;(async () => {
      const { data } = await supabaseClient.auth.getUser()
      if (!data?.user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role !== 'teacher') {
        router.push('/student')
        return
      }

      setUser(data.user)
      loadSubmissions()
    })()
  }, [router])

  const loadSubmissions = async () => {
    const result = await getSubmissions()
    if (result.success) {
      setSubmissions(result.data)
    }
  }

  const handleCheck = async (submissionId) => {
    setLoading({ ...loading, [submissionId]: true })
    const result = await checkAssignment(submissionId)
    if (result.success) {
      loadSubmissions()
    }
    setLoading({ ...loading, [submissionId]: false })
  }

  const handleAddNote = async (submissionId) => {
    const note = notes[submissionId] || ''
    if (!note.trim()) return

    setLoading({ ...loading, [`note-${submissionId}`]: true })
    const result = await addNote(submissionId, note)
    if (result.success) {
      setNotes({ ...notes, [submissionId]: '' })
      loadSubmissions()
    }
    setLoading({ ...loading, [`note-${submissionId}`]: false })
  }

  const handleDelete = async (submissionId) => {
    if (!confirm('Delete this submission? This action cannot be undone.')) return

    setLoading({ ...loading, [`delete-${submissionId}`]: true })
    const result = await deleteSubmission(submissionId)
    if (result.success) {
      loadSubmissions()
    } else {
      alert(result.error || 'Failed to delete submission')
    }
    setLoading({ ...loading, [`delete-${submissionId}`]: false })
  }

  const handleLogout = () => {
    supabaseClient.auth.signOut()
    router.push('/')
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-semibold w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
          <p className="text-gray-600 text-sm sm:text-base break-all">Welcome, {user.email}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Student Submissions (Priority Order)
          </h2>
          
          {submissions.length === 0 ? (
            <p className="text-gray-600">No submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`border-2 rounded-lg p-3 sm:p-4 ${
                    submission.is_checked 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-full">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-bold text-lg min-w-[50px] text-center">
                          {submission.priority}
                        </span>
                        {submission.is_checked && (
                          <span className="text-green-600 font-bold text-xl sm:text-2xl">✓ Checked</span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm sm:text-base">
                        <p className="text-gray-700">
                          <strong>Student Name:</strong> {submission.student_name}
                        </p>
                        <p className="text-gray-700">
                          <strong>Roll No:</strong> {submission.roll_no}
                        </p>
                        <p className="text-gray-700">
                          <strong>Subject:</strong> {submission.subject}
                        </p>
                        <p className="text-gray-700">
                          <strong>Assignment:</strong> {submission.assignment_name}
                        </p>
                      </div>
                      
                      <p className="text-gray-500 text-xs sm:text-sm mb-3">
                        Submitted: {new Date(submission.submitted_at).toLocaleString()}
                      </p>

                      {submission.note && (
                        <div className="mt-2 p-2 sm:p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                          <p className="text-gray-700">
                            <strong>Your Note:</strong> {submission.note}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={notes[submission.id] || ''}
                          onChange={(e) => setNotes({ ...notes, [submission.id]: e.target.value })}
                          placeholder="Add a note for this student..."
                          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                          onClick={() => handleAddNote(submission.id)}
                          disabled={loading[`note-${submission.id}`]}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded-lg disabled:opacity-50 font-semibold text-sm sm:text-base whitespace-nowrap"
                        >
                          {loading[`note-${submission.id}`] ? 'Adding...' : 'Add Note'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      {!submission.is_checked && (
                        <button
                          onClick={() => handleCheck(submission.id)}
                          disabled={loading[submission.id]}
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold disabled:opacity-50 text-sm sm:text-base"
                        >
                          {loading[submission.id] ? 'Checking...' : 'Mark as Checked'}
                        </button>
                      )}

                      {submission.is_checked && (
                        <button
                          onClick={() => handleDelete(submission.id)}
                          disabled={loading[`delete-${submission.id}`]}
                          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold disabled:opacity-50 text-sm sm:text-base"
                        >
                          {loading[`delete-${submission.id}`] ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </div>
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
