import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Brain, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AssessmentsListPage() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) redirect('/login');
        const payload = await verifyJWT(token);
        if (!payload) redirect('/login');
    } catch {
        redirect('/login');
    }

    let assessments: any[] = [];
    try {
        assessments = await prisma.$queryRaw`SELECT * FROM Assessment ORDER BY createdAt DESC`;
    } catch (e) {
        console.error("Failed to fetch assessments", e);
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'Web Development': return <Code className="w-8 h-8 text-blue-500" />;
            case 'Machine Learning': return <Brain className="w-8 h-8 text-purple-500" />;
            case 'Data Science': return <Database className="w-8 h-8 text-green-500" />;
            default: return <BookOpen className="w-8 h-8 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skill Assessments</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Take assessments to verify your skills and get personalized course recommendations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((assessment) => (
                        <div key={assessment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    {getIcon(assessment.type)}
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                    {assessment.type}
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{assessment.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                                {assessment.description || 'No description available.'}
                            </p>
                            <Link
                                href={`/assessments/${assessment.id}`}
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    ))}
                    {assessments.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No assessments available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
