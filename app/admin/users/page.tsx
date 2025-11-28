import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic'; // ensure fresh data

export default async function UsersPage() {
    // Auth check – only admin can access
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) redirect('/login');
        const payload = await verifyJWT(token);
        if (!payload || payload.email !== 'admin@skilldev.com') redirect('/login');
    } catch {
        redirect('/login');
    }

    // Use raw query to be safe
    let users: any[] = [];
    try {
        users = await prisma.$queryRaw`SELECT id, name, email, semester FROM User ORDER BY name ASC`;
    } catch (e) {
        console.error("Failed to fetch users", e);
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Users Management</h1>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Name</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Email</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Semester</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{user.name}</td>
                                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{user.email}</td>
                                <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{user.semester}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6">
                <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    ← Back to Admin Panel <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
