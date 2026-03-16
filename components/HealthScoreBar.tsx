import { getHealthScoreColor, getHealthScoreLabel } from '@/lib/supabase'

interface HealthScoreBarProps {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function HealthScoreBar({ score, showLabel = true, size = 'md' }: HealthScoreBarProps) {
  const scoreColor = getHealthScoreColor(score)
  const scoreLabel = getHealthScoreLabel(score)
  
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2'
  const textClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className={`font-medium text-gray-700 ${textClass}`}>Field Health Score</span>
          <span className={`font-bold ${textClass} ${
            score >= 80 ? 'text-green-600' :
            score >= 60 ? 'text-yellow-600' :
            score >= 40 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {score}% - {scoreLabel}
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full ${scoreColor} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}