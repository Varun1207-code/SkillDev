import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT, signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload || payload.email !== 'admin@skilldev.com') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // Check if email is taken by another user
        const existingUsers: any[] = await prisma.$queryRaw`SELECT * FROM User WHERE email = ${email} AND id != ${payload.id}`;
        if (existingUsers.length > 0) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.$executeRaw`
                UPDATE User 
                SET name = ${name}, email = ${email}, password = ${hashedPassword}
                WHERE id = ${payload.id}
            `;
        } else {
            await prisma.$executeRaw`
                UPDATE User 
                SET name = ${name}, email = ${email}
                WHERE id = ${payload.id}
            `;
        }

        // If email changed, issue a new token
        if (email !== payload.email) {
            const newToken = await signJWT({ ...payload, email, name });
            cookieStore.set('token', newToken, { httpOnly: true, path: '/' });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
