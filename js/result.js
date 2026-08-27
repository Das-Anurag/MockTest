// ======================================================
// Mock Test - Result / Feedback
// ======================================================

const savedResult =
    localStorage.getItem("mockTestLastResult");


// ======================================================
// NO RESULT
// ======================================================

if (!savedResult) {

    document.body.innerHTML = `

        <div class="result-container">

            <section class="result-header">

                <h1>No Result Available</h1>

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

    throw new Error("No test result found.");

}


// ======================================================
// LOAD RESULT
// ======================================================

let result;

try {

    result =
        JSON.parse(savedResult);

}

catch (error) {

    console.error(error);

    throw new Error(
        "Saved test result is invalid."
    );

}


// ======================================================
// SETTINGS
// ======================================================

const settings =
    getSettings();


// ======================================================
// QUESTION RESULTS
// ======================================================

const questionData =

    Array.isArray(
        result.questionResults
    )

        ? result.questionResults

        : [];


// ======================================================
// CALCULATE COUNTS
// ======================================================
//
// We calculate these from questionResults instead
// of depending only on result.correct, result.wrong,
// etc.
//

let correct = 0;

let wrong = 0;

let unanswered = 0;


questionData.forEach(
    function(q) {

        if (
            q.status === "correct"
        ) {

            correct++;

        }

        else if (
            q.status === "wrong"
        ) {

            wrong++;

        }

        else {

            unanswered++;

        }

    }
);


// ======================================================
// TOTAL QUESTIONS
// ======================================================

let totalQuestions =

    questionData.length;


// If questionResults is unavailable, use
// the saved total as a fallback.

if (
    totalQuestions === 0
) {

    totalQuestions =
        Number(
            result.totalQuestions || 0
        );

}


// ======================================================
// MARKING
// ======================================================

const positiveMarks =

    Number(
        settings.positiveMarks ??
        result.positiveMarks ??
        0
    );


const negativeMarks =

    Number(
        settings.negativeMarks ??
        result.negativeMarks ??
        0
    );


// ======================================================
// NET MARKS
// ======================================================

const correctNet =

    correct *
    positiveMarks;


const wrongNet =

    wrong *
    (-negativeMarks);


const unansweredNet = 0;


const totalNet =

    correctNet +
    wrongNet +
    unansweredNet;


// ======================================================
// TOTAL POSSIBLE MARKS
// ======================================================

const totalPossibleMarks =

    totalQuestions *
    positiveMarks;


// ======================================================
// PERCENTAGE
// ======================================================

const percentage =

    totalPossibleMarks === 0

        ? 0

        : (
            totalNet /
            totalPossibleMarks
        ) * 100;


// ======================================================
// ELEMENTS
// ======================================================

const scoreElement =
    document.getElementById("score");

const percentageElement =
    document.getElementById("percentage");

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
// SCORE
// ======================================================

if (scoreElement) {

    scoreElement.textContent =
        formatNumber(totalNet);

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

    submissionStatus.textContent =

        result.submittedAutomatically

            ? "The test was automatically submitted because the time ended."

            : "The test was submitted manually.";

}


// ======================================================
// MARKING BREAKDOWN
// ======================================================

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


// ======================================================
// MARK PER QUESTION
// ======================================================

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


// ======================================================
// NET MARK
// ======================================================

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
        "0";

}


if (totalNetMark) {

    totalNetMark.textContent =
        formatNumber(
            totalNet
        );

}


// ======================================================
// PERFORMANCE
// ======================================================

generatePerformance();


// ======================================================
// TIME ANALYSIS
// ======================================================

generateTimeAnalysis();


// ======================================================
// QUESTION ANALYSIS
// ======================================================

generateQuestionAnalysis();


// ======================================================
// PERFORMANCE MESSAGE
// ======================================================

function generatePerformance() {

    if (!performanceMessage) {

        return;

    }


    let message;


    if (percentage >= 90) {

        message =
            "Outstanding performance! You have demonstrated excellent accuracy and a very strong understanding of the questions.";

    }

    else if (percentage >= 75) {

        message =
            "Excellent performance! You have demonstrated a strong understanding of the subject.";

    }

    else if (percentage >= 60) {

        message =
            "Good performance! Your overall understanding is satisfactory, but there is still room for improvement.";

    }

    else if (percentage >= 40) {

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


    if (totalQuestions === 0) {

        averageTime.textContent =
            "Average time cannot be calculated.";

        if (slowQuestions) {

            slowQuestions.innerHTML = "";

        }

        return;

    }


    // -----------------------------------------------
    // Total given time
    // -----------------------------------------------

    const totalGivenTimeMinutes =

        Number(
            settings.testDurationMinutes
        );


    const totalGivenTimeSeconds =

        totalGivenTimeMinutes *
        60;


    // -----------------------------------------------
    // Required formula
    //
    // Average Time =
    // Total Given Time / Number of Questions
    // -----------------------------------------------

    const averageTimeSeconds =

        totalGivenTimeSeconds /
        totalQuestions;


    averageTime.textContent =

        "Average time per question: " +

        formatTime(
            averageTimeSeconds
        );


    // -----------------------------------------------
    // Find slow questions
    // -----------------------------------------------

    const slow =

        questionData.filter(
            function(q) {

                return (

                    Number(
                        q.timeSpent || 0
                    )

                    >

                    averageTimeSeconds

                );

            }
        );


    if (!slowQuestions) {

        return;

    }


    slowQuestions.innerHTML = "";


    if (slow.length === 0) {

        slowQuestions.innerHTML = `

            <p>
                No question took more than
                the average time.
            </p>

        `;

        return;

    }


    const heading =
        document.createElement("p");


    heading.innerHTML =
        "<strong>Questions that took more than the average time:</strong>";


    slowQuestions.appendChild(
        heading
    );


    const list =
        document.createElement("ul");


    slow.forEach(
        function(q) {

            const li =
                document.createElement("li");


            const number =

                Number(
                    q.questionIndex
                ) + 1;


            li.textContent =

                "Question " +
                number +
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


    questionResults.innerHTML = "";


    if (
        questionData.length === 0
    ) {

        questionResults.innerHTML = `

            <p>
                Question-wise analysis is not
                available for this result.
                Please submit a new test after
                updating the test files.
            </p>

        `;

        return;

    }


    questionData.forEach(
        function(q, index) {

            createQuestionCard(
                q,
                index
            );

        }
    );

}


// ======================================================
// CREATE QUESTION CARD
// ======================================================

function createQuestionCard(
    q,
    index
) {

    const card =
        document.createElement("div");


    card.className =
        "result-question-card";


    // ==================================================
    // HEADER
    // ==================================================

    const header =
        document.createElement("div");


    header.className =
        "result-question-header";


    const title =
        document.createElement("strong");


    title.textContent =
        "Question " +
        (index + 1);


    const status =
        document.createElement("span");


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


    // ==================================================
    // QUESTION
    // ==================================================

    const questionBox =
        document.createElement("div");


    questionBox.className =
        "result-question-text";


    appendMedia(
        questionBox,
        q.question,
        "Question image"
    );


    // ==================================================
    // OPTIONS
    // ==================================================

    const options =
        document.createElement("div");


    options.className =
        "result-options";


    ["A", "B", "C", "D"].forEach(
        function(key) {

            const option =
                document.createElement("div");


            option.className =
                "result-answer-option";


            // ------------------------------------------
            // Correct answer = green background
            // ------------------------------------------

            if (
                key ===
                String(
                    q.correctAnswer
                ).toUpperCase()
            ) {

                option.classList.add(
                    "correct-option"
                );

            }


            // ------------------------------------------
            // Selected answer = blue text
            // ------------------------------------------

            if (
                key ===
                String(
                    q.selectedAnswer || ""
                ).toUpperCase()
            ) {

                option.classList.add(
                    "selected-option"
                );

            }


            const label =
                document.createElement("strong");


            label.textContent =
                key + ". ";


            const content =
                document.createElement("span");


            appendMedia(
                content,
                q.options
                    ? q.options[key]
                    : "",
                "Option " + key + " image"
            );


            option.appendChild(
                label
            );


            option.appendChild(
                content
            );


            options.appendChild(
                option
            );

        }
    );


    // ==================================================
    // ADD TO CARD
    // ==================================================

    card.appendChild(
        header
    );


    card.appendChild(
        questionBox
    );


    card.appendChild(
        options
    );


    questionResults.appendChild(
        card
    );

}


// ======================================================
// TEXT / IMAGE
// ======================================================

function appendMedia(
    container,
    value,
    altText
) {

    // -----------------------------------------------
    // Plain text
    // -----------------------------------------------

    if (
        typeof value === "string"
    ) {

        container.textContent =
            value;

        return;

    }


    // -----------------------------------------------
    // Image / Text + Image
    // -----------------------------------------------

    if (
        value &&
        typeof value === "object"
    ) {

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


        if (value.i) {

            const image =
                document.createElement(
                    "img"
                );


            image.src =
                value.i;


            image.alt =
                altText;


            image.className =
                "question-option-image";


            container.appendChild(
                image
            );

        }

    }

}


// ======================================================
// STATUS
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


    return number.toFixed(2);

}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(
    seconds
) {

    const totalSeconds =

        Math.max(
            0,
            Math.round(
                Number(seconds) || 0
            )
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
