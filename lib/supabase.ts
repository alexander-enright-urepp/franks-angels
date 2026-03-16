import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

export type Field = {
  id: string
  name: string
  city: string
  state: string
  location?: string
  description?: string
  photo_url?: string
  sport_type: string
  created_by?: string
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  field_id: string
  user_id: string
  grass_rating: number
  dirt_rating: number
  dugout_rating: number
  fence_rating: number
  bleacher_rating: number
  comment?: string
  created_at: string
}

export type Donation = {
  id: string
  field_id: string
  donor_name: string
  amount: number
  created_at: string
}

export type FieldPhoto = {
  id: string
  field_id: string
  user_id?: string
  image_url: string
  uploaded_at: string
}

// Calculate Field Health Score from ratings
export function calculateHealthScore(review: Review): number {
  const ratings = [
    review.grass_rating,
    review.dirt_rating,
    review.dugout_rating,
    review.fence_rating,
    review.bleacher_rating
  ]
  const average = ratings.reduce((a, b) => a + b, 0) / ratings.length
  return Math.round((average / 5) * 100)
}

// Get health score color based on percentage
export function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500'
  if (score >= 60) return 'bg-yellow-500'
  if (score >= 40) return 'bg-orange-500'
  return 'bg-red-500'
}

// Get health score label
export function getHealthScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Needs Attention'
  return 'Poor Condition'
}