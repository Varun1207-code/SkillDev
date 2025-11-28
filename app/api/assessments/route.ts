import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.email !== 'admin@skilldev.com') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const assessments = await prisma.$queryRaw`SELECT * FROM Assessment ORDER BY createdAt DESC`;

        return NextResponse.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.email !== 'admin@skilldev.com') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { title, description, type, questions } = body;

        if (!title || !type || !questions) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const id = crypto.randomUUID();
        const now = new Date();

        await prisma.$executeRaw`
            INSERT INTO Assessment (id, title, description, type, questions, createdAt, updatedAt)
            VALUES (${id}, ${title}, ${description}, ${type}, ${JSON.stringify(questions)}, ${now}, ${now})
        `;

        return NextResponse.json({ id, title, description, type, questions: JSON.stringify(questions), createdAt: now });
    } catch (error) {
        console.error('Error creating assessment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
