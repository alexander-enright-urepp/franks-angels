'use client'

import { useState, useEffect } from 'react'

export function FundraisingWidget() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/fundraising')
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-bold text-lg">Fundraising Progress</h3>
      <div className="mt-2">
        <div className="flex justify-between text-sm">
          <span>{(data.totalRaised || 0).toLocaleString()} raised</span>
          <span>{data.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded h-2 mt-1">
          <div className="bg-green-500 h-2 rounded" style={{ width: (data.progress || 0) + '%' }} />
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{(data.fields || []).length} fields need support</p>
    </div>
  )
}