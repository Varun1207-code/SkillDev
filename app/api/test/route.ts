import { NextResponse } from 'next/server'

export async function GET() {
    try {
        return NextResponse.json({
            status: 'API is working',
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        return NextResponse.json({ error: 'Test failed' }, { status: 500 })
    }
}
