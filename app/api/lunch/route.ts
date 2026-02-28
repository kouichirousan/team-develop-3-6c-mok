import { NextRequest, NextResponse } from 'next/server'
import { 
  sendLunchInvitation, 
  respondToLunchInvitation,
  getPendingInvitations,
  getLunchHistory,
  getFoodFighterProgress
} from '@/lib/actions/lunch'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, partnerId, lunchDate, invitationId, accept } = body

    if (action === 'invite') {
      if (!userId || !partnerId || !lunchDate) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }
      const result = await sendLunchInvitation(userId, partnerId, lunchDate)
      return NextResponse.json(result)
    }

    if (action === 'respond') {
      if (!invitationId || !userId || accept === undefined) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }
      const result = await respondToLunchInvitation(invitationId, userId, accept)
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Lunch API error:', error)
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
    const type = searchParams.get('type')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (type === 'pending') {
      const invitations = await getPendingInvitations(userId)
      return NextResponse.json({ invitations })
    }

    if (type === 'history') {
      const history = await getLunchHistory(userId)
      return NextResponse.json({ history })
    }

    if (type === 'progress') {
      const progress = await getFoodFighterProgress(userId)
      return NextResponse.json({ progress })
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Lunch API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
