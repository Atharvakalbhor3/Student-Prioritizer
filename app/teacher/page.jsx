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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
          <p className="text-gray-600">Welcome, {user.email}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Student Submissions (Priority Order)
          </h2>
          
          {submissions.length === 0 ? (
            <p className="text-gray-600">No submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className={`border-2 rounded-lg p-4 ${
                    submission.is_checked 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg min-w-[50px] text-center">
                          {submission.priority}
                        </span>
                        {submission.is_checked && (
                          <span className="text-green-600 font-bold text-2xl">✓ Checked</span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
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
                      
                      <p className="text-gray-500 text-sm mb-3">
                        Submitted: {new Date(submission.submitted_at).toLocaleString()}
                      </p>

                      {submission.note && (
                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-gray-700">
                            <strong>Your Note:</strong> {submission.note}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          value={notes[submission.id] || ''}
                          onChange={(e) => setNotes({ ...notes, [submission.id]: e.target.value })}
                          placeholder="Add a note for this student..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddNote(submission.id)}
                          disabled={loading[`note-${submission.id}`]}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                          {loading[`note-${submission.id}`] ? 'Adding...' : 'Add Note'}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!submission.is_checked && (
                        <button
                          onClick={() => handleCheck(submission.id)}
                          disabled={loading[submission.id]}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 whitespace-nowrap"
                        >
                          {loading[submission.id] ? 'Checking...' : 'Mark as Checked'}
                        </button>
                      )}

                      {submission.is_checked && (
                        <button
                          onClick={() => handleDelete(submission.id)}
                          disabled={loading[`delete-${submission.id}`]}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 whitespace-nowrap"
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
