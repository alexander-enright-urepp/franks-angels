'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Loader2, Star } from 'lucide-react'

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams()
  const fieldId = params.id as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [ratings, setRatings] = useState({
    grass_rating: 0,
    dirt_rating: 0,
    dugout_rating: 0,
    fence_rating: 0,
    bleacher_rating: 0,
  })
  const [comment, setComment] = useState('')

  const handleRatingChange = (category: string, value: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('You must be logged in to leave a review')
      setLoading(false)
      return
    }

    // Validate all ratings are selected
    if (Object.values(ratings).some(r => r === 0)) {
      setError('Please rate all categories')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase
      .from('reviews')
      .insert([
        {
          field_id: fieldId,
          user_id: user.id,
          ...ratings,
          comment,
        }
      ])

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push(`/fields/${fieldId}`)
    router.refresh()
  }

  const ratingCategories = [
    { key: 'grass_rating', label: 'Grass Condition' },
    { key: 'dirt_rating', label: 'Infield Dirt Quality' },
    { key: 'dugout_rating', label: 'Dugout Safety' },
    { key: 'fence_rating', label: 'Fence / Backstop Condition' },
    { key: 'bleacher_rating', label: 'Bleachers / Seating Condition' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy-500 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Leave a Review</h1>
          <p className="text-navy-100">
            Rate this field to help others know what to expect
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {ratingCategories.map((category) => (
              <div key={category.key}>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {category.label}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingChange(category.key, value)}
                      className="p-2 transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          value <= ratings[category.key as keyof typeof ratings]
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-200 hover:text-yellow-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy-400 focus:border-navy-400"
                placeholder="Share your experience with this field..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-navy-500 hover:bg-navy-600 disabled:bg-navy-300 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}