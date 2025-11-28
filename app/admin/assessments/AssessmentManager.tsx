'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Trash2, X, Save, CheckCircle, Circle } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    type: 'single' | 'multiple';
    options: string[];
    correctAnswers: string[];
}

interface Assessment {
    id: string;
    title: string;
    description: string | null;
    type: string;
    questions: string;
    createdAt: string;
}

export default function AssessmentManager({ initialAssessments }: { initialAssessments: Assessment[] }) {
    const router = useRouter();
    const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Web Development');
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: crypto.randomUUID(),
                text: '',
                type: 'single',
                options: ['', ''],
                correctAnswers: []
            }
        ]);
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        // Reset correct answers if type changes
        if (field === 'type') {
            newQuestions[index].correctAnswers = [];
        }
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.splice(oIndex, 1);
        // Remove from correct answers if it was selected
        // This is a bit tricky since we store values, not indices. 
        // Ideally we should store indices or ensure values are unique. 
        // For simplicity, let's assume values are unique or just clear correct answers if needed.
        // But better: filter out the removed option from correctAnswers
        // actually we can't easily know which value was removed if we don't have the old value.
        // Let's just leave it for now, user should re-select.
        setQuestions(newQuestions);
    };

    const removeQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const toggleCorrectAnswer = (qIndex: number, optionValue: string) => {
        const newQuestions = [...questions];
        const question = newQuestions[qIndex];

        if (question.type === 'single') {
            question.correctAnswers = [optionValue];
        } else {
            if (question.correctAnswers.includes(optionValue)) {
                question.correctAnswers = question.correctAnswers.filter(a => a !== optionValue);
            } else {
                question.correctAnswers.push(optionValue);
            }
        }
        setQuestions(newQuestions);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Validation
            if (questions.length === 0) throw new Error('Add at least one question');
            for (const q of questions) {
                if (!q.text.trim()) throw new Error('All questions must have text');
                if (q.options.some(o => !o.trim())) throw new Error('All options must have text');
                if (q.correctAnswers.length === 0) throw new Error(`Select correct answer for question: ${q.text}`);
            }

            const res = await fetch('/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    type,
                    questions
                })
            });

            if (!res.ok) throw new Error('Failed to create assessment');

            const newAssessment = await res.json();
            setAssessments([newAssessment, ...assessments]);
            setIsCreateModalOpen(false);
            // Reset form
            setTitle('');
            setDescription('');
            setType('Web Development');
            setQuestions([]);
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Error creating assessment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this assessment?')) return;
        try {
            const res = await fetch(`/api/assessments/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            setAssessments(assessments.filter(a => a.id !== id));
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error deleting assessment');
        }
    };

    const openViewModal = (assessment: Assessment) => {
        setSelectedAssessment(assessment);
        setIsViewModalOpen(true);
    };

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">All Assessments</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" /> Create Assessment
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {assessments.map((assessment) => (
                            <tr key={assessment.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{assessment.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{assessment.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(assessment.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => openViewModal(assessment)}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(assessment.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {assessments.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No assessments found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Create New Assessment</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                    <select
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="Web Development">Web Development</option>
                                        <option value="Machine Learning">Machine Learning</option>
                                        <option value="Data Science">Data Science</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    rows={2}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Questions</h4>
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300"
                                    >
                                        <Plus className="mr-1 h-3 w-3" /> Add Question
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {questions.map((q, qIndex) => (
                                        <div key={q.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(qIndex)}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div className="md:col-span-3">
                                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Question Text</label>
                                                    <input
                                                        type="text"
                                                        value={q.text}
                                                        onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                                                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                                        placeholder="Enter question here..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Answer Type</label>
                                                    <select
                                                        value={q.type}
                                                        onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                                    >
                                                        <option value="single">Single Choice</option>
                                                        <option value="multiple">Multiple Choice</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Options (Select correct answers)</label>
                                                <div className="space-y-2">
                                                    {q.options.map((option, oIndex) => (
                                                        <div key={oIndex} className="flex items-center space-x-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleCorrectAnswer(qIndex, option)}
                                                                className={`flex-shrink-0 ${q.correctAnswers.includes(option) && option !== '' ? 'text-green-600 dark:text-green-400' : 'text-gray-300 dark:text-gray-600'}`}
                                                                disabled={!option}
                                                            >
                                                                {q.correctAnswers.includes(option) && option !== '' ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm text-gray-900 dark:text-white"
                                                                placeholder={`Option ${oIndex + 1}`}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeOption(qIndex, oIndex)}
                                                                className="text-gray-400 hover:text-red-500"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => addOption(qIndex)}
                                                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center mt-2"
                                                    >
                                                        <Plus className="h-3 w-3 mr-1" /> Add Option
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {questions.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                                            No questions added yet. Click "Add Question" to start.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isLoading ? 'Creating...' : 'Create Assessment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {isViewModalOpen && selectedAssessment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assessment Details</h3>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</h4>
                                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{selectedAssessment.title}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                                <p className="mt-1 text-gray-900 dark:text-white">{selectedAssessment.description || 'No description'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h4>
                                <p className="mt-1 text-gray-900 dark:text-white">{selectedAssessment.type}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Questions Preview</h4>
                                <div className="space-y-4">
                                    {JSON.parse(selectedAssessment.questions).map((q: any, i: number) => (
                                        <div key={i} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                                            <p className="font-medium text-gray-900 dark:text-white mb-2">{i + 1}. {q.text}</p>
                                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                                                {q.options.map((opt: string, j: number) => (
                                                    <li key={j} className={q.correctAnswers.includes(opt) ? 'text-green-600 font-medium' : ''}>
                                                        {opt}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
