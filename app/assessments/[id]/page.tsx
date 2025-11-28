import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AssessmentTaker from './AssessmentTaker';

export const dynamic = 'force-dynamic';

export default async function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) redirect('/login');
        const payload = await verifyJWT(token);
        if (!payload) redirect('/login');
    } catch {
        redirect('/login');
    }

    let assessment;
    try {
        const assessments: any[] = await prisma.$queryRaw`SELECT * FROM Assessment WHERE id = ${id}`;
        assessment = assessments[0];
    } catch (e) {
        console.error("Failed to fetch assessment", e);
    }

    if (!assessment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assessment Not Found</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">The assessment you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <AssessmentTaker assessment={assessment} />
        </div>
    );
}
