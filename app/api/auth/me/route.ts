import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyJWT } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const payload = await verifyJWT(token)

    if (!payload || !payload.userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({ user: userWithoutPassword })
    } catch (error) {
        console.error('Me error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
