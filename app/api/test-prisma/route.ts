import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const count = await prisma.user.count()
        return NextResponse.json({
            status: 'Prisma is working',
            userCount: count
        })
    } catch (error) {
        return NextResponse.json({
            error: 'Prisma failed',
            message: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
