export interface DocTopic {
    id: string
    title: string
    content: string
    code?: string
}

export interface DocCategory {
    title: string
    topics: DocTopic[]
}

export const docsData: DocCategory[] = [
    {
        title: 'Web Development',
        topics: [
            {
                id: 'html-basics',
                title: 'HTML Basics',
                content: 'HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets (CSS) and scripting languages such as JavaScript.',
                code: '<!DOCTYPE html>\n<html>\n<body>\n\n<h1>My First Heading</h1>\n<p>My first paragraph.</p>\n\n</body>\n</html>',
            },
            {
                id: 'css-basics',
                title: 'CSS Basics',
                content: 'Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in a markup language such as HTML. CSS is a cornerstone technology of the World Wide Web, alongside HTML and JavaScript.',
                code: 'body {\n  background-color: lightblue;\n}\n\nh1 {\n  color: white;\n  text-align: center;\n}',
            },
            {
                id: 'js-basics',
                title: 'JavaScript Basics',
                content: 'JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. As of 2022, 98% of websites use JavaScript on the client side for webpage behavior, often incorporating third-party libraries.',
                code: 'function myFunction() {\n  document.getElementById("demo").innerHTML = "Hello World";\n}',
            },
        ],
    },
    {
        title: 'Machine Learning',
        topics: [
            {
                id: 'ml-intro',
                title: 'What is ML?',
                content: 'Machine learning (ML) is a field of inquiry devoted to understanding and building methods that "learn", that is, methods that leverage data to improve performance on some set of tasks. It is seen as a part of artificial intelligence.',
            },
            {
                id: 'supervised-unsupervised',
                title: 'Supervised vs Unsupervised',
                content: 'Supervised learning is the machine learning task of learning a function that maps an input to an output based on example input-output pairs. Unsupervised learning is a type of machine learning that looks for previously undetected patterns in a data set with no pre-existing labels and with a minimum of human supervision.',
            },
            {
                id: 'ml-workflow',
                title: 'ML Workflow',
                content: 'The Machine Learning workflow typically involves: Data Collection, Data Preprocessing, Model Selection, Training, Evaluation, Parameter Tuning, and Prediction.',
            },
        ],
    },
]

export const docs: Record<string, DocTopic[]> = docsData.reduce((acc, category) => {
    acc[category.title] = category.topics
    return acc
}, {} as Record<string, DocTopic[]>)
