// ======================================================
// Mock Test - Result / Feedback Page
// ======================================================


// ======================================================
// GET SAVED RESULT
// ======================================================

const savedResult =
    localStorage.getItem(
        "mockTestLastResult"
    );


if (!savedResult) {

    document.body.innerHTML = `

        <div class="result-container">

            <section class="result-header">

                <h1>
                    No Result Available
                </h1>

                <p>
                    Please take a test first.
                </p>

                <a
                    href="index.html"
                    class="result-button">

                    Back to Home

                </a>

            </section>

        </div>

    `;

    throw new Error(
        "No test result found."
    );

}


// Convert saved JSON into JavaScript object

const result =
    JSON.parse(
        savedResult
    );


// ======================================================
// GET SETTINGS
// ======================================================

const settings =
    getSettings();


// ======================================================
// BASIC TEST INFORMATION
// ======================================================

const totalQuestions =
    Number(
        result.totalQuestions || 0
    );


const correct =
    Number(
        result.correct || 0
    );


const wrong =
    Number(
        result.wrong || 0
    );


const unanswered =
    Number(
        result.unanswered || 0
    );


const score =
    Number(
        result.score || 0
    );


const percentage =
    Number(
        result.percentage || 0
    );


const positiveMarks =
    Number(
        result.positiveMarks || 0
    );


const negativeMarks =
    Number(
        result.negativeMarks || 0
    );


// ======================================================
// HTML ELEMENTS
// ======================================================

const scoreElement =
    document.getElementById(
        "score"
    );


const percentageElement =
    document.getElementById(
        "percentage"
    );


const submissionStatus =
    document.getElementById(
        "submissionStatus"
    );


const performanceMessage =
    document.getElementById(
        "performanceMessage"
    );


const averageTime =
    document.getElementById(
        "averageTime"
    );


const slowQuestions =
    document.getElementById(
        "slowQuestions"
    );


const questionResults =
    document.getElementById(
        "questionResults"
    );


// ======================================================
// MARKING TABLE ELEMENTS
// ======================================================

const correctQuestionCount =
    document.getElementById(
        "correctQuestionCount"
    );


const wrongQuestionCount =
    document.getElementById(
        "wrongQuestionCount"
    );


const unansweredQuestionCount =
    document.getElementById(
        "unansweredQuestionCount"
    );


const totalQuestionCount =
    document.getElementById(
        "totalQuestionCount"
    );


const correctMarkPerQuestion =
    document.getElementById(
        "correctMarkPerQuestion"
    );


const wrongMarkPerQuestion =
    document.getElementById(
        "wrongMarkPerQuestion"
    );


const unansweredMarkPerQuestion =
    document.getElementById(
        "unansweredMarkPerQuestion"
    );


const correctNetMark =
    document.getElementById(
        "correctNetMark"
    );


const wrongNetMark =
    document.getElementById(
        "wrongNetMark"
    );


const unansweredNetMark =
    document.getElementById(
        "unansweredNetMark"
    );


const totalNetMark =
    document.getElementById(
        "totalNetMark"
    );


// ======================================================
// DISPLAY SCORE
// ======================================================

if (scoreElement) {

    scoreElement.textContent =
        formatNumber(
            score
        );

}


if (percentageElement) {

    percentageElement.textContent =
        formatNumber(
            percentage
        ) + "%";

}


// ======================================================
// SUBMISSION STATUS
// ======================================================

if (submissionStatus) {

    if (
        result.submittedAutomatically
    ) {

        submissionStatus.textContent =
            "The test was automatically submitted because the time ended.";

    }
    else {

        submissionStatus.textContent =
            "The test was submitted manually.";

    }

}


// ======================================================
// MARKING BREAKDOWN
// ======================================================


// ------------------------------------------------------
// Number of questions
// ------------------------------------------------------

if (correctQuestionCount) {

    correctQuestionCount.textContent =
        correct;

}


if (wrongQuestionCount) {

    wrongQuestionCount.textContent =
        wrong;

}


if (unansweredQuestionCount) {

    unansweredQuestionCount.textContent =
        unanswered;

}


if (totalQuestionCount) {

    totalQuestionCount.textContent =
        totalQuestions;

}


// ------------------------------------------------------
// Mark per question
// ------------------------------------------------------

if (correctMarkPerQuestion) {

    correctMarkPerQuestion.textContent =
        formatNumber(
            positiveMarks
        );

}


if (wrongMarkPerQuestion) {

    wrongMarkPerQuestion.textContent =
        formatNumber(
            -negativeMarks
        );

}


if (unansweredMarkPerQuestion) {

    unansweredMarkPerQuestion.textContent =
        "0";

}


// ------------------------------------------------------
// Net marks
// ------------------------------------------------------

const correctNet =
    correct *
    positiveMarks;


const wrongNet =
    wrong *
    (-negativeMarks);


const unansweredNet =
    0;


const totalNet =
    correctNet +
    wrongNet +
    unansweredNet;


if (correctNetMark) {

    correctNetMark.textContent =
        formatNumber(
            correctNet
        );

}


if (wrongNetMark) {

    wrongNetMark.textContent =
        formatNumber(
            wrongNet
        );

}


if (unansweredNetMark) {

    unansweredNetMark.textContent =
        formatNumber(
            unansweredNet
        );

}


if (totalNetMark) {

    totalNetMark.textContent =
        formatNumber(
            totalNet
        );

}


// ======================================================
// PERFORMANCE MESSAGE
// ======================================================

generatePerformanceMessage();


// ======================================================
// TIME ANALYSIS
// ======================================================

generateTimeAnalysis();


// ======================================================
// QUESTION-WISE ANALYSIS
// ======================================================

generateQuestionAnalysis();


// ======================================================
// PERFORMANCE MESSAGE FUNCTION
// ======================================================

function generatePerformanceMessage() {

    if (!performanceMessage) {

        return;

    }


    let message;


    if (
        percentage >= 90
    ) {

        message =
            "Outstanding performance! You have demonstrated excellent accuracy and a very strong understanding of the questions.";

    }

    else if (
        percentage >= 75
    ) {

        message =
            "Excellent performance! You have demonstrated a strong understanding of the subject.";

    }

    else if (
        percentage >= 60
    ) {

        message =
            "Good performance! Your overall understanding is satisfactory, but there is still room for improvement.";

    }

    else if (
        percentage >= 40
    ) {

        message =
            "Fair performance. Review the questions you answered incorrectly and strengthen those areas.";

    }

    else {

        message =
            "You need more practice. Review the incorrect and unanswered questions carefully and try the test again.";

    }


    performanceMessage.textContent =
        message;

}


// ======================================================
// TIME ANALYSIS
// ======================================================

function generateTimeAnalysis() {

    if (!averageTime) {

        return;

    }


    const questionData =
        result.questionResults || [];


    if (
        totalQuestions === 0
    ) {

        averageTime.textContent =
            "Average time cannot be calculated because there are no questions.";

        if (slowQuestions) {

            slowQuestions.innerHTML =
                "";

        }

        return;

    }


    // ==================================================
    // TOTAL GIVEN TIME
    // ==================================================

    /*
     * The test duration is obtained from
     * the saved settings.
     *
     * Example:
     *
     * testDurationMinutes = 20
     *
     * Therefore:
     *
     * Total given time = 20 minutes
     */

    const totalGivenTimeMinutes =
        Number(
            settings.testDurationMinutes
        );


    const totalGivenTimeSeconds =
        totalGivenTimeMinutes *
        60;


    // ==================================================
    // AVERAGE TIME
    // ==================================================

    /*
     * IMPORTANT:
     *
     * Average Time =
     *
     * Total Given Time
     * ----------------
     * Number of Questions
     *
     */

    const averageTimeSeconds =
        totalGivenTimeSeconds /
        totalQuestions;


    const averageTimeMinutes =
        averageTimeSeconds /
        60;


    averageTime.textContent =

        "Average time per question: " +

        formatTime(
            averageTimeSeconds
        );


    // ==================================================
    // FIND QUESTIONS ABOVE AVERAGE
    // ==================================================

    const slow =
        questionData.filter(
            function(q) {

                return Number(
                    q.timeSpent || 0
                ) > averageTimeSeconds;

            }
        );


    if (!slowQuestions) {

        return;

    }


    slowQuestions.innerHTML =
        "";


    if (
        slow.length === 0
    ) {

        slowQuestions.innerHTML = `

            <p>
                No question took more than the average time.
            </p>

        `;

        return;

    }


    const heading =
        document.createElement(
            "p"
        );


    heading.innerHTML =
        "<strong>Questions that took more than the average time:</strong>";


    slowQuestions.appendChild(
        heading
    );


    const list =
        document.createElement(
            "ul"
        );


    slow.forEach(
        function(q) {

            const li =
                document.createElement(
                    "li"
                );


            li.textContent =

                "Question " +

                (
                    Number(
                        q.questionIndex
                    ) + 1
                ) +

                " — " +

                formatTime(
                    q.timeSpent
                );


            list.appendChild(
                li
            );

        }
    );


    slowQuestions.appendChild(
        list
    );

}


// ======================================================
// QUESTION-WISE ANALYSIS
// ======================================================

function generateQuestionAnalysis() {

    if (!questionResults) {

        return;

    }


    questionResults.innerHTML =
        "";


    const questions =
        result.questionResults || [];


    questions.forEach(
        function(q, index) {


            // ==========================================
            // QUESTION CARD
            // ==========================================

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "result-question-card";


            // ==========================================
            // QUESTION HEADER
            // ==========================================

            const header =
                document.createElement(
                    "div"
                );


            header.className =
                "result-question-header";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =

                "Question " +

                (
                    index + 1
                );


            const status =
                document.createElement(
                    "span"
                );


            status.textContent =
                getStatusText(
                    q.status
                );


            header.appendChild(
                title
            );


            header.appendChild(
                status
            );


            // ==========================================
            // QUESTION TEXT
            // ==========================================

            const questionText =
                document.createElement(
                    "div"
                );


            questionText.className =
                "result-question-text";


            questionText.textContent =
                q.question;


            // ==========================================
            // OPTIONS
            // ==========================================

            const optionsContainer =
                document.createElement(
                    "div"
                );


            optionsContainer.className =
                "result-options";


            const optionKeys =
                [
                    "A",
                    "B",
                    "C",
                    "D"
                ];


            optionKeys.forEach(
                function(key) {


                    const option =
                        document.createElement(
                            "div"
                        );


                    option.className =
                        "result-answer-option";


                    // ----------------------------------
                    // Option label
                    // ----------------------------------

                    const label =
                        document.createElement(
                            "strong"
                        );


                    label.textContent =
                        key + ". ";


                    // ----------------------------------
                    // Option text
                    // ----------------------------------

                    const text =
                        document.createElement(
                            "span"
                        );


                    text.textContent =
                        q.options[key];


                    option.appendChild(
                        label
                    );


                    option.appendChild(
                        text
                    );


                    // ----------------------------------
                    // Actual correct answer
                    // ----------------------------------

                    if (
                        key ===
                        q.correctAnswer
                    ) {

                        option.classList.add(
                            "correct-option"
                        );

                    }


                    // ----------------------------------
                    // User selected answer
                    // ----------------------------------

                    if (
                        key ===
                        q.selectedAnswer
                    ) {

                        option.classList.add(
                            "selected-option"
                        );

                    }


                    /*
                     * If the selected answer is also
                     * the correct answer:
                     *
                     * Green background
                     * +
                     * Blue text
                     */

                    optionsContainer.appendChild(
                        option
                    );

                }
            );


            // ==========================================
            // ADD CONTENT TO CARD
            // ==========================================

            card.appendChild(
                header
            );


            card.appendChild(
                questionText
            );


            card.appendChild(
                optionsContainer
            );


            /*
             * IMPORTANT:
             *
             * We intentionally DO NOT add:
             *
             * Your answer
             * Correct answer
             * Marks
             * Time spent
             *
             * to the question-wise analysis.
             */


            questionResults.appendChild(
                card
            );

        }
    );

}


// ======================================================
// STATUS TEXT
// ======================================================

function getStatusText(
    status
) {

    if (
        status === "correct"
    ) {

        return "Correct";

    }


    if (
        status === "wrong"
    ) {

        return "Wrong";

    }


    return "Unanswered";

}


// ======================================================
// FORMAT NUMBER
// ======================================================

function formatNumber(
    value
) {

    const number =
        Number(value);


    if (
        Number.isInteger(
            number
        )
    ) {

        return String(
            number
        );

    }


    return number.toFixed(
        2
    );

}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(
    seconds
) {

    const totalSeconds =
        Math.round(
            Number(seconds) || 0
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const remainingSeconds =
        totalSeconds % 60;


    if (
        minutes === 0
    ) {

        return (

            remainingSeconds +

            " sec"

        );

    }


    if (
        remainingSeconds === 0
    ) {

        return (

            minutes +

            " min"

        );

    }


    return (

        minutes +

        " min " +

        remainingSeconds +

        " sec"

    );

                        }
