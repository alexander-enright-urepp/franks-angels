import Link from 'next/link'
import { MapPin, DollarSign } from 'lucide-react'
import { Field, calculateHealthScore, getHealthScoreColor, getHealthScoreLabel } from '@/lib/supabase'

interface FieldCardProps {
  field: Field
  healthScore?: number
  donationTotal?: number
  donationGoal?: number
}

export default function FieldCard({ field, healthScore, donationTotal = 0, donationGoal = 2000 }: FieldCardProps) {
  const score = healthScore || 0
  const scoreColor = getHealthScoreColor(score)
  const scoreLabel = getHealthScoreLabel(score)
  const donationProgress = Math.min((donationTotal / donationGoal) * 100, 100)

  return (
    <Link href={`/fields/${field.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200">
        <div className="h-48 bg-gray-200 relative">
          {field.photo_url ? (
            <img
              src={field.photo_url}
              alt={field.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-navy-100">
              <span className="text-navy-400 text-6xl font-bold">⚾</span>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-700">{field.sport_type}</span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{field.name}</h3>
          
          <div className="flex items-center gap-1 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{field.city}, {field.state}</span>
          </div>

          {healthScore !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Field Health</span>
                <span className={`text-sm font-bold ${
                  score >= 80 ? 'text-green-600' :
                  score >= 60 ? 'text-yellow-600' :
                  score >= 40 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {score}% - {scoreLabel}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${scoreColor}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          )}

          {donationTotal > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Donations</span>
                <span className="text-sm font-bold text-navy-600">
                  ${donationTotal.toLocaleString()} of ${donationGoal.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-navy-500"
                  style={{ width: `${donationProgress}%` }}
                />
              </div>
            </div>
          )}

          <button className="w-full bg-navy-500 hover:bg-navy-600 text-white py-2 rounded-lg font-medium transition-colors">
            View Field
          </button>
        </div>
      </div>
    </Link>
  )
}