'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, Field, Review, FieldPhoto, calculateHealthScore, getHealthScoreLabel } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HealthScoreBar from '@/components/HealthScoreBar'
import ReviewCard from '@/components/ReviewCard'
import { Loader2, MapPin, ArrowLeft, Camera, Heart, DollarSign } from 'lucide-react'

export default function FieldPage() {
  const params = useParams()
  const fieldId = params.id as string

  const [field, setField] = useState<Field | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [photos, setPhotos] = useState<FieldPhoto[]>([])
  const [donations, setDonations] = useState<{ amount: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [healthScore, setHealthScore] = useState(0)

  useEffect(() => {
    if (fieldId) {
      fetchFieldData()
    }
  }, [fieldId])

  async function fetchFieldData() {
    setLoading(true)

    // Fetch field
    const { data: fieldData } = await supabase
      .from('fields')
      .select('*')
      .eq('id', fieldId)
      .single()

    if (fieldData) {
      setField(fieldData)

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('field_id', fieldId)
        .order('created_at', { ascending: false })

      setReviews(reviewsData || [])

      // Calculate health score
      if (reviewsData && reviewsData.length > 0) {
        const totalScore = reviewsData.reduce((sum, review) => {
          return sum + calculateHealthScore(review)
        }, 0)
        setHealthScore(Math.round(totalScore / reviewsData.length))
      }

      // Fetch photos
      const { data: photosData } = await supabase
        .from('field_photos')
        .select('*')
        .eq('field_id', fieldId)
        .order('uploaded_at', { ascending: false })

      setPhotos(photosData || [])

      // Fetch donations
      const { data: donationsData } = await supabase
        .from('donations')
        .select('amount')
        .eq('field_id', fieldId)

      setDonations(donationsData || [])
    }

    setLoading(false)
  }

  const donationTotal = donations.reduce((sum, d) => sum + Number(d.amount), 0)
  const donationGoal = 2000
  const donationProgress = Math.min((donationTotal / donationGoal) * 100, 100)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-navy-500 animate-spin" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!field) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Field not found</h1>
          <Link href="/fields" className="text-navy-600 hover:underline">
            Back to fields
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Field Header */}
      <div className="bg-navy-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/fields"
            className="inline-flex items-center gap-2 text-navy-100 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Fields
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{field.name}</h1>
              <div className="flex items-center gap-2 text-navy-100">
                <MapPin className="w-5 h-5" />
                <span>{field.city}, {field.state}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Link
                href={`/fields/${fieldId}/review`}
                className="inline-flex items-center gap-2 bg-white text-navy-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Camera className="w-4 h-4" />
                Add Review
              </Link>
              <Link
                href={`/fields/${fieldId}/donate`}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <DollarSign className="w-4 h-4" />
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Field Photo */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              {field.photo_url ? (
                <img
                  src={field.photo_url}
                  alt={field.name}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="w-full h-80 flex items-center justify-center bg-navy-100">
                  <span className="text-8xl">⚾</span>
                </div>
              )}
            </div>

            {/* Description */}
            {field.description && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Field</h2>
                <p className="text-gray-700">{field.description}</p>
              </div>
            )}

            {/* Photo Gallery */}
            {photos.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={photo.image_url}
                        alt="Field photo"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reviews ({reviews.length})</h2>
                <Link
                  href={`/fields/${fieldId}/review`}
                  className="text-navy-600 hover:text-navy-700 font-medium"
                >
                  Write a Review
                </Link>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No reviews yet. Be the first to review this field!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Score */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Field Health Score</h3>
              <HealthScoreBar score={healthScore} size="lg" />
              <p className="text-sm text-gray-600 mt-4">
                Based on {reviews.length} community {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Donations */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Support This Field</h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Raised</span>
                  <span className="font-bold text-navy-600">
                    ${donationTotal.toLocaleString()} of ${donationGoal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-green-500 transition-all"
                    style={{ width: `${donationProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{Math.round(donationProgress)}% of goal</p>
              </div>

              <Link
                href={`/fields/${fieldId}/donate`}
                className="w-full block text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Donate Now
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/fields/${fieldId}/review`}
                  className="w-full block text-center border-2 border-navy-500 text-navy-600 hover:bg-navy-50 py-3 rounded-lg font-medium transition-colors"
                >
                  Add Review
                </Link>
                <Link
                  href={`/fields/${fieldId}/upload`}
                  className="w-full block text-center border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-medium transition-colors"
                >
                  Upload Photo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}