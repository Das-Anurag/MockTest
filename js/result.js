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


const result =
    JSON.parse(
        savedResult
    );


// ======================================================
// HTML ELEMENTS
// ======================================================

const score =
    document.getElementById(
        "score"
    );


const percentage =
    document.getElementById(
        "percentage"
    );


const correctCount =
    document.getElementById(
        "correctCount"
    );


const wrongCount =
    document.getElementById(
        "wrongCount"
    );


const unansweredCount =
    document.getElementById(
        "unansweredCount"
    );


const totalCount =
    document.getElementById(
        "totalCount"
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


const totalMarkPerQuestion =
    document.getElementById(
        "totalMarkPerQuestion"
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
// DISPLAY BASIC RESULT
// ======================================================

score.textContent =
    formatNumber(
        result.score
    );


percentage.textContent =
    formatNumber(
        result.percentage
    ) + "%";


correctCount.textContent =
    result.correct;


wrongCount.textContent =
    result.wrong;


unansweredCount.textContent =
    result.unanswered;


totalCount.textContent =
    result.totalQuestions;


// ======================================================
// SUBMISSION STATUS
// ======================================================

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


// ======================================================
// MARKING BREAKDOWN
// ======================================================

const positiveMarks =
    Number(
        result.positiveMarks
    );


const negativeMarks =
    Number(
        result.negativeMarks
    );


// ------------------------------------------------------
// Mark carried by one question
// ------------------------------------------------------

correctMarkPerQuestion.textContent =
    formatNumber(
        positiveMarks
    );


wrongMarkPerQuestion.textContent =
    formatNumber(
        -negativeMarks
    );


unansweredMarkPerQuestion.textContent =
    "0";


totalMarkPerQuestion.textContent =
    "—";


// ------------------------------------------------------
// Net marks
// ------------------------------------------------------

const correctMarks =
    result.correct *
    positiveMarks;


const wrongMarks =
    result.wrong *
    (-negativeMarks);


const unansweredMarks =
    0;


const netMarks =
    correctMarks +
    wrongMarks +
    unansweredMarks;


correctNetMark.textContent =
    formatNumber(
        correctMarks
    );


wrongNetMark.textContent =
    formatNumber(
        wrongMarks
    );


unansweredNetMark.textContent =
    formatNumber(
        unansweredMarks
    );


totalNetMark.textContent =
    formatNumber(
        netMarks
    );


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
// PERFORMANCE
// ======================================================

function generatePerformanceMessage() {

    const percentageValue =
        Number(
            result.percentage
        );


    let message;


    if (
        percentageValue >= 90
    ) {

        message =
            "Outstanding performance! You have demonstrated excellent accuracy and a very strong understanding of the questions.";

    }

    else if (
        percentageValue >= 75
    ) {

        message =
            "Excellent performance! You have demonstrated a strong understanding of the subject.";

    }

    else if (
        percentageValue >= 60
    ) {

        message =
            "Good performance! Your overall understanding is satisfactory, but there is still room for improvement.";

    }

    else if (
        percentageValue >= 40
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

    const questions =
        result.questionResults || [];


    if (
        questions.length === 0
    ) {

        averageTime.textContent =
            "No time data is available.";

        return;

    }


    /*
     * Total time actually spent
     */

    let totalTime =
        0;


    questions.forEach(
        function(q) {

            totalTime +=
                Number(
                    q.timeSpent || 0
                );

        }
    );


    /*
     * Average time spent on one question
     *
     * This is based on the actual
     * time spent during the test.
     */

    const actualAverageTime =
        totalTime /
        questions.length;


    averageTime.textContent =

        "Average time spent per question: " +

        formatTime(
            actualAverageTime
        );


    /*
     * Find questions taking more than
     * the average time.
     */

    const slow =
        questions.filter(
            function(q) {

                return Number(
                    q.timeSpent || 0
                ) > actualAverageTime;

            }
        );


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
        "<strong>Questions that took more than average time:</strong>";


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
                    q.questionIndex + 1
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

    questionResults.innerHTML =
        "";


    const questions =
        result.questionResults || [];


    questions.forEach(
        function(q, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "result-question-card";


            // ------------------------------------------
            // Header
            // ------------------------------------------

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

                (index + 1);


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


            // ------------------------------------------
            // Question
            // ------------------------------------------

            const questionText =
                document.createElement(
                    "div"
                );


            questionText.className =
                "result-question-text";


            questionText.textContent =
                q.question;


            // ------------------------------------------
            // Options
            // ------------------------------------------

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


                    /*
                     * Option label.
                     */

                    const label =
                        document.createElement(
                            "strong"
                        );


                    label.textContent =
                        key + ". ";


                    /*
                     * Option text.
                     */

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


                    /*
                     * --------------------------------
                     * ACTUAL CORRECT ANSWER
                     * --------------------------------
                     *
                     * Green background.
                     */

                    if (
                        key ===
                        q.correctAnswer
                    ) {

                        option.classList.add(
                            "correct-option"
                        );

                    }


                    /*
                     * --------------------------------
                     * USER'S SELECTED ANSWER
                     * --------------------------------
                     *
                     * Blue font.
                     */

                    if (
                        key ===
                        q.selectedAnswer
                    ) {

                        option.classList.add(
                            "selected-option"
                        );

                    }


                    /*
                     * If both are true, the option
                     * receives BOTH styles.
                     *
                     * Therefore:
                     *
                     * Green background =
                     * correct answer
                     *
                     * Blue text =
                     * user's selection
                     */

                    optionsContainer.appendChild(
                        option
                    );

                }
            );


            // ------------------------------------------
            // Answer information
            // ------------------------------------------

            const selected =
                document.createElement(
                    "p"
                );


            selected.innerHTML =

                "<strong>Your answer:</strong> " +

                (
                    q.selectedAnswer
                        ? q.selectedAnswer
                        : "Unanswered"
                );


            const correct =
                document.createElement(
                    "p"
                );


            correct.innerHTML =

                "<strong>Correct answer:</strong> " +

                q.correctAnswer;


            const marks =
                document.createElement(
                    "p"
                );


            marks.innerHTML =

                "<strong>Marks:</strong> " +

                formatNumber(
                    q.marks
                );


            const time =
                document.createElement(
                    "p"
                );


            time.innerHTML =

                "<strong>Time spent:</strong> " +

                formatTime(
                    q.timeSpent
                );


            // ------------------------------------------
            // Build card
            // ------------------------------------------

            card.appendChild(
                header
            );


            card.appendChild(
                questionText
            );


            card.appendChild(
                optionsContainer
            );


            card.appendChild(
                selected
            );


            card.appendChild(
                correct
            );


            card.appendChild(
                marks
            );


            card.appendChild(
                time
            );


            questionResults.appendChild(
                card
            );

        }
    );

}


// ======================================================
// STATUS TEXT
// ======================================================

function getStatusText(status) {

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

function formatNumber(value) {

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

function formatTime(seconds) {

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


    return (

        minutes +

        " min " +

        remainingSeconds +

        " sec"

    );

}
