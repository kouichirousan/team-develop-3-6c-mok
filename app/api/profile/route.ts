import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile, updateUserProfile, getUserStats } from '@/lib/actions/profile'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (type === 'stats') {
      const stats = await getUserStats(userId)
      return NextResponse.json({ stats })
    }

    const profile = await getUserProfile(userId)
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, ...updates } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const result = await updateUserProfile(userId, updates)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
