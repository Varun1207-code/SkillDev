import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import AssessmentManager from './AssessmentManager';

export const dynamic = 'force-dynamic';

export default async function AssessmentsPage() {
    // Auth guard – admin only
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) redirect('/login');
        const payload = await verifyJWT(token);
        if (!payload || payload.email !== 'admin@skilldev.com') redirect('/login');
    } catch {
        redirect('/login');
    }

    // Fetch assessments using raw query
    let assessments: any[] = [];
    try {
        assessments = await prisma.$queryRaw`SELECT * FROM Assessment ORDER BY createdAt DESC`;
        // Convert dates to strings for serialization
        assessments = assessments.map(a => ({
            ...a,
            createdAt: new Date(a.createdAt).toISOString(),
            updatedAt: new Date(a.updatedAt).toISOString()
        }));
    } catch (e) {
        console.error("Failed to fetch assessments", e);
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Assessments Management</h1>

            <AssessmentManager initialAssessments={assessments} />

            <div className="mt-6">
                <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    ← Back to Admin Panel <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
