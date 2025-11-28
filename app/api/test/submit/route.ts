import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'
import { cookies } from 'next/headers'
import { webDevQuestions, mlQuestions } from '@/lib/questions'

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('token')?.value
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        const payload = await verifyJWT(token)
        if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

        const body = await request.json()
        const { track, answers } = body // answers: { [questionId]: optionIndex }

        if (!track || !answers) {
            return NextResponse.json({ error: 'Missing track or answers' }, { status: 400 })
        }

        const questions = track === 'web-development' ? webDevQuestions : mlQuestions
        let correctCount = 0

        questions.forEach((q) => {
            if (answers[q.id] === q.answer) {
                correctCount++
            }
        })

        const total = questions.length
        const percentage = (correctCount / total) * 100
        let level = 'Beginner'

        if (percentage > 75) {
            level = 'Advanced'
        } else if (percentage > 40) {
            level = 'Intermediate'
        }

        // Update user
        const updateData: any = {}
        if (track === 'web-development') {
            updateData.webDevLevel = level
            updateData.webDevScore = Math.round(percentage)
        } else {
            updateData.mlLevel = level
            updateData.mlScore = Math.round(percentage)
        }

        await prisma.user.update({
            where: { id: payload.userId as string },
            data: updateData,
        })

        return NextResponse.json({
            score: correctCount,
            total,
            percentage,
            level,
        })
    } catch (error) {
        console.error('Test submission error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
