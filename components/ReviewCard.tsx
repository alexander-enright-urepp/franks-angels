import { Star, User } from 'lucide-react'
import { Review, calculateHealthScore } from '@/lib/supabase'

interface ReviewCardProps {
  review: Review
  userName?: string
}

export default function ReviewCard({ review, userName }: ReviewCardProps) {
  const healthScore = calculateHealthScore(review)
  const ratings = [
    { label: 'Grass', value: review.grass_rating },
    { label: 'Dirt', value: review.dirt_rating },
    { label: 'Dugout', value: review.dugout_rating },
    { label: 'Fence', value: review.fence_rating },
    { label: 'Bleachers', value: review.bleacher_rating },
  ]

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-navy-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{userName || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-navy-600">{healthScore}%</div>
          <div className="text-sm text-gray-500">Health Score</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-4">
        {ratings.map((rating) => (
          <div key={rating.label} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{rating.label}</div>
            <div className="flex justify-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating.value ? 'text-yellow-400 fill-current' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {review.comment && (
        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{review.comment}</p>
      )}
    </div>
  )
}