"editor.js"

// ======================================================
// Mock Test - Question Editor
// ======================================================


// ------------------------------------------------------
// HTML elements
// ------------------------------------------------------

const form =
    document.getElementById(
        "questionForm"
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


const positiveMarks =
    document.getElementById(
        "positiveMarks"
    );


const negativeMarks =
    document.getElementById(
        "negativeMarks"
    );


const saveButton =
    document.getElementById(
        "saveButton"
    );


const saveSettingsButton =
    document.getElementById(
        "saveSettingsButton"
    );


const settingsMessage =
    document.getElementById(
        "settingsMessage"
    );


const questionsContainer =
    document.getElementById(
        "questionsContainer"
    );


const questionCount =
    document.getElementById(
        "questionCount"
    );



// ------------------------------------------------------
// Load saved settings
// ------------------------------------------------------

loadSettings();



// ------------------------------------------------------
// Display saved questions
// ------------------------------------------------------

displayQuestions();



// ======================================================
// TEST MARKING SETTINGS
// ======================================================


// ------------------------------------------------------
// Load settings
// ------------------------------------------------------

function loadSettings() {

    const settings =
        getSettings();


    positiveMarks.value =
        settings.positiveMarks;


    negativeMarks.value =
        settings.negativeMarks;

}



// ------------------------------------------------------
// Save settings
// ------------------------------------------------------

saveSettingsButton.addEventListener(
    "click",
    function() {


        const settings = {

            positiveMarks:
                Number(
                    positiveMarks.value
                ),

            negativeMarks:
                Number(
                    negativeMarks.value
                )

        };


        saveSettings(settings);


        settingsMessage.textContent =
            "Marking settings saved.";


        setTimeout(
            function() {

                settingsMessage.textContent =
                    "";

            },
            2000
        );

    }
);



// ======================================================
// QUESTION FORM
// ======================================================


// ------------------------------------------------------
// Save / update question
// ------------------------------------------------------

form.addEventListener(
    "submit",
    function(event) {


        event.preventDefault();


        const questionData = {

            id:
                questionId.value,


            question:
                question.value.trim(),


            options: {

                A:
                    optionA.value.trim(),

                B:
                    optionB.value.trim(),

                C:
                    optionC.value.trim(),

                D:
                    optionD.value.trim()

            },


            correctAnswer:
                correctAnswer.value

        };



        // New question

        if (!questionId.value) {


            addQuestion(
                questionData
            );


            alert(
                "Question saved successfully."
            );

        }


        // Existing question

        else {


            updateQuestion(
                questionData
            );


            alert(
                "Question updated successfully."
            );

        }



        resetForm();


        displayQuestions();

    }
);



// ======================================================
// DISPLAY QUESTIONS
// ======================================================


function displayQuestions() {


    const questions =
        getQuestions();


    questionCount.textContent =

        questions.length +

        (
            questions.length === 1
                ? " question"
                : " questions"
        );



    questionsContainer.innerHTML =
        "";



    if (questions.length === 0) {


        questionsContainer.innerHTML =
            "<p>No questions have been added yet.</p>";


        return;

    }



    questions.forEach(
        function(q, index) {


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "question-card";



            card.innerHTML = `

                <div class="question-number">

                    Question ${index + 1}

                </div>


                <div class="question-text">

                    ${escapeHTML(q.question)}

                </div>


                <div class="option">

                    A. ${escapeHTML(q.options.A)}

                </div>


                <div class="option">

                    B. ${escapeHTML(q.options.B)}

                </div>


                <div class="option">

                    C. ${escapeHTML(q.options.C)}

                </div>


                <div class="option">

                    D. ${escapeHTML(q.options.D)}

                </div>


                <div class="answer-info">

                    Correct Answer:
                    <strong>
                        ${q.correctAnswer}
                    </strong>

                </div>


                <div class="card-buttons">


                    <button
                        onclick="editQuestion('${q.id}')">

                        Edit

                    </button>


                    <button
                        onclick="removeQuestion('${q.id}')">

                        Delete

                    </button>


                </div>

            `;



            questionsContainer.appendChild(
                card
            );

        }
    );

}



// ======================================================
// EDIT QUESTION
// ======================================================


function editQuestion(id) {


    const q =
        getQuestionById(id);


    if (!q) {

        return;

    }



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



    saveButton.textContent =
        "Update Question";



    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}



// ======================================================
// DELETE QUESTION
// ======================================================


function removeQuestion(id) {


    const confirmation =
        confirm(
            "Are you sure you want to delete this question?"
        );


    if (!confirmation) {

        return;

    }



    deleteQuestion(id);


    displayQuestions();

}



// ======================================================
// RESET FORM
// ======================================================


function resetForm() {


    form.reset();


    questionId.value =
        "";


    saveButton.textContent =
        "Save Question";


    loadSettings();

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
