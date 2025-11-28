import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    // Auth guard – admin only
    let user;
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) redirect('/login');
        const payload = await verifyJWT(token);
        if (!payload || payload.email !== 'admin@skilldev.com') redirect('/login');

        // Fetch user details
        const users: any[] = await prisma.$queryRaw`SELECT id, name, email FROM User WHERE id = ${payload.id}`;
        user = users[0];
    } catch {
        redirect('/login');
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Platform Settings</h1>

            <SettingsForm user={user} />

            <div className="mt-6">
                <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    ← Back to Admin Panel <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
