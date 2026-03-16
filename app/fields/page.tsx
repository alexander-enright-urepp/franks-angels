'use client'

import { useEffect, useState } from 'react'
import { supabase, Field, calculateHealthScore } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FieldCard from '@/components/FieldCard'
import SearchBar from '@/components/SearchBar'
import { Loader2 } from 'lucide-react'

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([])
  const [fieldScores, setFieldScores] = useState<Record<string, number>>({})
  const [fieldDonations, setFieldDonations] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchFields()
  }, [])

  async function fetchFields() {
    setLoading(true)
    
    const { data: fieldsData, error: fieldsError } = await supabase
      .from('fields')
      .select('*')
      .order('created_at', { ascending: false })

    if (fieldsError) {
      console.error('Error fetching fields:', fieldsError)
      setLoading(false)
      return
    }

    setFields(fieldsData || [])

    // Fetch reviews and calculate health scores
    const scores: Record<string, number> = {}
    const donations: Record<string, number> = {}

    for (const field of fieldsData || []) {
      // Get reviews for this field
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('field_id', field.id)

      if (reviews && reviews.length > 0) {
        // Calculate average health score
        const totalScore = reviews.reduce((sum, review) => {
          return sum + calculateHealthScore(review)
        }, 0)
        scores[field.id] = Math.round(totalScore / reviews.length)
      }

      // Get donations for this field
      const { data: donationsData } = await supabase
        .from('donations')
        .select('amount')
        .eq('field_id', field.id)

      if (donationsData) {
        donations[field.id] = donationsData.reduce((sum, d) => sum + Number(d.amount), 0)
      }
    }

    setFieldScores(scores)
    setFieldDonations(donations)
    setLoading(false)
  }

  const filteredFields = fields.filter(field => {
    const query = searchQuery.toLowerCase()
    return (
      field.name.toLowerCase().includes(query) ||
      field.city.toLowerCase().includes(query) ||
      field.state.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Find Baseball Fields</h1>
          <p className="text-navy-100 text-lg">
            Discover and review youth baseball fields in your community
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by field name or city..."
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-navy-500 animate-spin" />
          </div>
        ) : filteredFields.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                healthScore={fieldScores[field.id]}
                donationTotal={fieldDonations[field.id]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No fields found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'Try adjusting your search' : 'Be the first to add a field!'}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}