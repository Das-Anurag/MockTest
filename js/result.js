// ======================================================
// Mock Test - Result / Feedback Page
// Text + Image Support
// ======================================================


// ======================================================
// GET RESULT
// ======================================================

const resultData =
    JSON.parse(
        localStorage.getItem(
            "mockTestLastResult"
        )
    );


// ======================================================
// CHECK RESULT
// ======================================================

if (!resultData) {

    document.body.innerHTML = `

        <main class="container">

            <h1>No Result Available</h1>

            <p>
                Please complete a test first.
            </p>

            <a href="index.html">
                Go to Home
            </a>

        </main>

    `;

    throw new Error("No result available.");

}


// ======================================================
// SETTINGS
// ======================================================

const positiveMarks =
    Number(
        resultData.positiveMarks
    );

const negativeMarks =
    Number(
        resultData.negativeMarks
    );

const totalQuestions =
    Number(
        resultData.totalQuestions
    );


// ======================================================
// CALCULATE AVERAGE TIME
// ======================================================
//
// Required formula:
//
// Average Time = Total Given Time
//                -----------------
//                Number of Questions
//
// The test duration is stored in settings.
//
// ======================================================

let totalGivenTime = 0;

if (typeof getSettings === "function") {

    const settings =
        getSettings();

    totalGivenTime =
        Number(
            settings.testDurationMinutes
        );

}


// Average time in minutes

const averageTimeMinutes =

    totalQuestions > 0

        ? totalGivenTime /
          totalQuestions

        : 0;


// Average time in seconds

const averageTimeSeconds =

    averageTimeMinutes * 60;


// ======================================================
// HTML ELEMENTS
// ======================================================

const scoreElement =
    document.getElementById("score");

const percentageElement =
    document.getElementById("percentage");

const correctElement =
    document.getElementById("correct");

const wrongElement =
    document.getElementById("wrong");

const unansweredElement =
    document.getElementById("unanswered");

const totalQuestionsElement =
    document.getElementById("totalQuestions");

const markingTable =
    document.getElementById("markingTable");

const averageTimeElement =
    document.getElementById("averageTime");

const slowQuestionsContainer =
    document.getElementById(
        "slowQuestions"
    );

const questionAnalysis =
    document.getElementById(
        "questionAnalysis"
    );

const performanceMessage =
    document.getElementById(
        "performanceMessage"
    );


// ======================================================
// BASIC RESULT
// ======================================================

if (scoreElement) {

    scoreElement.textContent =
        formatNumber(
            resultData.score
        );

}


if (percentageElement) {

    percentageElement.textContent =

        formatNumber(
            resultData.percentage
        ) + "%";

}


if (correctElement) {

    correctElement.textContent =
        resultData.correct;

}


if (wrongElement) {

    wrongElement.textContent =
        resultData.wrong;

}


if (unansweredElement) {

    unansweredElement.textContent =
        resultData.unanswered;

}


if (totalQuestionsElement) {

    totalQuestionsElement.textContent =
        totalQuestions;

}


// ======================================================
// MARKING BREAKDOWN
// ======================================================

if (markingTable) {

    markingTable.innerHTML = `

        <thead>

            <tr>

                <th>Category</th>

                <th>No. of Questions</th>

                <th>Mark / Question</th>

                <th>Net Marks</th>

            </tr>

        </thead>

        <tbody>

            <tr>

                <td>Correct</td>

                <td>
                    ${resultData.correct}
                </td>

                <td>
                    ${formatNumber(
                        positiveMarks
                    )}
                </td>

                <td>
                    ${formatNumber(
                        resultData.correct *
                        positiveMarks
                    )}
                </td>

            </tr>


            <tr>

                <td>Wrong</td>

                <td>
                    ${resultData.wrong}
                </td>

                <td>
                    -${formatNumber(
                        negativeMarks
                    )}
                </td>

                <td>
                    ${formatNumber(
                        resultData.wrong *
                        -negativeMarks
                    )}
                </td>

            </tr>


            <tr>

                <td>Unanswered</td>

                <td>
                    ${resultData.unanswered}
                </td>

                <td>
                    0
                </td>

                <td>
                    0
                </td>

            </tr>


            <tr>

                <td><strong>Total</strong></td>

                <td>
                    <strong>
                        ${totalQuestions}
                    </strong>
                </td>

                <td>
                    —
                </td>

                <td>
                    <strong>
                        ${formatNumber(
                            resultData.score
                        )}
                    </strong>
                </td>

            </tr>

        </tbody>

    `;

}


// ======================================================
// AVERAGE TIME
// ======================================================

if (averageTimeElement) {

    averageTimeElement.textContent =
        formatTime(
            averageTimeSeconds
        );

}


// ======================================================
// FIND QUESTIONS TAKING MORE THAN
// AVERAGE TIME
// ======================================================

const slowQuestions = [];


if (
    Array.isArray(
        resultData.questionResults
    )
) {

    resultData.questionResults.forEach(
        function(q, index) {

            const time =
                Number(
                    q.timeSpent || 0
                );


            if (
                time >
                averageTimeSeconds
            ) {

                slowQuestions.push({

                    index:
                        index,

                    question:
                        q.question,

                    time:
                        time

                });

            }

        }
    );

}


// ======================================================
// DISPLAY SLOW QUESTIONS
// ======================================================

if (slowQuestionsContainer) {

    slowQuestionsContainer.innerHTML = "";


    if (!slowQuestions.length) {

        slowQuestionsContainer.innerHTML = `

            <p>
                You did not spend more than the
                average time on any question.
            </p>

        `;

    }

    else {

        const list =
            document.createElement("ul");


        slowQuestions.forEach(
            function(q) {

                const li =
                    document.createElement("li");


                li.textContent =

                    "Question " +
                    (q.index + 1) +
                    " — " +
                    formatTime(q.time);


                list.appendChild(li);

            }
        );


        slowQuestionsContainer.appendChild(
            list
        );

    }

}


// ======================================================
// QUESTION-WISE ANALYSIS
// ======================================================

if (questionAnalysis) {

    questionAnalysis.innerHTML = "";


    if (
        !Array.isArray(
            resultData.questionResults
        ) ||
        resultData.questionResults.length === 0
    ) {

        questionAnalysis.innerHTML = `

            <p>
                No question-wise analysis is available.
            </p>

        `;

    }

    else {

        resultData.questionResults.forEach(
            function(q, index) {

                createQuestionAnalysis(
                    q,
                    index,
                    questionAnalysis
                );

            }
        );

    }

}


// ======================================================
// CREATE QUESTION ANALYSIS
// ======================================================

function createQuestionAnalysis(
    q,
    index,
    container
) {

    const card =
        document.createElement("div");


    card.className =
        "question-analysis";


    // ==================================================
    // QUESTION NUMBER
    // ==================================================

    const heading =
        document.createElement("h3");


    heading.textContent =
        "Question " + (index + 1);


    card.appendChild(
        heading
    );


    // ==================================================
    // QUESTION
    // ==================================================

    const questionBox =
        document.createElement("div");


    questionBox.className =
        "analysis-question";


    appendMedia(
        questionBox,
        q.question,
        "Question image"
    );


    card.appendChild(
        questionBox
    );


    // ==================================================
    // OPTIONS
    // ==================================================

    const options =
        document.createElement("div");


    options.className =
        "analysis-options";


    ["A", "B", "C", "D"].forEach(
        function(key) {

            const option =
                document.createElement("div");


            option.className =
                "analysis-option";


            // ------------------------------------------
            // CORRECT ANSWER
            // ------------------------------------------

            if (
                key === q.correctAnswer
            ) {

                option.classList.add(
                    "correct-option"
                );

            }


            // ------------------------------------------
            // USER SELECTED ANSWER
            // ------------------------------------------

            if (
                key === q.selectedAnswer
            ) {

                option.classList.add(
                    "selected-option"
                );

            }


            // ------------------------------------------
            // OPTION LETTER
            // ------------------------------------------

            const letter =
                document.createElement("strong");


            letter.textContent =
                key + ". ";


            option.appendChild(
                letter
            );


            // ------------------------------------------
            // OPTION CONTENT
            // ------------------------------------------

            const content =
                document.createElement("span");


            appendMedia(
                content,
                q.options[key],
                "Option " + key + " image"
            );


            option.appendChild(
                content
            );


            options.appendChild(
                option
            );

        }
    );


    card.appendChild(
        options
    );


    // ==================================================
    // RESULT STATUS
    // ==================================================

    const status =
        document.createElement("p");


    status.className =
        "analysis-status";


    if (
        q.status === "correct"
    ) {

        status.textContent =
            "Correct";

        status.classList.add(
            "status-correct"
        );

    }

    else if (
        q.status === "wrong"
    ) {

        status.textContent =
            "Wrong";

        status.classList.add(
            "status-wrong"
        );

    }

    else {

        status.textContent =
            "Unanswered";

        status.classList.add(
            "status-unanswered"
        );

    }


    card.appendChild(
        status
    );


    container.appendChild(
        card
    );

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
     * Plain text
     */

    if (
        typeof value === "string"
    ) {

        container.textContent =
            value;

        return;

    }


    /*
     * Image / Text + Image
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
// PERFORMANCE MESSAGE
// ======================================================

if (performanceMessage) {

    const percentage =
        Number(
            resultData.percentage
        );


    let message;


    if (percentage >= 90) {

        message =
            "Excellent performance! Your preparation and accuracy are outstanding.";

    }

    else if (percentage >= 75) {

        message =
            "Very good performance! You have demonstrated strong understanding and accuracy.";

    }

    else if (percentage >= 60) {

        message =
            "Good performance! With a little more practice, you can improve your score further.";

    }

    else if (percentage >= 40) {

        message =
            "Your performance is satisfactory, but more practice is needed to improve accuracy.";

    }

    else {

        message =
            "You should review the topics carefully and practice more questions before your next test.";

    }


    performanceMessage.textContent =
        message;

}


// ======================================================
// FORMAT NUMBER
// ======================================================

function formatNumber(
    value
) {

    const n =
        Number(value);


    if (
        Number.isInteger(n)
    ) {

        return String(n);

    }


    return n.toFixed(2);

}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(
    seconds
) {

    seconds =
        Math.max(
            0,
            Math.round(
                Number(seconds) || 0
            )
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    if (minutes === 0) {

        return (
            remaining +
            " sec"
        );

    }


    return (

        minutes +
        " min " +
        remaining +
        " sec"

    );

                }
