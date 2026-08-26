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


// ------------------------------------------------------
// Import / Export
// ------------------------------------------------------

const exportButton =
    document.getElementById(
        "exportButton"
    );


const importButton =
    document.getElementById(
        "importButton"
    );


const importFile =
    document.getElementById(
        "importFile"
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
        // UPDATE
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
        // ADD
        // ----------------------------------------------

        else {

            addQuestion(
                questionData
            );


            alert(
                "Question added successfully."
            );

        }


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


    formTitle.textContent =
        "Edit Question";


    saveButton.textContent =
        "Update Question";


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


    questionsContainer.innerHTML =
        "";


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


    questions.forEach(
        function(q, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "question-card";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                "Question " +
                (index + 1);


            const questionText =
                document.createElement(
                    "p"
                );


            questionText.textContent =
                q.question;


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
// EXPORT QUESTIONS
// ======================================================

exportButton.addEventListener(
    "click",
    function() {

        exportQuestions();

    }
);


function exportQuestions() {

    const questions =
        getQuestions();


    if (
        questions.length === 0
    ) {

        alert(
            "There are no questions to export."
        );

        return;

    }


    /*
     * Only questions are exported.
     *
     * Test settings are intentionally
     * not included.
     */

    const backup = {

        format:
            "MockTest Question Bank",

        version:
            1,

        exportedAt:
            new Date().toISOString(),

        questions:
            questions

    };


    const json =
        JSON.stringify(
            backup,
            null,
            4
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    const date =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );


    link.download =
        "MockTest_Questions_" +
        date +
        ".json";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


// ======================================================
// IMPORT QUESTIONS
// ======================================================

importButton.addEventListener(
    "click",
    function() {

        importFile.click();

    }
);


importFile.addEventListener(
    "change",
    function() {

        const file =
            importFile.files[0];


        if (!file) {

            return;

        }


        importQuestions(
            file
        );

    }
);


// ======================================================
// PROCESS IMPORTED FILE
// ======================================================

function importQuestions(file) {

    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            try {

                const data =
                    JSON.parse(
                        event.target.result
                    );


                const importedQuestions =
                    validateImportData(
                        data
                    );


                if (
                    importedQuestions.length === 0
                ) {

                    throw new Error(
                        "No valid questions were found."
                    );

                }


                mergeImportedQuestions(
                    importedQuestions
                );

            }

            catch (error) {

                console.error(
                    "Import error:",
                    error
                );


                alert(

                    "Import failed.\n\n" +

                    error.message

                );

            }


            /*
             * Reset file input so that
             * the same file can be selected
             * again later.
             */

            importFile.value =
                "";

        };


    reader.onerror =
        function() {

            alert(
                "The file could not be read."
            );


            importFile.value =
                "";

        };


    reader.readAsText(
        file
    );

}


// ======================================================
// VALIDATE IMPORT DATA
// ======================================================

function validateImportData(data) {

    let importedQuestions = null;


    /*
     * Expected backup format:
     *
     * {
     *   format: "...",
     *   version: 1,
     *   questions: [...]
     * }
     *
     *
     * We also accept a plain array
     * for flexibility.
     */

    if (
        Array.isArray(data)
    ) {

        importedQuestions =
            data;

    }

    else if (
        data &&
        Array.isArray(
            data.questions
        )
    ) {

        importedQuestions =
            data.questions;

    }

    else {

        throw new Error(
            "The selected file is not a valid MockTest question file."
        );

    }


    const validQuestions =
        [];


    importedQuestions.forEach(
        function(q, index) {

            try {

                const validated =
                    validateQuestion(
                        q
                    );


                validQuestions.push(
                    validated
                );

            }

            catch (error) {

                console.warn(

                    "Question " +
                    (index + 1) +
                    " skipped:",

                    error.message

                );

            }

        }
    );


    return validQuestions;

}


// ======================================================
// VALIDATE INDIVIDUAL QUESTION
// ======================================================

function validateQuestion(q) {

    if (
        !q ||
        typeof q !== "object"
    ) {

        throw new Error(
            "Invalid question object."
        );

    }


    if (
        typeof q.question !==
        "string" ||

        q.question.trim() === ""
    ) {

        throw new Error(
            "Question text is missing."
        );

    }


    if (
        !q.options ||
        typeof q.options !== "object"
    ) {

        throw new Error(
            "Options are missing."
        );

    }


    const keys =
        ["A", "B", "C", "D"];


    for (
        const key of keys
    ) {

        if (
            typeof q.options[key] !==
            "string" ||

            q.options[key].trim() === ""
        ) {

            throw new Error(
                "Option " +
                key +
                " is missing."
            );

        }

    }


    if (
        !keys.includes(
            q.correctAnswer
        )
    ) {

        throw new Error(
            "Correct answer must be A, B, C, or D."
        );

    }


    return {

        id:
            typeof q.id === "string" &&
            q.id.trim() !== ""

                ? q.id

                : createQuestionId(),

        question:
            q.question.trim(),

        options: {

            A:
                q.options.A.trim(),

            B:
                q.options.B.trim(),

            C:
                q.options.C.trim(),

            D:
                q.options.D.trim()

        },

        correctAnswer:
            q.correctAnswer

    };

}


// ======================================================
// MERGE IMPORTED QUESTIONS
// ======================================================

function mergeImportedQuestions(
    importedQuestions
) {

    const existingQuestions =
        getQuestions();


    /*
     * Check whether imported questions
     * have the same IDs as existing questions.
     */

    const existingIds =
        new Set(

            existingQuestions.map(
                function(q) {

                    return q.id;

                }
            )

        );


    let newQuestions =
        0;


    let duplicateQuestions =
        0;


    const questionsToAdd =
        [];


    importedQuestions.forEach(
        function(q) {

            /*
             * If ID already exists,
             * create a new ID.
             *
             * This prevents one question
             * from accidentally replacing
             * another.
             */

            if (
                existingIds.has(q.id)
            ) {

                duplicateQuestions++;


                q.id =
                    createQuestionId();

            }


            existingIds.add(
                q.id
            );


            questionsToAdd.push(
                q
            );


            newQuestions++;

        }
    );


    if (
        questionsToAdd.length === 0
    ) {

        alert(
            "No questions were imported."
        );

        return;

    }


    const confirmed =
        confirm(

            "Import " +
            questionsToAdd.length +
            " question(s)?\n\n" +

            "Existing questions will be kept."

        );


    if (!confirmed) {

        return;

    }


    const combined =
        existingQuestions.concat(
            questionsToAdd
        );


    saveQuestions(
        combined
    );


    renderQuestions();


    alert(

        newQuestions +
        " question(s) imported successfully." +

        (
            duplicateQuestions > 0

                ? "\n\n" +
                  duplicateQuestions +
                  " duplicate ID(s) were assigned new IDs."

                : ""

        )

    );

}


// ======================================================
// CREATE QUESTION ID
// ======================================================

function createQuestionId() {

    return (

        Date.now().toString(
            36
        )

        +

        Math.random()
            .toString(36)
            .slice(2, 8)

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
