// ======================================================
// Mock Test - Test Engine
// Text + Image Support
// ======================================================


// ======================================================
// QUESTIONS
// ======================================================

const questions = getQuestions();


// ======================================================
// TEST STATE
// ======================================================

let currentQuestionIndex = 0;

let answers = {};

let timeSpent = {};

let questionStartTime = null;

let remainingSeconds = 0;

let timerInterval = null;

let testSubmitted = false;


// ======================================================
// HTML ELEMENTS
// ======================================================

const progressText =
    document.getElementById("progressText");

const timer =
    document.getElementById("timer");

const questionNumber =
    document.getElementById("questionNumber");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById("optionsContainer");

const previousButton =
    document.getElementById("previousButton");

const nextButton =
    document.getElementById("nextButton");

const submitButton =
    document.getElementById("submitButton");


// ======================================================
// CHECK QUESTION BANK
// ======================================================

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

    submitButton.disabled = true;

}
else {

    initializeTest();

}


// ======================================================
// INITIALIZE TEST
// ======================================================

function initializeTest() {

    currentQuestionIndex = 0;

    const settings =
        getSettings();

    remainingSeconds =
        Number(
            settings.testDurationMinutes
        ) * 60;

    questionStartTime = null;

    displayQuestion();

    startTimer();

}


// ======================================================
// DISPLAY QUESTION
// ======================================================

function displayQuestion() {

    if (testSubmitted) {

        return;

    }


    /*
     * Save time for the previous question.
     */

    if (
        questionStartTime !== null
    ) {

        saveCurrentQuestionTime();

    }


    questionStartTime =
        Date.now();


    const q =
        questions[
            currentQuestionIndex
        ];


    const number =
        currentQuestionIndex + 1;


    progressText.textContent =

        `Question ${number} of ${questions.length}`;


    questionNumber.textContent =

        `Question ${number}`;


    // ==================================================
    // QUESTION
    // ==================================================

    questionText.innerHTML = "";

    appendMedia(
        questionText,
        q.question,
        "Question image"
    );


    // ==================================================
    // OPTIONS
    // ==================================================

    optionsContainer.innerHTML = "";


    const optionKeys =
        [
            "A",
            "B",
            "C",
            "D"
        ];


    optionKeys.forEach(
        function(key) {

            const label =
                document.createElement(
                    "label"
                );


            label.className =
                "answer-option";


            // ------------------------------------------
            // RADIO BUTTON
            // ------------------------------------------

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

                answers[
                    currentQuestionIndex
                ] === key;


            radio.addEventListener(
                "change",
                function() {

                    answers[
                        currentQuestionIndex
                    ] = key;

                }
            );


            // ------------------------------------------
            // OPTION CONTENT
            // ------------------------------------------

            const content =
                document.createElement(
                    "span"
                );


            appendMedia(
                content,
                q.options[key],
                "Option " + key + " image"
            );


            label.appendChild(
                radio
            );


            label.appendChild(
                content
            );


            optionsContainer.appendChild(
                label
            );

        }
    );


    // ==================================================
    // PREVIOUS
    // ==================================================

    previousButton.disabled =

        currentQuestionIndex === 0;


    // ==================================================
    // NEXT
    // ==================================================

    nextButton.disabled =

        currentQuestionIndex ===
        questions.length - 1;

}


// ======================================================
// MEDIA DISPLAY
// ======================================================

function appendMedia(
    container,
    value,
    imageAlt
) {

    /*
     * -----------------------------------------------
     * Plain text
     * -----------------------------------------------
     */

    if (
        typeof value === "string"
    ) {

        container.textContent =
            value;

        return;

    }


    /*
     * -----------------------------------------------
     * Image / Text + Image
     *
     * {
     *     t: "text",
     *     i: "image.png"
     * }
     * -----------------------------------------------
     */

    if (
        value &&
        typeof value === "object"
    ) {

        // --------------------------------------------
        // TEXT
        // --------------------------------------------

        if (value.t) {

            const text =
                document.createElement(
                    "span"
                );

            text.textContent =
                value.t;

            container.appendChild(
                text
            );

        }


        // --------------------------------------------
        // IMAGE
        // --------------------------------------------

        if (value.i) {

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                value.i;


            image.alt =
                imageAlt;


            image.className =
                "question-option-image";


            container.appendChild(
                image
            );

        }

    }

}


// ======================================================
// SAVE CURRENT QUESTION TIME
// ======================================================

function saveCurrentQuestionTime() {

    if (
        questions.length === 0 ||
        testSubmitted ||
        questionStartTime === null
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


    timeSpent[
        currentQuestionIndex
    ] =

        (
            timeSpent[
                currentQuestionIndex
            ] || 0

        ) + seconds;

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
// TIMER
// ======================================================

function startTimer() {

    updateTimerDisplay();


    timerInterval =
        setInterval(
            function() {

                if (testSubmitted) {

                    return;

                }


                remainingSeconds--;


                updateTimerDisplay();


                if (
                    remainingSeconds <= 0
                ) {

                    remainingSeconds = 0;


                    updateTimerDisplay();


                    clearInterval(
                        timerInterval
                    );


                    submitTest(true);

                }

            },
            1000
        );

}


// ======================================================
// TIMER DISPLAY
// ======================================================

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
        )

        + ":"

        +

        String(seconds).padStart(
            2,
            "0"
        );

}


// ======================================================
// MANUAL SUBMIT
// ======================================================

submitButton.addEventListener(
    "click",
    function() {

        if (testSubmitted) {

            return;

        }


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

function submitTest(
    autoSubmitted
) {

    if (testSubmitted) {

        return;

    }


    testSubmitted = true;


    clearInterval(
        timerInterval
    );


    /*
     * Save time spent on the question
     * currently displayed.
     */

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
                answers[index] || null;


            let marks = 0;

            let status =
                "unanswered";


            // ------------------------------------------
            // UNANSWERED
            // ------------------------------------------

            if (
                selected === null
            ) {

                unanswered++;

                marks = 0;

            }


            // ------------------------------------------
            // CORRECT
            // ------------------------------------------

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


            // ------------------------------------------
            // WRONG
            // ------------------------------------------

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

                question:
                    q.question,

                selectedAnswer:
                    selected,

                correctAnswer:
                    q.correctAnswer,

                options:
                    q.options,

                status:
                    status,

                marks:
                    marks,

                timeSpent:
                    timeSpent[index] || 0

            });

        }
    );


    // ==================================================
    // TOTAL POSSIBLE MARKS
    // ==================================================

    const totalPossibleMarks =

        questions.length *

        Number(
            settings.positiveMarks
        );


    // ==================================================
    // PERCENTAGE
    // ==================================================

    const percentage =

        totalPossibleMarks === 0

            ? 0

            : (
                score /
                totalPossibleMarks
            ) * 100;


    // ==================================================
    // FINAL RESULT
    // ==================================================

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


    // ==================================================
    // SAVE RESULT
    // ==================================================

    localStorage.setItem(

        "mockTestLastResult",

        JSON.stringify(
            result
        )

    );


    // ==================================================
    // OPEN RESULT PAGE
    // ==================================================

    window.location.href =
        "result.html";

                }
