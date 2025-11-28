'use client'

import { useState, useEffect } from 'react'
import { docs } from '@/lib/docs'
import { Book, ChevronRight, Menu, X, ExternalLink, Loader2, Globe } from 'lucide-react'
import PageHeader from '@/components/PageHeader'

// Curated documentation sources
const externalSources = [
    { name: 'MDN - HTML', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', category: 'Web Development' },
    { name: 'MDN - CSS', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS', category: 'Web Development' },
    { name: 'MDN - JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', category: 'Web Development' },
    { name: 'React Documentation', url: 'https://react.dev/learn', category: 'Web Development' },
    { name: 'Next.js Documentation', url: 'https://nextjs.org/docs', category: 'Web Development' },
    { name: 'TailwindCSS', url: 'https://tailwindcss.com/docs', category: 'Web Development' },
    { name: 'Python Tutorial', url: 'https://docs.python.org/3/tutorial/', category: 'Machine Learning' },
    { name: 'NumPy Documentation', url: 'https://numpy.org/doc/stable/', category: 'Machine Learning' },
    { name: 'Pandas Guide', url: 'https://pandas.pydata.org/docs/user_guide/', category: 'Machine Learning' },
    { name: 'Scikit-learn', url: 'https://scikit-learn.org/stable/user_guide.html', category: 'Machine Learning' },
]

export default function DocsPage() {
    const [activeCategory, setActiveCategory] = useState<string>(Object.keys(docs)[0])
    const [activeTopicIndex, setActiveTopicIndex] = useState(0)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [selectedSource, setSelectedSource] = useState<string>('')
    const [externalContent, setExternalContent] = useState<{ title: string; content: string; url: string } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showExternal, setShowExternal] = useState(false)

    const currentCategoryDocs = docs[activeCategory] || []
    const currentDoc = currentCategoryDocs[activeTopicIndex]

    // Auto-fetch when a source is selected
    useEffect(() => {
        if (selectedSource) {
            fetchExternalDocs(selectedSource)
        }
    }, [selectedSource])

    const fetchExternalDocs = async (url: string) => {
        setLoading(true)
        setError('')
        setShowExternal(true)

        try {
            const res = await fetch('/api/fetch-docs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })

            if (res.ok) {
                const data = await res.json()
                setExternalContent(data)
            } else {
                const data = await res.json()
                setError(data.error || 'Failed to fetch documentation')
                setShowExternal(false)
            }
        } catch {
            setError('Failed to fetch documentation')
            setShowExternal(false)
        } finally {
            setLoading(false)
        }
    }

    const groupedSources = externalSources.reduce((acc, source) => {
        if (!acc[source.category]) {
            acc[source.category] = []
        }
        acc[source.category].push(source)
        return acc
    }, {} as Record<string, typeof externalSources>)

    // Render main area content (extracted from nested ternary for clarity)
    const renderInner = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Loading documentation...</p>
                    </div>
                </div>
            )
        }

        if (showExternal && externalContent) {
            return (
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {externalContent.title}
                        </h1>
                        <a
                            href={externalContent.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            <ExternalLink className="w-3 h-3" />
                            <span>View original source</span>
                        </a>
                    </div>
                    <div
                        className="external-docs-content bg-gray-800 dark:bg-gray-700 rounded-xl p-8 shadow-sm border border-gray-600 dark:border-gray-600"
                        dangerouslySetInnerHTML={{ __html: externalContent.content }}
                    />

                    <style>{`
                        /* Base Styles */
                        .external-docs-content { line-height: 1.7; }
                        .external-docs-content .doc-heading,
                        .external-docs-content h1,
                        .external-docs-content h2,
                        .external-docs-content h3,
                        .external-docs-content h4,
                        .external-docs-content h5,
                        .external-docs-content h6 {
                            font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: hsl(220, 43%, 92%);
                        }
                        .dark .external-docs-content .doc-heading,
                        .dark .external-docs-content h1,
                        .dark .external-docs-content h2,
                        .dark .external-docs-content h3,
                        .dark .external-docs-content h4,
                        .dark .external-docs-content h5,
                        .dark .external-docs-content h6 { color: hsl(220, 43%, 92%); }
                        .external-docs-content h1 { font-size: 2.25rem; }
                        .external-docs-content h2 { font-size: 1.875rem; }
                        .external-docs-content h3 { font-size: 1.5rem; }
                        .external-docs-content h4 { font-size: 1.25rem; }
                        .external-docs-content h5 { font-size: 1.125rem; }
                        .external-docs-content h6 { font-size: 1rem; }
                        .external-docs-content p { margin-bottom: 1rem; color: hsl(220, 13%, 75%); }
                        .dark .external-docs-content p { color: hsl(220, 13%, 75%); }
                        .external-docs-content .doc-list, .external-docs-content ul, .external-docs-content ol { margin: 1rem 0; padding-left: 2rem; color: hsl(220, 13%, 75%); }
                        .dark .external-docs-content .doc-list, .dark .external-docs-content ul, .dark .external-docs-content ol { color: hsl(220, 13%, 75%); }
                        .external-docs-content li { margin-bottom: 0.5rem; }
                        .external-docs-content .doc-code, .external-docs-content pre, .external-docs-content code {
                            background: hsl(222, 47%, 11%); color: hsl(210, 13%, 98%); border-radius: 0.375rem; font-family: 'Courier New', monospace;
                        }
                        .external-docs-content pre { padding: 1rem; overflow-x: auto; margin: 1.5rem 0; border: 1px solid hsl(210, 11%, 20%); }
                        .external-docs-content code { padding: 0.125rem 0.375rem; font-size: 0.875rem; }
                        .external-docs-content pre code { padding: 0; background: transparent; border: none; }
                        .external-docs-content .doc-link, .external-docs-content a { color: hsl(217, 91%, 60%); text-decoration: underline; }
                        .dark .external-docs-content .doc-link, .dark .external-docs-content a { color: hsl(217, 91%, 60%); }
                        .external-docs-content a:hover { color: hsl(217, 100%, 70%); }
                        .dark .external-docs-content a:hover { color: hsl(217, 100%, 70%); }
                        .external-docs-content blockquote { border-left: 4px solid hsl(217, 91%, 60%); padding-left: 1rem; margin: 1.5rem 0; color: hsl(220, 13%, 65%); font-style: italic; }
                        .dark .external-docs-content blockquote { border-left-color: hsl(217, 91%, 60%); color: hsl(220, 13%, 65%); }
                        .external-docs-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
                        .external-docs-content th, .external-docs-content td { border: 1px solid hsl(220, 13%, 30%); padding: 0.75rem; text-align: left; }
                        .dark .external-docs-content th, .dark .external-docs-content td { border-color: hsl(220, 13%, 30%); }
                        .external-docs-content th { background: hsl(222, 47%, 20%); font-weight: 600; color: hsl(220, 43%, 92%); }
                        .dark .external-docs-content th { background: hsl(222, 47%, 20%); color: hsl(220, 43%, 92%); }
                        .external-docs-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.5rem 0; }
                    `}</style>
                </div>
            )
        }

        return (
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {currentDoc?.title}
                </h1>
                <div className="prose prose-blue dark:prose-invert max-w-none bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                    {currentDoc?.content.split('\n\n').map((paragraph, idx) => {
                        const key = `${currentDoc?.id ?? 'doc'}-${idx}-${paragraph.slice(0, 30)}`
                        if (paragraph.startsWith('```')) {
                            const code = paragraph.replaceAll('```', '').trim()
                            return (
                                <pre key={key} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                                    <code>{code}</code>
                                </pre>
                            )
                        }
                        return (
                            <p key={key} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                {paragraph}
                            </p>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <PageHeader title="Documentation" />

            <div className="flex flex-1 flex-col md:flex-row">
                {/* Mobile Header */}
                <div className="md:hidden bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between sticky top-16 z-20">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Sidebar */}
                <aside className={`
            fixed inset-y-0 left-0 z-10 w-72 bg-white dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen overflow-y-auto
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-8">
                            <Book className="w-6 h-6 mr-2 text-blue-600" /> Documentation
                        </h2>

                        {/* External Sources */}
                        <div className="mb-8">
                            <div className="flex items-center space-x-2 mb-4">
                                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    External Resources
                                </h3>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                {Object.entries(groupedSources).map(([category, sources]) => (
                                    <div key={category}>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                            {category}
                                        </h4>
                                        <div className="space-y-1">
                                            {sources.map((source) => (
                                                <button
                                                    key={source.url}
                                                    onClick={() => {
                                                        setSelectedSource(source.url)
                                                        setMobileMenuOpen(false)
                                                    }}
                                                    disabled={loading}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-center justify-between group ${selectedSource === source.url && showExternal
                                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                                                        : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-500'
                                                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    <span className="flex-1">{source.name}</span>
                                                    {selectedSource === source.url && loading ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Built-in Docs Navigation */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Book className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Built-in Guides
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {Object.keys(docs).map((category) => (
                                    <div key={category}>
                                        <button
                                            type="button"
                                            className={`text-xs font-semibold uppercase tracking-wider mb-2 w-full text-left transition-colors ${activeCategory === category && !showExternal
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-500 dark:text-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                            onClick={() => {
                                                setActiveCategory(category)
                                                setShowExternal(false)
                                                setSelectedSource('')
                                            }}
                                        >
                                            {category}
                                        </button>

                                        {activeCategory === category && !showExternal && (
                                            <ul className="space-y-1">
                                                {docs[category].map((doc, index) => (
                                                    <li key={doc.id ?? doc.title}>
                                                        <button
                                                            onClick={() => {
                                                                setActiveTopicIndex(index)
                                                                setMobileMenuOpen(false)
                                                            }}
                                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${activeTopicIndex === index
                                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                                }`}
                                                        >
                                                            {doc.title}
                                                            {activeTopicIndex === index && <ChevronRight className="w-4 h-4" />}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {renderInner()}
                </main>
            </div>
        </div>
    )
}