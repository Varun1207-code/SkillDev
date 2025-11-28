'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Award, BookOpen, ExternalLink } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    type: 'single' | 'multiple';
    options: string[];
}

interface Assessment {
    id: string;
    title: string;
    description: string;
    type: string;
    questions: string; // JSON string
}

interface Result {
    score: number;
    total: number;
    percentage: number;
    level: string;
    recommendations: {
        title: string;
        platform: string;
        url: string;
    }[];
}

export default function AssessmentTaker({ assessment }: { assessment: Assessment }) {
    const router = useRouter();
    const questions: Question[] = JSON.parse(assessment.questions);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<Result | null>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleOptionSelect = (option: string) => {
        const currentAnswers = answers[currentQuestion.id] || [];
        let newAnswers: string[];

        if (currentQuestion.type === 'single') {
            newAnswers = [option];
        } else {
            if (currentAnswers.includes(option)) {
                newAnswers = currentAnswers.filter(a => a !== option);
            } else {
                newAnswers = [...currentAnswers, option];
            }
        }

        setAnswers({ ...answers, [currentQuestion.id]: newAnswers });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (!confirm('Are you sure you want to submit your assessment?')) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/assessments/${assessment.id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });

            if (!res.ok) throw new Error('Failed to submit assessment');

            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert('Error submitting assessment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-indigo-600 p-8 text-center text-white">
                    <Award className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                    <h2 className="text-3xl font-bold mb-2">Assessment Completed!</h2>
                    <p className="text-indigo-100">You have successfully finished the {assessment.title}.</p>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Score</p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.score} / {result.total}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Percentage</p>
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result.percentage}%</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Level</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{result.level}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2" /> Recommended Courses
                        </h3>
                        <div className="space-y-4">
                            {result.recommendations.map((rec, index) => (
                                <a
                                    key={index}
                                    href={rec.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                {rec.title}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{rec.platform}</p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={() => router.push('/assessments')}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Back to Assessments
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {assessment.type}
                </span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[400px] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {currentQuestion.text}
                </h2>

                <div className="space-y-3 flex-grow">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = (answers[currentQuestion.id] || []).includes(option);
                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(option)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center ${isSelected
                                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <div className={`flex-shrink-0 mr-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                                    {currentQuestion.type === 'single' ? (
                                        isSelected ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />
                                    ) : (
                                        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                    )}
                                </div>
                                <span className={`text-lg ${isSelected ? 'text-indigo-900 dark:text-indigo-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {option}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentQuestionIndex === 0
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </button>

                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                        >
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
