import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password, semester, tracks } = body

        if (!name || !email || !password || !semester || !tracks) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                semester,
                tracks: JSON.stringify(tracks), // Store as JSON string
            },
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json(userWithoutPassword)
    } catch (error) {
        console.error('=== REGISTRATION ERROR ===')
        console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error)
        console.error('Error message:', error instanceof Error ? error.message : String(error))
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
        console.error('Full error object:', error)
        console.error('========================')
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
