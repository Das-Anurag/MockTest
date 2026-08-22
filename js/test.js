"test.js"

// ======================================================
// Mock Test - Test Engine
// ======================================================


// ------------------------------------------------------
// Test configuration
// ------------------------------------------------------

const TEST_DURATION_MINUTES = 20;


// ------------------------------------------------------
// Questions
// ------------------------------------------------------

const questions = getQuestions();


// ------------------------------------------------------
// Test state
// ------------------------------------------------------

let currentQuestionIndex = 0;

let answers = {};

let markedForReview = {};

let timeSpent = {};

let questionStartTime = Date.now();

let remainingSeconds =
    TEST_DURATION_MINUTES * 60;

let timerInterval = null;

let testSubmitted = false;


// ------------------------------------------------------
// HTML elements
// ------------------------------------------------------

const progressText =
    document.getElementById(
        "progressText"
    );


const timer =
    document.getElementById(
        "timer"
    );


const questionNumber =
    document.getElementById(
        "questionNumber"
    );


const questionText =
    document.getElementById(
        "questionText"
    );


const optionsContainer =
    document.getElementById(
        "optionsContainer"
    );


const questionNavigation =
    document.getElementById(
        "questionNavigation"
    );


const reviewButton =
    document.getElementById(
        "reviewButton"
    );


const previousButton =
    document.getElementById(
        "previousButton"
    );


const nextButton =
    document.getElementById(
        "nextButton"
    );


const submitButton =
    document.getElementById(
        "submitButton"
    );


// ------------------------------------------------------
// Check question bank
// ------------------------------------------------------

if (questions.length === 0) {

    questionText.textContent =
        "No questions are available.";

    optionsContainer.innerHTML = `
        <p>
            Please add questions using
            the Question Editor.
        </p>
    `;

    previousButton.disabled = true;
    nextButton.disabled = true;
    reviewButton.disabled = true;
    submitButton.disabled = true;

}
else {

    initializeTest();

}


// ======================================================
// INITIALIZE TEST
// ======================================================

function initializeTest() {

    createQuestionNavigation();

    displayQuestion();

    startTimer();

}


// ======================================================
// DISPLAY QUESTION
// ======================================================

function displayQuestion() {


    saveCurrentQuestionTime();


    questionStartTime =
        Date.now();


    const q =
        questions[currentQuestionIndex];


    const number =
        currentQuestionIndex + 1;


    progressText.textContent =

        `Question ${number} of ${questions.length}`;


    questionNumber.textContent =

        `Question ${number}`;


    questionText.textContent =
        q.question;


    optionsContainer.innerHTML =
        "";



    const optionKeys =
        ["A", "B", "C", "D"];


    optionKeys.forEach(
        function(key) {


            const option =
                document.createElement(
                    "label"
                );


            option.className =
                "answer-option";


            const radio =
                document.createElement(
                    "input"
                );


            radio.type =
                "radio";


            radio.name =
                "answer";


            radio.value =
                key;


            radio.checked =
                answers[currentQuestionIndex]
                === key;



            radio.addEventListener(
                "change",
                function() {

                    answers[
                        currentQuestionIndex
                    ] = key;

                    updateNavigation();

                }
            );



            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                q.options[key];


            option.appendChild(
                radio
            );


            option.appendChild(
                text
            );


            optionsContainer.appendChild(
                option
            );

        }
    );



    reviewButton.textContent =

        markedForReview[
            currentQuestionIndex
        ]

            ? "Remove Review Mark"

            : "Mark for Review";



    previousButton.disabled =

        currentQuestionIndex === 0;


    nextButton.disabled =

        currentQuestionIndex ===
        questions.length - 1;



    updateNavigation();

}


// ======================================================
// SAVE TIME FOR CURRENT QUESTION
// ======================================================

function saveCurrentQuestionTime() {


    if (
        questions.length === 0 ||
        testSubmitted
    ) {

        return;

    }


    const elapsed =
        Date.now() -
        questionStartTime;


    const seconds =
        Math.floor(
            elapsed / 1000
        );


    timeSpent[currentQuestionIndex] =

        (
            timeSpent[currentQuestionIndex] ||
            0
        ) + seconds;

}


// ======================================================
// QUESTION NAVIGATION
// ======================================================

function createQuestionNavigation() {


    questionNavigation.innerHTML =
        "";


    questions.forEach(
        function(q, index) {


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.textContent =
                index + 1;


            button.className =
                "question-nav-button";


            button.addEventListener(
                "click",
                function() {

                    goToQuestion(index);

                }
            );


            questionNavigation.appendChild(
                button
            );

        }
    );

}


// ======================================================
// UPDATE QUESTION NAVIGATION
// ======================================================

function updateNavigation() {


    const buttons =
        questionNavigation.querySelectorAll(
            ".question-nav-button"
        );


    buttons.forEach(
        function(button, index) {


            button.classList.remove(
                "current"
            );


            button.classList.remove(
                "answered"
            );


            button.classList.remove(
                "review"
            );



            if (
                index ===
                currentQuestionIndex
            ) {

                button.classList.add(
                    "current"
                );

            }


            if (
                answers[index]
            ) {

                button.classList.add(
                    "answered"
                );

            }


            if (
                markedForReview[index]
            ) {

                button.classList.add(
                    "review"
                );

            }

        }
    );

}


// ======================================================
// GO TO QUESTION
// ======================================================

function goToQuestion(index) {


    if (
        index < 0 ||
        index >= questions.length
    ) {

        return;

    }


    currentQuestionIndex =
        index;


    displayQuestion();

}


// ======================================================
// PREVIOUS
// ======================================================

previousButton.addEventListener(
    "click",
    function() {

        goToQuestion(
            currentQuestionIndex - 1
        );

    }
);


// ======================================================
// NEXT
// ======================================================

nextButton.addEventListener(
    "click",
    function() {

        goToQuestion(
            currentQuestionIndex + 1
        );

    }
);


// ======================================================
// MARK FOR REVIEW
// ======================================================

reviewButton.addEventListener(
    "click",
    function() {


        markedForReview[
            currentQuestionIndex
        ] =

            !markedForReview[
                currentQuestionIndex
            ];


        reviewButton.textContent =

            markedForReview[
                currentQuestionIndex
            ]

                ? "Remove Review Mark"

                : "Mark for Review";


        updateNavigation();

    }
);


// ======================================================
// TIMER
// ======================================================

function startTimer() {


    updateTimerDisplay();


    timerInterval =
        setInterval(
            function() {


                if (
                    testSubmitted
                ) {

                    return;

                }


                remainingSeconds--;


                updateTimerDisplay();



                if (
                    remainingSeconds <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    submitTest(
                        true
                    );

                }

            },
            1000
        );

}


// ------------------------------------------------------
// Timer display
// ------------------------------------------------------

function updateTimerDisplay() {


    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timer.textContent =

        String(minutes).padStart(
            2,
            "0"
        ) +

        ":" +

        String(seconds).padStart(
            2,
            "0"
        );

}


// ======================================================
// SUBMIT BUTTON
// ======================================================

submitButton.addEventListener(
    "click",
    function() {


        const unanswered =
            questions.length -
            Object.keys(
                answers
            ).length;



        const message =

            `You have ${unanswered} unanswered question(s).\n\n` +

            `Are you sure you want to submit the test?`;



        if (
            confirm(message)
        ) {

            submitTest(false);

        }

    }
);


// ======================================================
// SUBMIT TEST
// ======================================================

function submitTest(autoSubmitted) {


    if (
        testSubmitted
    ) {

        return;

    }


    testSubmitted = true;


    clearInterval(
        timerInterval
    );


    saveCurrentQuestionTime();



    const settings =
        getSettings();



    let score = 0;

    let correct = 0;

    let wrong = 0;

    let unanswered = 0;



    const questionResults =
        [];



    questions.forEach(
        function(q, index) {


            const selected =
                answers[index] ||
                null;


            let marks = 0;

            let status =
                "unanswered";



            if (
                selected === null
            ) {

                unanswered++;

                marks = 0;

            }


            else if (
                selected ===
                q.correctAnswer
            ) {

                correct++;

                marks =
                    Number(
                        settings.positiveMarks
                    );

                status =
                    "correct";

            }


            else {

                wrong++;

                marks =
                    -Number(
                        settings.negativeMarks
                    );

                status =
                    "wrong";

            }



            score += marks;



            questionResults.push({

                questionIndex:
                    index,

                questionId:
                    q.id,

                selectedAnswer:
                    selected,

                correctAnswer:
                    q.correctAnswer,

                status:
                    status,

                marks:
                    marks,

                timeSpent:
                    timeSpent[index] || 0

            });

        }
    );



    const totalPossibleMarks =

        questions.length *
        Number(
            settings.positiveMarks
        );



    const percentage =

        totalPossibleMarks === 0

            ? 0

            : (
                score /
                totalPossibleMarks
            ) * 100;



    const result = {


        totalQuestions:
            questions.length,


        correct:
            correct,


        wrong:
            wrong,


        unanswered:
            unanswered,


        score:
            score,


        totalPossibleMarks:
            totalPossibleMarks,


        percentage:
            percentage,


        positiveMarks:
            Number(
                settings.positiveMarks
            ),


        negativeMarks:
            Number(
                settings.negativeMarks
            ),


        questionResults:
            questionResults,


        submittedAutomatically:
            autoSubmitted,


        date:
            new Date().toISOString()

    };



    localStorage.setItem(

        "mockTestLastResult",

        JSON.stringify(result)

    );



    window.location.href =
        "result.html";

          }
