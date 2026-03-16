'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Home, Search, PlusCircle, AlertTriangle, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="bg-navy-500 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">Franks Angels</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link href="/fields" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
              <Search className="w-4 h-4" />
              Fields
            </Link>
            <Link href="/fields-needing-help" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
              <AlertTriangle className="w-4 h-4" />
              Need Help
            </Link>
            {user && (
              <Link href="/add-field" className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                <PlusCircle className="w-4 h-4" />
                Add Field
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-navy-500 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}