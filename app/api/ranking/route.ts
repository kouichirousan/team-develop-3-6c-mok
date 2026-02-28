import { NextRequest, NextResponse } from 'next/server'
import { getWeeklyRankings, getUserRanking } from '@/lib/actions/ranking'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const weekStart = searchParams.get('weekStart') || undefined

    if (userId) {
      const ranking = await getUserRanking(userId, weekStart)
      return NextResponse.json({ ranking })
    }

    const rankings = await getWeeklyRankings(weekStart)
    return NextResponse.json({ rankings })
  } catch (error) {
    console.error('Ranking API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
