import { cookies } from 'next/headers'
import { verifyJWT } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'
import { Code, Brain, BookOpen, MessageSquare, Award, ArrowRight } from 'lucide-react'

async function getUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    const payload = await verifyJWT(token)
    if (!payload) return null
    const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
    })
    return user
}

export default async function DashboardPage() {
    const user = await getUser()
    if (!user) redirect('/login')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                SkillDev
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {user.semester} Semester
                                </span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Track your progress and master new skills.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Skill Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Your Skills
                        </h2>

                        {/* Web Dev Card */}
                        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Code className="w-24 h-24 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                        <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Web Development
                                    </h3>
                                </div>
                                <div className="flex items-end space-x-2 mb-6">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {user.webDevLevel}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        Current Level
                                    </span>
                                </div>
                                <Link
                                    href="/assessments"
                                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors"
                                >
                                    Take Assessment <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* ML Card */}
                        <div className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Brain className="w-24 h-24 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Machine Learning
                                    </h3>
                                </div>
                                <div className="flex items-end space-x-2 mb-6">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {user.mlLevel}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        Current Level
                                    </span>
                                </div>
                                <Link
                                    href="/assessments"
                                    className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 transition-colors"
                                >
                                    Take Assessment <ArrowRight className="ml-1 w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Quick Actions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Quick Actions
                        </h2>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-2">
                            <Link
                                href="/recommendations"
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                                    <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Recommendations</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">View curated courses</p>
                                </div>
                            </Link>

                            <Link
                                href="/docs"
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Documentation</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Read learning materials</p>
                                </div>
                            </Link>

                            <Link
                                href="/chat"
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                                    <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">AI Assistant</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Get instant help</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
