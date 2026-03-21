import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data: fields } = await supabase
    .from('fields')
    .select('id, name, funding_goal, current_funding')
    .eq('needs_donation', true)
  
  const totalGoal = fields?.reduce((sum, f) => sum + (f.funding_goal || 0), 0) || 0
  const totalRaised = fields?.reduce((sum, f) => sum + (f.current_funding || 0), 0) || 0
  const progress = totalGoal > 0 ? Math.round((totalRaised / totalGoal) * 100) : 0
  
  return NextResponse.json({ fields: fields || [], totalGoal, totalRaised, progress })
}