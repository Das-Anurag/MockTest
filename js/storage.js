// ======================================================
// Mock Test - Storage System
// ======================================================

// Name used by localStorage
const QUESTION_STORAGE_KEY = "mockTestQuestions";


// ------------------------------------------------------
// Get all questions
// ------------------------------------------------------

function getQuestions() {

    const data = localStorage.getItem(QUESTION_STORAGE_KEY);

    if (!data) {
        return [];
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Could not read questions:", error);
        return [];
    }
}


// ------------------------------------------------------
// Save all questions
// ------------------------------------------------------

function saveQuestions(questions) {

    localStorage.setItem(
        QUESTION_STORAGE_KEY,
        JSON.stringify(questions)
    );
}


// ------------------------------------------------------
// Add a new question
// ------------------------------------------------------

function addQuestion(question) {

    const questions = getQuestions();

    question.id = Date.now().toString();

    questions.push(question);

    saveQuestions(questions);

    return question;
}


// ------------------------------------------------------
// Update an existing question
// ------------------------------------------------------

function updateQuestion(updatedQuestion) {

    const questions = getQuestions();

    const index = questions.findIndex(
        question => question.id === updatedQuestion.id
    );

    if (index === -1) {
        return false;
    }

    questions[index] = updatedQuestion;

    saveQuestions(questions);

    return true;
}


// ------------------------------------------------------
// Delete a question
// ------------------------------------------------------

function deleteQuestion(id) {

    const questions = getQuestions();

    const newQuestions = questions.filter(
        question => question.id !== id
    );

    saveQuestions(newQuestions);
}


// ------------------------------------------------------
// Find one question
// ------------------------------------------------------

function getQuestionById(id) {

    const questions = getQuestions();

    return questions.find(
        question => question.id === id
    );
}


// ------------------------------------------------------
// Delete all questions
// ------------------------------------------------------

function clearAllQuestions() {

    localStorage.removeItem(QUESTION_STORAGE_KEY);
}
