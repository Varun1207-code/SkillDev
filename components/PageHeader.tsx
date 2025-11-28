'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home } from 'lucide-react'

interface PageHeaderProps {
    title?: string
    showBack?: boolean
    showDashboard?: boolean
}

export default function PageHeader({ title, showBack = true, showDashboard = true }: PageHeaderProps) {
    const router = useRouter()

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {showBack && (
                            <button
                                onClick={() => router.back()}
                                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </button>
                        )}
                        {title && (
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {title}
                            </h1>
                        )}
                    </div>
                    {showDashboard && (
                        <Link
                            href="/dashboard"
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Dashboard</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
