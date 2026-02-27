import { NextRequest, NextResponse } from 'next/server'
import { checkIn, checkOut, getActiveCheckIn } from '@/lib/actions/checkin'

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (action === 'check-in') {
      const result = await checkIn(userId)
      return NextResponse.json(result)
    } else if (action === 'check-out') {
      const result = await checkOut(userId)
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Check-in API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const activeCheckIn = await getActiveCheckIn(userId)
    return NextResponse.json({ activeCheckIn })
  } catch (error) {
    console.error('Get check-in API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
