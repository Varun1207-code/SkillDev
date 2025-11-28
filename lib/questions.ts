export const webDevQuestions = [
    {
        id: 1,
        question: 'What does HTML stand for?',
        options: [
            'Hyper Text Preprocessor',
            'Hyper Text Markup Language',
            'Hyper Text Multiple Language',
            'Hyper Tool Multi Language',
        ],
        answer: 1,
    },
    {
        id: 2,
        question: 'Which of the following is correct about CSS?',
        options: [
            'CSS is used to control the style of a web document in a simple and easy-to-understand way.',
            'CSS is the acronym for "Cascading Style Sheet".',
            'You can write CSS once and then reuse same sheet in multiple HTML pages.',
            'All of the above.',
        ],
        answer: 3,
    },
    {
        id: 3,
        question: 'Which built-in method returns the length of the string?',
        options: ['length()', 'size()', 'index()', 'None of the above.'],
        answer: 0, // Actually in JS it's a property .length, but let's assume method for confusion or fix question. 
        // Wait, .length is a property. "length()" is wrong. 
        // Let's fix the question to be accurate.
        // "Which property returns the length of a string?"
    },
    // Let's make 10 questions as requested.
    {
        id: 4,
        question: 'Which tag is used to define an unordered list?',
        options: ['<ul>', '<ol>', '<li>', '<list>'],
        answer: 0,
    },
    {
        id: 5,
        question: 'What is the correct syntax for referring to an external script called "xxx.js"?',
        options: ['<script name="xxx.js">', '<script href="xxx.js">', '<script src="xxx.js">', '<script file="xxx.js">'],
        answer: 2,
    },
    {
        id: 6,
        question: 'Which HTML attribute is used to define inline styles?',
        options: ['class', 'style', 'font', 'styles'],
        answer: 1,
    },
    {
        id: 7,
        question: 'Which is the correct CSS syntax?',
        options: ['body:color=black', '{body;color:black}', 'body {color: black;}', '{body:color=black}'],
        answer: 2,
    },
    {
        id: 8,
        question: 'How do you create a function in JavaScript?',
        options: ['function = myFunction()', 'function myFunction()', 'function:myFunction()', 'create myFunction()'],
        answer: 1,
    },
    {
        id: 9,
        question: 'How to write an IF statement in JavaScript?',
        options: ['if i = 5 then', 'if i == 5 then', 'if (i == 5)', 'if i = 5'],
        answer: 2,
    },
    {
        id: 10,
        question: 'Which event occurs when the user clicks on an HTML element?',
        options: ['onchange', 'onclick', 'onmouseclick', 'onmouseover'],
        answer: 1,
    },
]

// Fix question 3
webDevQuestions[2] = {
    id: 3,
    question: 'Which property returns the length of a string in JavaScript?',
    options: ['length', 'size', 'index', 'count'],
    answer: 0,
}


export const mlQuestions = [
    {
        id: 1,
        question: 'What is Machine Learning?',
        options: [
            'The autonomous acquisition of knowledge through the use of computer programs',
            'The autonomous acquisition of knowledge through the use of manual programs',
            'The selective acquisition of knowledge through the use of computer programs',
            'The selective acquisition of knowledge through the use of manual programs',
        ],
        answer: 0,
    },
    {
        id: 2,
        question: 'Which of the following is a Supervised Learning algorithm?',
        options: ['K-Means', 'Linear Regression', 'Apriori', 'PCA'],
        answer: 1,
    },
    {
        id: 3,
        question: 'What is Overfitting?',
        options: [
            'When the model performs well on training data but poor on test data',
            'When the model performs poor on training data but well on test data',
            'When the model performs poor on both',
            'When the model performs well on both',
        ],
        answer: 0,
    },
    {
        id: 4,
        question: 'Which library is primarily used for deep learning?',
        options: ['Pandas', 'NumPy', 'TensorFlow', 'Matplotlib'],
        answer: 2,
    },
    {
        id: 5,
        question: 'What does NLP stand for?',
        options: ['Natural Language Processing', 'Neural Language Processing', 'Natural Learning Processing', 'Neural Learning Processing'],
        answer: 0,
    },
    {
        id: 6,
        question: 'Which algorithm is used for classification?',
        options: ['Linear Regression', 'Logistic Regression', 'K-Means', 'Apriori'],
        answer: 1,
    },
    {
        id: 7,
        question: 'What is a "Feature" in ML?',
        options: ['An input variable', 'An output variable', 'A model parameter', 'A hyperparameter'],
        answer: 0,
    },
    {
        id: 8,
        question: 'Which of these is NOT a type of Machine Learning?',
        options: ['Supervised', 'Unsupervised', 'Reinforcement', 'Deduced'],
        answer: 3,
    },
    {
        id: 9,
        question: 'What is the purpose of a training set?',
        options: ['To test the model', 'To train the model', 'To validate the model', 'To deploy the model'],
        answer: 1,
    },
    {
        id: 10,
        question: 'Which metric is commonly used for regression problems?',
        options: ['Accuracy', 'F1 Score', 'Mean Squared Error', 'Precision'],
        answer: 2,
    },
]

export const questions: Record<string, typeof webDevQuestions> = {
    'Web Development': webDevQuestions,
    'Machine Learning': mlQuestions,
}
