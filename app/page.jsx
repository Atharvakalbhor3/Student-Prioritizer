import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-5">
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to Student Prioritizer
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Manage student assignments efficiently. First come, first served!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200 w-full sm:w-auto"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-200 w-full sm:w-auto"
          >
            Sign Up
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Students</h3>
            <p className="text-gray-600">
              Submit your assignment details and get in line. Your priority is based on when you submit!
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">For Teachers</h3>
            <p className="text-gray-600">
              View all submissions in priority order, check assignments, and add notes for students.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
