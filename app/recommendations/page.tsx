import { cookies } from 'next/headers'
import { verifyJWT } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { courses } from '@/lib/courses'
import { ExternalLink, BookOpen, Star, Code, Brain } from 'lucide-react'

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

export default async function RecommendationsPage() {
    const user = await getUser()
    if (!user) redirect('/login')

    const webDevLevel = user.webDevLevel || 'Beginner'
    const mlLevel = user.mlLevel || 'Beginner'

    const webDevCourses = courses.filter(
        (c) => c.track === 'Web Development' && c.difficulty === webDevLevel
    )
    const mlCourses = courses.filter(
        (c) => c.track === 'Machine Learning' && c.difficulty === mlLevel
    )

    const CourseCard = ({ course }: { course: typeof courses[0] }) => (
        <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${course.track === 'Web Development'
                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                    {course.track === 'Web Development' ? <Code className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${course.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                    {course.difficulty}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {course.title}
            </h3>

            <div className="mt-auto pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" /> {course.platform}
                </p>
                <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors"
                >
                    Start Learning <ExternalLink className="ml-2 w-4 h-4" />
                </a>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                        Recommended For You
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        Curated courses based on your current skill levels.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Web Dev Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Web Development
                                <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
                                    ({webDevLevel})
                                </span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {webDevCourses.map((course, index) => (
                                <CourseCard key={index} course={course} />
                            ))}
                        </div>
                    </section>

                    {/* ML Section */}
                    <section>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="h-8 w-1 bg-purple-600 rounded-full"></div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Machine Learning
                                <span className="ml-3 text-sm font-normal text-gray-500 dark:text-gray-400">
                                    ({mlLevel})
                                </span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mlCourses.map((course, index) => (
                                <CourseCard key={index} course={course} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
