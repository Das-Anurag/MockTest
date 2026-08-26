// ======================================================
// Mock Test - Question Editor
// ======================================================


// ======================================================
// HTML ELEMENTS
// ======================================================


// ------------------------------------------------------
// Settings
// ------------------------------------------------------

const positiveMarks =
    document.getElementById(
        "positiveMarks"
    );


const negativeMarks =
    document.getElementById(
        "negativeMarks"
    );


const testDuration =
    document.getElementById(
        "testDuration"
    );


const saveSettingsButton =
    document.getElementById(
        "saveSettingsButton"
    );


const settingsMessage =
    document.getElementById(
        "settingsMessage"
    );



// ------------------------------------------------------
// Question form
// ------------------------------------------------------

const questionForm =
    document.getElementById(
        "questionForm"
    );


const formTitle =
    document.getElementById(
        "formTitle"
    );


const questionId =
    document.getElementById(
        "questionId"
    );


const question =
    document.getElementById(
        "question"
    );


const optionA =
    document.getElementById(
        "optionA"
    );


const optionB =
    document.getElementById(
        "optionB"
    );


const optionC =
    document.getElementById(
        "optionC"
    );


const optionD =
    document.getElementById(
        "optionD"
    );


const correctAnswer =
    document.getElementById(
        "correctAnswer"
    );


const saveButton =
    document.getElementById(
        "saveButton"
    );


const cancelButton =
    document.getElementById(
        "cancelButton"
    );



// ------------------------------------------------------
// Question bank
// ------------------------------------------------------

const questionCount =
    document.getElementById(
        "questionCount"
    );


const questionsContainer =
    document.getElementById(
        "questionsContainer"
    );


const clearAllButton =
    document.getElementById(
        "clearAllButton"
    );



// ======================================================
// INITIALIZE EDITOR
// ======================================================

loadSettings();

renderQuestions();

resetForm();


// ======================================================
// LOAD SETTINGS
// ======================================================

function loadSettings() {


    const settings =
        getSettings();



    positiveMarks.value =

        settings.positiveMarks;



    negativeMarks.value =

        settings.negativeMarks;



    testDuration.value =

        settings.testDurationMinutes;

}


// ======================================================
// SAVE SETTINGS
// ======================================================

saveSettingsButton.addEventListener(
    "click",
    function() {


        const positive =
            Number(
                positiveMarks.value
            );


        const negative =
            Number(
                negativeMarks.value
            );


        const duration =
            Number(
                testDuration.value
            );



        // ----------------------------------------------
        // Validate settings
        // ----------------------------------------------

        if (
            !Number.isFinite(positive) ||
            positive < 0
        ) {

            alert(
                "Please enter a valid positive mark."
            );

            return;

        }



        if (
            !Number.isFinite(negative) ||
            negative < 0
        ) {

            alert(
                "Please enter a valid negative mark."
            );

            return;

        }



        if (
            !Number.isFinite(duration) ||
            duration <= 0
        ) {

            alert(
                "Please enter a valid test duration."
            );

            return;

        }



        // ----------------------------------------------
        // Save
        // ----------------------------------------------

        saveSettings({

            positiveMarks:
                positive,

            negativeMarks:
                negative,

            testDurationMinutes:
                duration

        });



        settingsMessage.textContent =
            "Test settings saved successfully.";



        setTimeout(
            function() {

                settingsMessage.textContent =
                    "";

            },
            3000
        );

    }
);


// ======================================================
// SAVE / UPDATE QUESTION
// ======================================================

questionForm.addEventListener(
    "submit",
    function(event) {


        event.preventDefault();



        // ----------------------------------------------
        // Get values
        // ----------------------------------------------

        const text =
            question.value.trim();


        const a =
            optionA.value.trim();


        const b =
            optionB.value.trim();


        const c =
            optionC.value.trim();


        const d =
            optionD.value.trim();


        const answer =
            correctAnswer.value;



        // ----------------------------------------------
        // Validation
        // ----------------------------------------------

        if (
            text === ""
        ) {

            alert(
                "Please enter the question."
            );

            question.focus();

            return;

        }



        if (
            a === "" ||
            b === "" ||
            c === "" ||
            d === ""
        ) {

            alert(
                "Please enter all four options."
            );

            return;

        }



        if (
            answer === ""
        ) {

            alert(
                "Please select the correct answer."
            );

            return;

        }



        // ----------------------------------------------
        // Question object
        // ----------------------------------------------

        const questionData = {

            question:
                text,

            options: {

                A: a,

                B: b,

                C: c,

                D: d

            },

            correctAnswer:
                answer

        };



        // ----------------------------------------------
        // Update existing question
        // ----------------------------------------------

        if (
            questionId.value !== ""
        ) {


            questionData.id =
                questionId.value;


            updateQuestion(
                questionData
            );


            alert(
                "Question updated successfully."
            );

        }



        // ----------------------------------------------
        // Add new question
        // ----------------------------------------------

        else {


            addQuestion(
                questionData
            );


            alert(
                "Question added successfully."
            );

        }



        // ----------------------------------------------
        // Refresh
        // ----------------------------------------------

        renderQuestions();

        resetForm();

    }
);


// ======================================================
// EDIT QUESTION
// ======================================================

function editQuestion(id) {


    const q =
        getQuestionById(id);



    if (!q) {

        alert(
            "Question could not be found."
        );

        return;

    }



    // ----------------------------------------------
    // Fill form
    // ----------------------------------------------

    questionId.value =
        q.id;


    question.value =
        q.question;


    optionA.value =
        q.options.A;


    optionB.value =
        q.options.B;


    optionC.value =
        q.options.C;


    optionD.value =
        q.options.D;


    correctAnswer.value =
        q.correctAnswer;



    // ----------------------------------------------
    // Change form appearance
    // ----------------------------------------------

    formTitle.textContent =
        "Edit Question";


    saveButton.textContent =
        "Update Question";



    // ----------------------------------------------
    // Scroll to form
    // ----------------------------------------------

    document
        .querySelector(
            ".question-section"
        )
        .scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

}


// ======================================================
// DELETE QUESTION
// ======================================================

function deleteQuestionFromEditor(id) {


    const q =
        getQuestionById(id);



    if (!q) {

        return;

    }



    const confirmed =
        confirm(

            "Are you sure you want to delete this question?\n\n" +

            q.question

        );



    if (!confirmed) {

        return;

    }



    deleteQuestion(id);


    renderQuestions();


    /*
     * If the deleted question was
     * currently being edited,
     * clear the form.
     */

    if (
        questionId.value === id
    ) {

        resetForm();

    }

}


// ======================================================
// CLEAR ALL QUESTIONS
// ======================================================

clearAllButton.addEventListener(
    "click",
    function() {


        const questions =
            getQuestions();



        if (
            questions.length === 0
        ) {

            alert(
                "There are no questions to delete."
            );

            return;

        }



        const confirmed =
            confirm(

                "Are you sure you want to delete ALL " +

                questions.length +

                " question(s)?\n\n" +

                "This action cannot be undone."

            );



        if (!confirmed) {

            return;

        }



        clearAllQuestions();


        renderQuestions();


        resetForm();



        alert(
            "All questions have been deleted."
        );

    }
);


// ======================================================
// RESET FORM
// ======================================================

cancelButton.addEventListener(
    "click",
    function() {

        resetForm();

    }
);


function resetForm() {


    questionForm.reset();


    questionId.value =
        "";


    formTitle.textContent =
        "Add Question";


    saveButton.textContent =
        "Save Question";

}


// ======================================================
// DISPLAY QUESTIONS
// ======================================================

function renderQuestions() {


    const questions =
        getQuestions();



    // --------------------------------------------------
    // Count
    // --------------------------------------------------

    if (
        questions.length === 1
    ) {

        questionCount.textContent =
            "1 question";

    }

    else {

        questionCount.textContent =

            questions.length +
            " questions";

    }



    // --------------------------------------------------
    // Clear container
    // --------------------------------------------------

    questionsContainer.innerHTML =
        "";



    // --------------------------------------------------
    // No questions
    // --------------------------------------------------

    if (
        questions.length === 0
    ) {

        questionsContainer.innerHTML = `

            <div class="question-card">

                <p>
                    No questions have been added yet.
                </p>

            </div>

        `;

        return;

    }



    // --------------------------------------------------
    // Create question cards
    // --------------------------------------------------

    questions.forEach(
        function(q, index) {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "question-card";



            // ------------------------------------------
            // Question
            // ------------------------------------------

            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =

                "Question " +
                (index + 1);



            // ------------------------------------------
            // Question text
            // ------------------------------------------

            const questionText =
                document.createElement(
                    "p"
                );


            questionText.textContent =
                q.question;



            // ------------------------------------------
            // Options
            // ------------------------------------------

            const options =
                document.createElement(
                    "div"
                );


            options.innerHTML = `

                <p>
                    <strong>A:</strong>
                    ${escapeHTML(q.options.A)}
                </p>

                <p>
                    <strong>B:</strong>
                    ${escapeHTML(q.options.B)}
                </p>

                <p>
                    <strong>C:</strong>
                    ${escapeHTML(q.options.C)}
                </p>

                <p>
                    <strong>D:</strong>
                    ${escapeHTML(q.options.D)}
                </p>

                <p>
                    <strong>Correct Answer:</strong>
                    ${q.correctAnswer}
                </p>

            `;



            // ------------------------------------------
            // Edit button
            // ------------------------------------------

            const editButton =
                document.createElement(
                    "button"
                );


            editButton.type =
                "button";


            editButton.textContent =
                "Edit";


            editButton.addEventListener(
                "click",
                function() {

                    editQuestion(q.id);

                }
            );



            // ------------------------------------------
            // Delete button
            // ------------------------------------------

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteQuestionFromEditor(
                        q.id
                    );

                }
            );



            // ------------------------------------------
            // Add everything
            // ------------------------------------------

            card.appendChild(
                title
            );


            card.appendChild(
                questionText
            );


            card.appendChild(
                options
            );


            card.appendChild(
                editButton
            );


            card.appendChild(
                deleteButton
            );


            questionsContainer.appendChild(
                card
            );

        }
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
