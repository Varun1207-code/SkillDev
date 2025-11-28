const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // Web Development Assessment
    const webDevQuestions = [
        {
            id: "q1",
            text: "What does HTML stand for?",
            type: "single",
            options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Markup Language"],
            correctAnswers: ["Hyper Text Markup Language"]
        },
        {
            id: "q2",
            text: "Which tag is used to define an internal style sheet?",
            type: "single",
            options: ["<css>", "<script>", "<style>", "<link>"],
            correctAnswers: ["<style>"]
        },
        {
            id: "q3",
            text: "Which property is used to change the background color?",
            type: "single",
            options: ["color", "bgcolor", "background-color", "bg-color"],
            correctAnswers: ["background-color"]
        },
        {
            id: "q4",
            text: "How do you select an element with id 'demo'?",
            type: "single",
            options: ["#demo", ".demo", "demo", "*demo"],
            correctAnswers: ["#demo"]
        },
        {
            id: "q5",
            text: "Which HTML attribute is used to define inline styles?",
            type: "single",
            options: ["class", "style", "font", "styles"],
            correctAnswers: ["style"]
        },
        {
            id: "q6",
            text: "Which is the correct CSS syntax?",
            type: "single",
            options: ["body {color: black;}", "{body;color:black;}", "body:color=black;", "{body:color=black;}"],
            correctAnswers: ["body {color: black;}"]
        },
        {
            id: "q7",
            text: "How do you write 'Hello World' in an alert box in JavaScript?",
            type: "single",
            options: ["msg('Hello World');", "alert('Hello World');", "msgBox('Hello World');", "alertBox('Hello World');"],
            correctAnswers: ["alert('Hello World');"]
        },
        {
            id: "q8",
            text: "Which operator is used to assign a value to a variable?",
            type: "single",
            options: ["*", "-", "=", "x"],
            correctAnswers: ["="]
        },
        {
            id: "q9",
            text: "Which event occurs when the user clicks on an HTML element?",
            type: "single",
            options: ["onchange", "onclick", "onmouseclick", "onmouseover"],
            correctAnswers: ["onclick"]
        },
        {
            id: "q10",
            text: "What is the correct way to write a JavaScript array?",
            type: "single",
            options: ["var colors = (1:'red', 2:'green', 3:'blue')", "var colors = ['red', 'green', 'blue']", "var colors = 'red', 'green', 'blue'", "var colors = 1 = ('red'), 2 = ('green'), 3 = ('blue')"],
            correctAnswers: ["var colors = ['red', 'green', 'blue']"]
        }
    ];

    await prisma.assessment.create({
        data: {
            title: "Web Development Fundamentals",
            description: "Test your knowledge of HTML, CSS, and JavaScript basics.",
            type: "Web Development",
            questions: JSON.stringify(webDevQuestions),
        },
    });

    // Machine Learning Assessment
    const mlQuestions = [
        {
            id: "m1",
            text: "What is Supervised Learning?",
            type: "single",
            options: ["Learning with labeled data", "Learning with unlabeled data", "Learning through rewards", "None of the above"],
            correctAnswers: ["Learning with labeled data"]
        },
        {
            id: "m2",
            text: "Which of the following is a classification algorithm?",
            type: "single",
            options: ["Linear Regression", "Logistic Regression", "K-Means Clustering", "PCA"],
            correctAnswers: ["Logistic Regression"]
        },
        {
            id: "m3",
            text: "What is Overfitting?",
            type: "single",
            options: ["Model performs well on training data but poor on test data", "Model performs poor on both", "Model performs well on test data but poor on training", "Model fits the data perfectly"],
            correctAnswers: ["Model performs well on training data but poor on test data"]
        },
        {
            id: "m4",
            text: "Which library is commonly used for Deep Learning?",
            type: "single",
            options: ["NumPy", "Pandas", "TensorFlow", "Matplotlib"],
            correctAnswers: ["TensorFlow"]
        },
        {
            id: "m5",
            text: "What does NLP stand for?",
            type: "single",
            options: ["Natural Language Processing", "Neural Language Programming", "New Learning Protocol", "Natural Learning Process"],
            correctAnswers: ["Natural Language Processing"]
        },
        {
            id: "m6",
            text: "What is the purpose of a Loss Function?",
            type: "single",
            options: ["To measure accuracy", "To measure error", "To increase speed", "To visualize data"],
            correctAnswers: ["To measure error"]
        },
        {
            id: "m7",
            text: "Which algorithm is used for clustering?",
            type: "single",
            options: ["Decision Trees", "K-Means", "SVM", "Naive Bayes"],
            correctAnswers: ["K-Means"]
        },
        {
            id: "m8",
            text: "What is a Neuron in Neural Networks?",
            type: "single",
            options: ["A basic unit of computation", "A database", "A python function", "A hardware component"],
            correctAnswers: ["A basic unit of computation"]
        },
        {
            id: "m9",
            text: "Which technique is used to reduce dimensionality?",
            type: "single",
            options: ["Regression", "Classification", "PCA (Principal Component Analysis)", "Clustering"],
            correctAnswers: ["PCA (Principal Component Analysis)"]
        },
        {
            id: "m10",
            text: "What is the output of a sigmoid function?",
            type: "single",
            options: ["Between 0 and 1", "Between -1 and 1", "Any real number", "0 or 1"],
            correctAnswers: ["Between 0 and 1"]
        }
    ];

    await prisma.assessment.create({
        data: {
            title: "Machine Learning Basics",
            description: "Assess your understanding of core ML concepts.",
            type: "Machine Learning",
            questions: JSON.stringify(mlQuestions),
        },
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
