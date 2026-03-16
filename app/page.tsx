import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Navigation */}
      <nav className="border-b border-primary-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="text-2xl font-bold text-primary-600">Franks Angels</span>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-700 px-4 py-2 rounded-xl font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-md shadow-primary-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-primary-500">Franks Angels</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Your new app is ready for development. Start building something amazing!
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors shadow-xl shadow-primary-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary-200/50 bg-white/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>© 2024 Franks Angels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}