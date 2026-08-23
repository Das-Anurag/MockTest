// ======================================================
// Mock Test - Result / Feedback System
// ======================================================


// ------------------------------------------------------
// Get saved result
// ------------------------------------------------------

const resultData =
    localStorage.getItem(
        "mockTestLastResult"
    );


// ------------------------------------------------------
// HTML elements
// ------------------------------------------------------

const submissionStatus =
    document.getElementById(
        "submissionStatus"
    );


const score =
    document.getElementById(
        "score"
    );


const percentage =
    document.getElementById(
        "percentage"
    );


const totalQuestions =
    document.getElementById(
        "totalQuestions"
    );


const correct =
    document.getElementById(
        "correct"
    );


const wrong =
    document.getElementById(
        "wrong"
    );


const unanswered =
    document.getElementById(
        "unanswered"
    );


const markingInfo =
    document.getElementById(
        "markingInfo"
    );


const averageTime =
    document.getElementById(
        "averageTime"
    );


const slowQuestions =
    document.getElementById(
        "slowQuestions"
    );


const performanceMessage =
    document.getElementById(
        "performanceMessage"
    );


const questionResults =
    document.getElementById(
        "questionResults"
    );


// ------------------------------------------------------
// Check whether a result exists
// ------------------------------------------------------

if (!resultData) {

    showNoResult();

}
else {

    try {

        const result =
            JSON.parse(resultData);

        displayResult(result);

    }

    catch (error) {

        console.error(
            "Could not read test result:",
            error
        );

        showNoResult();

    }

}


// ======================================================
// NO RESULT
// ======================================================

function showNoResult() {


    submissionStatus.textContent =
        "No test result is available.";


    score.textContent =
        "—";


    percentage.textContent =
        "—";


    totalQuestions.textContent =
        "—";


    correct.textContent =
        "—";


    wrong.textContent =
        "—";


    unanswered.textContent =
        "—";


    markingInfo.textContent =
        "No test result is available.";


    averageTime.textContent =
        "—";


    performanceMessage.textContent =
        "Please take a mock test first.";


    questionResults.innerHTML = `

        <p>
            Please take a mock test first.
        </p>

    `;

}


// ======================================================
// DISPLAY RESULT
// ======================================================

function displayResult(result) {


    // --------------------------------------------------
    // Submission status
    // --------------------------------------------------

    if (
        result.submittedAutomatically
    ) {

        submissionStatus.textContent =

            "Test submitted automatically because the time expired.";

    }
    else {

        submissionStatus.textContent =

            "Test submitted manually.";

    }



    // --------------------------------------------------
    // Score
    // --------------------------------------------------

    score.textContent =

        formatNumber(
            result.score
        )

        + " / " +

        formatNumber(
            result.totalPossibleMarks
        );



    // --------------------------------------------------
    // Percentage
    // --------------------------------------------------

    percentage.textContent =

        formatNumber(
            result.percentage
        )

        + "%";



    // --------------------------------------------------
    // Statistics
    // --------------------------------------------------

    totalQuestions.textContent =
        result.totalQuestions;


    correct.textContent =
        result.correct;


    wrong.textContent =
        result.wrong;


    unanswered.textContent =
        result.unanswered;



    // --------------------------------------------------
    // Marking information
    // --------------------------------------------------

    markingInfo.innerHTML = `

        Correct answer:
        <strong>
            +${formatNumber(
                result.positiveMarks
            )}
        </strong>

        &nbsp;&nbsp;

        Wrong answer:
        <strong>
            −${formatNumber(
                result.negativeMarks
            )}
        </strong>

        &nbsp;&nbsp;

        Unanswered:
        <strong>
            0
        </strong>

    `;



    // --------------------------------------------------
    // Time analysis
    // --------------------------------------------------

    calculateTimeAnalysis(
        result
    );



    // --------------------------------------------------
    // Performance
    // --------------------------------------------------

    generatePerformanceMessage(
        result
    );



    // --------------------------------------------------
    // Question-wise results
    // --------------------------------------------------

    displayQuestionResults(
        result
    );

}


// ======================================================
// TIME ANALYSIS
// ======================================================

function calculateTimeAnalysis(result) {


    const results =
        result.questionResults;



    if (
        !results ||
        results.length === 0
    ) {

        averageTime.textContent =
            "0 seconds";


        slowQuestions.innerHTML = `

            <p>
                No question-time data is available.
            </p>

        `;


        return;

    }



    // --------------------------------------------------
    // Get saved test settings
    // --------------------------------------------------

    const settings =
        getSettings();



    // --------------------------------------------------
    // Total given test time
    // --------------------------------------------------

    const totalGivenTime =

        Number(
            settings.testDurationMinutes
        ) * 60;



    // --------------------------------------------------
    // Average available time per question
    //
    // Formula:
    //
    // Total given time
    // -----------------
    // Number of questions
    //
    // --------------------------------------------------

    const avg =

        totalGivenTime /
        result.totalQuestions;



    // --------------------------------------------------
    // Display average available time
    // --------------------------------------------------

    averageTime.textContent =
        formatTime(avg);



    // --------------------------------------------------
    // Find questions where actual time
    // was greater than average available time
    // --------------------------------------------------

    const slow =

        results.filter(
            function(item) {

                return (

                    Number(
                        item.timeSpent
                    ) > avg

                );

            }
        );



    slowQuestions.innerHTML =
        "";



    // --------------------------------------------------
    // No slow questions
    // --------------------------------------------------

    if (
        slow.length === 0
    ) {

        slowQuestions.innerHTML = `

            <p>

                You did not spend more than
                the average available time
                on any question.

            </p>

        `;

        return;

    }



    // --------------------------------------------------
    // Heading
    // --------------------------------------------------

    const heading =
        document.createElement(
            "p"
        );


    heading.innerHTML = `

        You spent more than the average
        available time on
        <strong>
            ${slow.length}
        </strong>
        question(s):

    `;


    slowQuestions.appendChild(
        heading
    );



    // --------------------------------------------------
    // List of slow questions
    // --------------------------------------------------

    const list =
        document.createElement(
            "ul"
        );



    slow.forEach(
        function(item) {


            const actualTime =

                Number(
                    item.timeSpent
                );



            const difference =

                actualTime - avg;



            const li =
                document.createElement(
                    "li"
                );


            li.innerHTML = `

                Question
                <strong>
                    ${item.questionIndex + 1}
                </strong>

                —

                Actual time:
                ${formatTime(actualTime)}

                —

                ${formatTime(difference)}
                above average

            `;


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
// PERFORMANCE MESSAGE
// ======================================================

function generatePerformanceMessage(result) {


    const p =
        Number(
            result.percentage
        );


    let message = "";



    if (
        p >= 90
    ) {

        message =

            "Outstanding performance! " +
            "Your accuracy is excellent and " +
            "you have demonstrated a very strong " +
            "understanding of the questions.";

    }

    else if (
        p >= 75
    ) {

        message =

            "Very good performance! " +
            "You have a strong understanding of " +
            "the subject, with only some areas " +
            "needing further improvement.";

    }

    else if (
        p >= 60
    ) {

        message =

            "Good performance! " +
            "You have a reasonable understanding, " +
            "but further practice can improve both " +
            "accuracy and confidence.";

    }

    else if (
        p >= 40
    ) {

        message =

            "Your performance is moderate. " +
            "More practice and careful analysis " +
            "of the incorrect answers should help " +
            "improve your result.";

    }

    else {

        message =

            "You need more practice. " +
            "Review the questions you answered " +
            "incorrectly and strengthen the " +
            "underlying concepts before attempting " +
            "the next test.";

    }



    performanceMessage.textContent =
        message;

}


// ======================================================
// QUESTION-WISE RESULTS
// ======================================================

function displayQuestionResults(result) {


    questionResults.innerHTML =
        "";



    if (
        !result.questionResults ||
        result.questionResults.length === 0
    ) {

        questionResults.innerHTML = `

            <p>
                No question-wise result is available.
            </p>

        `;


        return;

    }



    result.questionResults.forEach(
        function(item, index) {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "result-question-card";



            // ------------------------------------------
            // Status
            // ------------------------------------------

            let statusText = "";



            if (
                item.status ===
                "correct"
            ) {

                statusText =
                    "Correct";

            }

            else if (
                item.status ===
                "wrong"
            ) {

                statusText =
                    "Wrong";

            }

            else {

                statusText =
                    "Unanswered";

            }



            // ------------------------------------------
            // Selected answer text
            // ------------------------------------------

            let selectedText =
                "Not answered";



            if (
                item.selectedAnswer
            ) {

                selectedText =

                    item.selectedAnswer
                    + ". "
                    + item.options[
                        item.selectedAnswer
                    ];

            }



            // ------------------------------------------
            // Correct answer text
            // ------------------------------------------

            const correctText =

                item.correctAnswer
                + ". "
                + item.options[
                    item.correctAnswer
                ];



            // ------------------------------------------
            // Question card
            // ------------------------------------------

            card.innerHTML = `

                <div class="result-question-header">

                    <strong>
                        Question ${index + 1}
                    </strong>

                    <span>
                        ${statusText}
                    </span>

                </div>


                <div class="result-question-text">

                    ${escapeHTML(
                        item.question
                    )}

                </div>


                <p>

                    <strong>
                        Your Answer:
                    </strong>

                    ${escapeHTML(
                        selectedText
                    )}

                </p>


                <p>

                    <strong>
                        Correct Answer:
                    </strong>

                    ${escapeHTML(
                        correctText
                    )}

                </p>


                <p>

                    <strong>
                        Time:
                    </strong>

                    ${formatTime(
                        item.timeSpent
                    )}

                </p>


                <p>

                    <strong>
                        Marks:
                    </strong>

                    ${formatMarks(
                        item.marks
                    )}

                </p>

            `;



            questionResults.appendChild(
                card
            );

        }
    );

}


// ======================================================
// FORMAT TIME
// ======================================================

function formatTime(seconds) {


    seconds =
        Math.round(
            Number(seconds)
        );



    if (
        seconds < 60
    ) {

        return (

            seconds +

            (
                seconds === 1
                    ? " second"
                    : " seconds"
            )

        );

    }



    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;



    if (
        remaining === 0
    ) {

        return (

            minutes +

            (
                minutes === 1
                    ? " minute"
                    : " minutes"
            )

        );

    }



    return (

        minutes +

        (
            minutes === 1
                ? " minute "
                : " minutes "
        )

        +

        remaining +

        (
            remaining === 1
                ? " second"
                : " seconds"
        )

    );

}


// ======================================================
// FORMAT MARKS
// ======================================================

function formatMarks(marks) {


    const number =
        Number(marks);



    if (
        number > 0
    ) {

        return "+" +
            formatNumber(number);

    }



    if (
        number < 0
    ) {

        return formatNumber(number);

    }



    return "0";

}


// ======================================================
// FORMAT NUMBERS
// ======================================================

function formatNumber(number) {


    const n =
        Number(number);



    if (
        Number.isInteger(n)
    ) {

        return String(n);

    }



    return n.toFixed(2)
        .replace(
            /\.?0+$/,
            ""
        );

}


// ======================================================
// HTML PROTECTION
// ======================================================

function escapeHTML(text) {


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}
