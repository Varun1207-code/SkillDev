import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
    const results: any = {
        tests: []
    }

    // Test 1: Prisma connection
    try {
        const count = await prisma.user.count()
        results.tests.push({ name: 'Prisma Connection', status: 'PASS', userCount: count })
    } catch (error) {
        results.tests.push({
            name: 'Prisma Connection',
            status: 'FAIL',
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        })
    }

    // Test 2: bcrypt
    try {
        const hash = await bcrypt.hash('test123', 10)
        const isValid = await bcrypt.compare('test123', hash)
        results.tests.push({ name: 'bcrypt', status: isValid ? 'PASS' : 'FAIL' })
    } catch (error) {
        results.tests.push({
            name: 'bcrypt',
            status: 'FAIL',
            error: error instanceof Error ? error.message : String(error)
        })
    }

    return NextResponse.json(results)
}
