'use client'

import { useEffect, useState } from 'react'
import { supabase, Field, calculateHealthScore } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FieldCard from '@/components/FieldCard'
import { Loader2, AlertTriangle } from 'lucide-react'

export default function FieldsNeedingHelpPage() {
  const [fields, setFields] = useState<Field[]>([])
  const [fieldScores, setFieldScores] = useState<Record<string, number>>({})
  const [fieldDonations, setFieldDonations] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFields()
  }, [])

  async function fetchFields() {
    setLoading(true)
    
    const { data: fieldsData, error: fieldsError } = await supabase
      .from('fields')
      .select('*')

    if (fieldsError) {
      console.error('Error fetching fields:', fieldsError)
      setLoading(false)
      return
    }

    // Calculate health scores for all fields
    const scores: Record<string, number> = {}
    const donations: Record<string, number> = {}

    for (const field of fieldsData || []) {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('field_id', field.id)

      if (reviews && reviews.length > 0) {
        const totalScore = reviews.reduce((sum, review) => {
          return sum + calculateHealthScore(review)
        }, 0)
        scores[field.id] = Math.round(totalScore / reviews.length)
      } else {
        scores[field.id] = 0 // No reviews means no score
      }

      // Get donations
      const { data: donationsData } = await supabase
        .from('donations')
        .select('amount')
        .eq('field_id', field.id)

      if (donationsData) {
        donations[field.id] = donationsData.reduce((sum, d) => sum + Number(d.amount), 0)
      }
    }

    // Sort fields by health score (lowest first)
    const sortedFields = [...(fieldsData || [])].sort((a, b) => {
      return (scores[a.id] || 0) - (scores[b.id] || 0)
    })

    setFields(sortedFields)
    setFieldScores(scores)
    setFieldDonations(donations)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Fields That Need Help</h1>
          </div>
          <p className="text-white/90 text-lg max-w-2xl">
            These baseball fields have been rated as needing attention by the community. 
            Your support can help improve conditions for young athletes.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-navy-500 animate-spin" />
          </div>
        ) : fields.length > 0 ? (
          <div className="space-y-8">
            {fields.map((field, index) => {
              const score = fieldScores[field.id] || 0
              // Only show fields that need help (score < 60 or no reviews)
              if (score >= 60 && score > 0) return null

              return (
                <div key={field.id} className="relative">
                  {index < 3 && (
                    <div className="absolute -top-3 -left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      #{index + 1} Priority
                    </div>
                  )}
                  <FieldCard
                    field={field}
                    healthScore={score}
                    donationTotal={fieldDonations[field.id]}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Great News!</h3>
            <p className="text-gray-600">All fields are in good condition. Check back later for updates.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}