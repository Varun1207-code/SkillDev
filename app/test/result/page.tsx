'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, ArrowRight, Home } from 'lucide-react'

function ResultContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const score = searchParams.get('score')
    const total = searchParams.get('total')
    const percentage = searchParams.get('percentage')
    const level = searchParams.get('level')
    const track = searchParams.get('track')

    if (!score || !total || !percentage || !level) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 mb-4">Invalid result data.</p>
                <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500 inline-flex items-center">
                    <Home className="w-4 h-4 mr-2" /> Return to Dashboard
                </Link>
            </div>
        )
    }

    const percentageNum = parseFloat(percentage)

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-indigo-600 px-8 py-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="relative z-10 inline-block p-4 bg-white/20 backdrop-blur-lg rounded-full mb-6"
                >
                    <Trophy className="w-16 h-16 text-yellow-300" />
                </motion.div>
                <h1 className="relative z-10 text-3xl font-bold text-white mb-2">Assessment Complete!</h1>
                <p className="relative z-10 text-indigo-100">You've completed the {track} assessment.</p>
            </div>

            <div className="px-8 py-10">
                <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Score</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{score}/{total}</p>
                    </div>
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">Level</p>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{level}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/recommendations"
                        className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                    >
                        View Recommendations <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>

                    <Link
                        href="/dashboard"
                        className="w-full flex items-center justify-center px-6 py-4 border-2 border-gray-200 dark:border-gray-700 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function ResultPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <Suspense fallback={<div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div><p className="mt-4 text-gray-500">Calculating results...</p></div>}>
                <ResultContent />
            </Suspense>
        </div>
    )
}
