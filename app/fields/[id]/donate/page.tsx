'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Loader2, Heart, DollarSign } from 'lucide-react'

export default function DonatePage() {
  const router = useRouter()
  const params = useParams()
  const fieldId = params.id as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    donor_name: '',
    amount: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('donations')
      .insert([
        {
          field_id: fieldId,
          donor_name: formData.donor_name || 'Anonymous',
          amount: amount,
        }
      ])

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
            <p className="text-gray-600 mb-6">
              Your donation has been recorded. Every contribution helps improve youth baseball fields.
            </p>            
            <button
              onClick={() => router.push(`/fields/${fieldId}`)}
              className="bg-navy-500 hover:bg-navy-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Field
            </button>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Support This Field</h1>
          <p className="text-green-100">
            Your donation helps improve facilities for young athletes
          </p>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-gray-600">
              This is a simulated donation for the MVP. No actual payment will be processed.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={formData.donor_name}
                onChange={(e) => setFormData(prev => ({ ...prev, donor_name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                placeholder="e.g., John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount ($) *
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400"
                placeholder="e.g., 50.00"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[25, 50, 100].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                  className="py-2 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Complete Donation
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}