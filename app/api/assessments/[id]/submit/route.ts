import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { answers } = body; // Record<string, string[]>

        // Fetch assessment
        const assessments: any[] = await prisma.$queryRaw`SELECT * FROM Assessment WHERE id = ${id}`;
        const assessment = assessments[0];

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        const questions = JSON.parse(assessment.questions);
        let score = 0;
        let total = questions.length;

        questions.forEach((q: any) => {
            const userAnswers = answers[q.id] || [];
            const correctAnswers = q.correctAnswers || [];

            // Simple scoring: exact match for now, or partial? 
            // Let's do exact match for multiple choice, or single match for single.

            if (q.type === 'single') {
                if (userAnswers.length > 0 && correctAnswers.includes(userAnswers[0])) {
                    score++;
                }
            } else {
                // Multiple choice: check if arrays match (ignoring order)
                if (userAnswers.length === correctAnswers.length &&
                    userAnswers.every((a: string) => correctAnswers.includes(a))) {
                    score++;
                }
            }
        });

        const percentage = Math.round((score / total) * 100);

        // Determine Level
        let level = 'Beginner';
        if (percentage >= 80) level = 'Advanced';
        else if (percentage >= 50) level = 'Intermediate';

        // Update User Score
        // We need to know which score to update based on assessment type
        // This is a bit loose, but let's try to map it.
        if (assessment.type === 'Web Development') {
            await prisma.$executeRaw`UPDATE User SET webDevScore = ${percentage}, webDevLevel = ${level} WHERE id = ${payload.id}`;
        } else if (assessment.type === 'Machine Learning') {
            await prisma.$executeRaw`UPDATE User SET mlScore = ${percentage}, mlLevel = ${level} WHERE id = ${payload.id}`;
        }

        // Recommendations
        const recommendations = getRecommendations(assessment.type, level);

        return NextResponse.json({
            score,
            total,
            percentage,
            level,
            recommendations
        });

    } catch (error) {
        console.error('Error submitting assessment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function getRecommendations(type: string, level: string) {
    const recs: any[] = [];

    if (type === 'Web Development') {
        if (level === 'Beginner') {
            recs.push({ title: 'The Web Developer Bootcamp', platform: 'Udemy', url: 'https://www.udemy.com/course/the-web-developer-bootcamp/' });
            recs.push({ title: 'HTML & CSS', platform: 'Codecademy', url: 'https://www.codecademy.com/learn/learn-html' });
        } else if (level === 'Intermediate') {
            recs.push({ title: 'Advanced React', platform: 'Coursera', url: 'https://www.coursera.org/learn/advanced-react' });
            recs.push({ title: 'Next.js & React - The Complete Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/nextjs-react-the-complete-guide/' });
        } else {
            recs.push({ title: 'Web Security', platform: 'Stanford Online', url: 'https://online.stanford.edu/courses/cs253-web-security' });
            recs.push({ title: 'Web Scraping with Python', platform: 'Udemy', url: 'https://www.udemy.com/course/web-scraping-with-python-beautifulsoup/' });
        }
    } else if (type === 'Machine Learning') {
        if (level === 'Beginner') {
            recs.push({ title: 'Machine Learning by Andrew Ng', platform: 'Coursera', url: 'https://www.coursera.org/specializations/machine-learning-introduction' });
            recs.push({ title: 'Intro to Machine Learning', platform: 'Kaggle', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' });
        } else if (level === 'Intermediate') {
            recs.push({ title: 'Deep Learning Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/deep-learning' });
            recs.push({ title: 'Hands-On Machine Learning', platform: 'O\'Reilly', url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/' });
        } else {
            recs.push({ title: 'Advanced Machine Learning Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/aml' });
            recs.push({ title: 'Papers with Code', platform: 'Research', url: 'https://paperswithcode.com/' });
        }
    } else {
        // Default / Data Science
        recs.push({ title: 'Data Science Methodology', platform: 'Coursera', url: 'https://www.coursera.org/learn/data-science-methodology' });
    }

    return recs;
}
