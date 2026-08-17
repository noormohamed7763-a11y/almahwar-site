import { NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth'
import { listAllServicesForAdmin } from '@/lib/servicesRepository'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const isValid = await verifySessionToken()
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // كل الخدمات بما فيها المخفية — لوحة التحكم تحتاج رؤيتها لتنشرها
    const services = await listAllServicesForAdmin()

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Admin API get services error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 },
    )
  }
}
