export interface Course {
    id: string
    title: string
    platform: string
    url: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    track: 'Web Development' | 'Machine Learning'
}

export const courses: Course[] = [
    // Web Development - Beginner
    {
        id: 'web-beg-1',
        title: 'HTML & CSS Crash Course',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
        difficulty: 'Beginner',
        track: 'Web Development',
    },
    {
        id: 'web-beg-2',
        title: 'JavaScript for Beginners',
        platform: 'Udemy',
        url: 'https://www.udemy.com/course/javascript-essentials/',
        difficulty: 'Beginner',
        track: 'Web Development',
    },
    // Web Development - Intermediate
    {
        id: 'web-int-1',
        title: 'React - The Complete Guide',
        platform: 'Udemy',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        difficulty: 'Intermediate',
        track: 'Web Development',
    },
    {
        id: 'web-int-2',
        title: 'Next.js 14 Full Course',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA',
        difficulty: 'Intermediate',
        track: 'Web Development',
    },
    // Web Development - Advanced
    {
        id: 'web-adv-1',
        title: 'Advanced React Patterns',
        platform: 'Frontend Masters',
        url: 'https://frontendmasters.com/courses/advanced-react-patterns/',
        difficulty: 'Advanced',
        track: 'Web Development',
    },
    {
        id: 'web-adv-2',
        title: 'Web Performance Optimization',
        platform: 'Google Developers',
        url: 'https://web.dev/learn/performance/',
        difficulty: 'Advanced',
        track: 'Web Development',
    },

    // Machine Learning - Beginner
    {
        id: 'ml-beg-1',
        title: 'Machine Learning for Everybody',
        platform: 'YouTube',
        url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
        difficulty: 'Beginner',
        track: 'Machine Learning',
    },
    {
        id: 'ml-beg-2',
        title: 'Intro to Machine Learning',
        platform: 'Kaggle',
        url: 'https://www.kaggle.com/learn/intro-to-machine-learning',
        difficulty: 'Beginner',
        track: 'Machine Learning',
    },
    // Machine Learning - Intermediate
    {
        id: 'ml-int-1',
        title: 'Machine Learning A-Z',
        platform: 'Udemy',
        url: 'https://www.udemy.com/course/machinelearning/',
        difficulty: 'Intermediate',
        track: 'Machine Learning',
    },
    {
        id: 'ml-int-2',
        title: 'Deep Learning Specialization',
        platform: 'Coursera',
        url: 'https://www.coursera.org/specializations/deep-learning',
        difficulty: 'Intermediate',
        track: 'Machine Learning',
    },
    // Machine Learning - Advanced
    {
        id: 'ml-adv-1',
        title: 'Advanced Machine Learning Specialization',
        platform: 'Coursera',
        url: 'https://www.coursera.org/specializations/aml',
        difficulty: 'Advanced',
        track: 'Machine Learning',
    },
    {
        id: 'ml-adv-2',
        title: 'Reinforcement Learning',
        platform: 'Udacity',
        url: 'https://www.udacity.com/course/reinforcement-learning--ud600',
        difficulty: 'Advanced',
        track: 'Machine Learning',
    },
]
