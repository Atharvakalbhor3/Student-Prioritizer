'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { submitAssignment, getStudentSubmissions } from '@/app/actions'
import { supabaseClient } from '@/lib/supabaseClient'

export default function StudentPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [studentName, setStudentName] = useState('')
  const [rollNo, setRollNo] = useState('')
  const [subject, setSubject] = useState('')
  const [assignmentName, setAssignmentName] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

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

      if (profile?.role === 'teacher') {
        router.push('/teacher')
        return
      }

      setUser(data.user)
      loadSubmissions(data.user.id)
    })()
  }, [router])

  // Realtime subscription: update student's submissions when teacher adds note or updates
  useEffect(() => {
    if (!user) return

    const channel = supabaseClient
      .channel('public:submissions')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'submissions', filter: `student_id=eq.${user.id}` },
        (payload) => {
          const updated = payload.new
          setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        }
      )
      .subscribe()

    return () => {
      try {
        channel.unsubscribe()
      } catch (e) {
        // ignore unsubscribe errors
      }
    }
  }, [user])

  const loadSubmissions = async (studentId) => {
    const result = await getStudentSubmissions(studentId)
    if (result.success) {
      setSubmissions(result.data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const result = await submitAssignment(
      user.id,
      studentName,
      rollNo,
      subject,
      assignmentName
    )

    if (result.error) {
      setMessage(`Error: ${result.error}`)
    } else {
      setMessage('Assignment submitted successfully!')
      setStudentName('')
      setRollNo('')
      setSubject('')
      setAssignmentName('')
      loadSubmissions(user.id)
    }

    setLoading(false)
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
          <p className="text-gray-600">Welcome, {user.email}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Submit Assignment
          </h2>

          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Roll Number
              </label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your roll number"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subject name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Assignment Name
              </label>
              <input
                type="text"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter assignment name"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            My Submissions
          </h2>
          
          {submissions.length === 0 ? (
            <p className="text-gray-600">No submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          Priority: {submission.priority}
                        </span>
                        {submission.is_checked && (
                          <span className="text-green-600 font-bold text-xl">✓</span>
                        )}
                      </div>
                      <p className="text-gray-700"><strong>Subject:</strong> {submission.subject}</p>
                      <p className="text-gray-700"><strong>Assignment:</strong> {submission.assignment_name}</p>
                      <p className="text-gray-600 text-sm">
                        Submitted: {new Date(submission.submitted_at).toLocaleString()}
                      </p>
                      {submission.note && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-gray-700">
                            <strong>Teacher's Note:</strong> {submission.note}
                          </p>
                        </div>
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
