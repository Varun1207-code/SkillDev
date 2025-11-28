import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.email !== 'admin@skilldev.com') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const assessments: any[] = await prisma.$queryRaw`SELECT * FROM Assessment WHERE id = ${id}`;
        const assessment = assessments[0];

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json(assessment);
    } catch (error) {
        console.error('Error fetching assessment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.email !== 'admin@skilldev.com') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.$executeRaw`DELETE FROM Assessment WHERE id = ${id}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting assessment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
