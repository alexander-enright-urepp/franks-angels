import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Franks Angels</h3>
            <p className="text-gray-400">
              Helping youth baseball fields thrive in underserved communities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/fields" className="hover:text-white transition-colors">All Fields</Link></li>
              <li><Link href="/fields-needing-help" className="hover:text-white transition-colors">Fields Needing Help</Link></li>
              <li><Link href="/add-field" className="hover:text-white transition-colors">Add a Field</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <p className="text-gray-400 text-sm">
              A nonprofit-inspired platform connecting communities with youth baseball fields that need support.
            </p>
          </div>
        </div>
        <div className="border-t border-navy-800 pt-8 text-center text-gray-500">
          <p>© 2024 Franks Angels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}