'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { questions } from '@/lib/questions'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const trackParam = params.track as string;
  const track = trackParam === 'web-development' ? 'Web Development' : 'Machine Learning';
  const trackQuestions = questions[track] || [];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestionIndex < trackQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track, answers }),
      });
      if (res.ok) {
        const data = await res.json();
        const query = new URLSearchParams({
          score: data.score.toString(),
          total: data.total.toString(),
          percentage: data.percentage.toString(),
          level: data.level,
          track: track,
        }).toString();
        router.push(`/test/result?${query}`);
      } else {
        alert('Failed to submit test');
      }
    } catch {
      alert('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (trackQuestions.length === 0) {
    return <div className="p-8 text-center">No questions found for this track.</div>;
  }

  const currentQuestion = trackQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / trackQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{track} Assessment</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Question {currentQuestionIndex + 1} of {trackQuestions.length}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {Math.round(progress)}% Completed
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
          <motion.div
            className="bg-indigo-600 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: progress + '%' }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{currentQuestion.question}</h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestionIndex] === index;
                return (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={
                      'cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center space-x-4 ' +
                      (isSelected
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-500'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-gray-50 dark:hover:bg-gray-800/50')
                    }
                  >
                    <div
                      className={
                        'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ' +
                        (isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 dark:border-gray-600')
                      }
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <span className={
                      'text-base ' +
                      (isSelected ? 'font-medium text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-300')
                    }>
                      {option}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end">
          {currentQuestionIndex < trackQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestionIndex] === undefined}
              className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              Next Question <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answers[currentQuestionIndex] === undefined || submitting}
              className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <>Submit Assessment <CheckCircle2 className="ml-2 h-5 w-1" /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
