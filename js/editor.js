// ======================================================
// Mock Test - Question Editor
// Compact JSON + Image Support
// ======================================================


// ======================================================
// ELEMENTS
// ======================================================

const positiveMarks =
    document.getElementById("positiveMarks");

const negativeMarks =
    document.getElementById("negativeMarks");

const testDuration =
    document.getElementById("testDuration");

const saveSettingsButton =
    document.getElementById("saveSettingsButton");

const settingsMessage =
    document.getElementById("settingsMessage");

const questionForm =
    document.getElementById("questionForm");

const formTitle =
    document.getElementById("formTitle");

const questionId =
    document.getElementById("questionId");

const question =
    document.getElementById("question");

const optionA =
    document.getElementById("optionA");

const optionB =
    document.getElementById("optionB");

const optionC =
    document.getElementById("optionC");

const optionD =
    document.getElementById("optionD");

const correctAnswer =
    document.getElementById("correctAnswer");

const saveButton =
    document.getElementById("saveButton");

const cancelButton =
    document.getElementById("cancelButton");

const questionCount =
    document.getElementById("questionCount");

const questionsContainer =
    document.getElementById("questionsContainer");

const clearAllButton =
    document.getElementById("clearAllButton");

const exportButton =
    document.getElementById("exportButton");

const importButton =
    document.getElementById("importButton");

const importFile =
    document.getElementById("importFile");


// ======================================================
// INITIALIZE
// ======================================================

loadSettings();
renderQuestions();
resetForm();


// ======================================================
// SETTINGS
// ======================================================

function loadSettings() {

    const s = getSettings();

    positiveMarks.value =
        s.positiveMarks;

    negativeMarks.value =
        s.negativeMarks;

    testDuration.value =
        s.testDurationMinutes;

}


saveSettingsButton.addEventListener(
    "click",
    function () {

        const p =
            Number(positiveMarks.value);

        const n =
            Number(negativeMarks.value);

        const d =
            Number(testDuration.value);

        if (!Number.isFinite(p) || p < 0) {

            alert("Please enter a valid positive mark.");

            return;

        }

        if (!Number.isFinite(n) || n < 0) {

            alert("Please enter a valid negative mark.");

            return;

        }

        if (!Number.isFinite(d) || d <= 0) {

            alert("Please enter a valid test duration.");

            return;

        }

        saveSettings({

            positiveMarks: p,

            negativeMarks: n,

            testDurationMinutes: d

        });

        settingsMessage.textContent =
            "Test settings saved successfully.";

        setTimeout(
            () => settingsMessage.textContent = "",
            3000
        );

    }
);


// ======================================================
// ADD / UPDATE QUESTION
// ======================================================

questionForm.addEventListener(
    "submit",
    function (event) {

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

        if (!text) {

            alert("Please enter the question.");

            question.focus();

            return;

        }

        if (!a || !b || !c || !d) {

            alert("Please enter all four options.");

            return;

        }

        if (!answer) {

            alert("Please select the correct answer.");

            return;

        }

        const q = {

            question: text,

            options: {

                A: a,
                B: b,
                C: c,
                D: d

            },

            correctAnswer: answer

        };


        if (questionId.value) {

            q.id =
                questionId.value;

            updateQuestion(q);

            alert(
                "Question updated successfully."
            );

        }

        else {

            addQuestion(q);

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

        alert("Question could not be found.");

        return;

    }

    questionId.value =
        q.id;

    question.value =
        mediaText(q.question);

    optionA.value =
        mediaText(q.options.A);

    optionB.value =
        mediaText(q.options.B);

    optionC.value =
        mediaText(q.options.C);

    optionD.value =
        mediaText(q.options.D);

    correctAnswer.value =
        q.correctAnswer;

    formTitle.textContent =
        "Edit Question";

    saveButton.textContent =
        "Update Question";

    document
        .querySelector(".question-section")
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

    if (!q) return;

    if (
        !confirm(
            "Are you sure you want to delete this question?\n\n" +
            mediaText(q.question)
        )
    ) return;

    deleteQuestion(id);

    renderQuestions();

    if (questionId.value === id) {

        resetForm();

    }

}


// ======================================================
// CLEAR ALL
// ======================================================

clearAllButton.addEventListener(
    "click",
    function () {

        const qs =
            getQuestions();

        if (!qs.length) {

            alert("There are no questions to delete.");

            return;

        }

        if (
            !confirm(
                "Are you sure you want to delete ALL " +
                qs.length +
                " question(s)?\n\n" +
                "This action cannot be undone."
            )
        ) return;

        clearAllQuestions();

        renderQuestions();

        resetForm();

        alert("All questions have been deleted.");

    }
);


// ======================================================
// RESET FORM
// ======================================================

cancelButton.addEventListener(
    "click",
    resetForm
);


function resetForm() {

    questionForm.reset();

    questionId.value = "";

    formTitle.textContent =
        "Add Question";

    saveButton.textContent =
        "Save Question";

}


// ======================================================
// DISPLAY QUESTIONS
// ======================================================

function renderQuestions() {

    const qs =
        getQuestions();

    questionCount.textContent =
        qs.length === 1
            ? "1 question"
            : qs.length + " questions";

    questionsContainer.innerHTML = "";

    if (!qs.length) {

        questionsContainer.innerHTML = `
            <div class="question-card">
                <p>No questions have been added yet.</p>
            </div>
        `;

        return;

    }

    qs.forEach(
        function (q, index) {

            const card =
                document.createElement("div");

            card.className =
                "question-card";


            const title =
                document.createElement("h3");

            title.textContent =
                "Question " + (index + 1);


            const qDisplay =
                createMediaElement(
                    q.question
                );

            const options =
                document.createElement("div");


            ["A", "B", "C", "D"].forEach(
                function (key) {

                    const row =
                        document.createElement("div");

                    const label =
                        document.createElement("strong");

                    label.textContent =
                        key + ": ";

                    row.appendChild(label);

                    row.appendChild(
                        createMediaElement(
                            q.options[key]
                        )
                    );

                    options.appendChild(row);

                }
            );


            const answer =
                document.createElement("p");

            answer.innerHTML =
                "<strong>Correct Answer:</strong> " +
                escapeHTML(q.correctAnswer);


            const edit =
                document.createElement("button");

            edit.type = "button";

            edit.textContent = "Edit";

            edit.addEventListener(
                "click",
                () => editQuestion(q.id)
            );


            const del =
                document.createElement("button");

            del.type = "button";

            del.textContent = "Delete";

            del.addEventListener(
                "click",
                () =>
                    deleteQuestionFromEditor(q.id)
            );


            card.appendChild(title);

            card.appendChild(qDisplay);

            card.appendChild(options);

            card.appendChild(answer);

            card.appendChild(edit);

            card.appendChild(del);

            questionsContainer.appendChild(card);

        }
    );

}


// ======================================================
// EXPORT
// ======================================================

exportButton.addEventListener(
    "click",
    exportQuestions
);


function exportQuestions() {

    const qs =
        getQuestions();

    if (!qs.length) {

        alert("There are no questions to export.");

        return;

    }


    /*
     * Compact format:
     *
     * [
     *   [question,A,B,C,D,correct],
     *   ...
     * ]
     *
     * No IDs are exported because IDs are
     * unnecessary for the compact question file.
     */

    const compact =
        qs.map(
            function (q) {

                return [

                    compactMedia(q.question),

                    compactMedia(q.options.A),

                    compactMedia(q.options.B),

                    compactMedia(q.options.C),

                    compactMedia(q.options.D),

                    q.correctAnswer

                ];

            }
        );


    const json =
        JSON.stringify(compact);


    downloadJSON(
        json,
        "MockTest_Questions_" +
        new Date()
            .toISOString()
            .slice(0, 10) +
        ".json"
    );

}


// ======================================================
// IMPORT
// ======================================================

importButton.addEventListener(
    "click",
    () => importFile.click()
);


importFile.addEventListener(
    "change",
    function () {

        const file =
            importFile.files[0];

        if (file) {

            importQuestions(file);

        }

    }
);


function importQuestions(file) {

    const reader =
        new FileReader();


    reader.onload =
        function (event) {

            try {

                const data =
                    JSON.parse(
                        event.target.result
                    );

                const qs =
                    validateImportData(data);


                if (!qs.length) {

                    throw new Error(
                        "No valid questions were found."
                    );

                }

                mergeImportedQuestions(qs);

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

            importFile.value = "";

        };


    reader.onerror =
        function () {

            alert(
                "The file could not be read."
            );

            importFile.value = "";

        };


    reader.readAsText(file);

}


// ======================================================
// VALIDATE IMPORT
// ======================================================

function validateImportData(data) {

    let list;


    /*
     * Plain compact array
     */

    if (Array.isArray(data)) {

        list = data;

    }


    /*
     * Old backup format
     */

    else if (
        data &&
        Array.isArray(data.questions)
    ) {

        list = data.questions;

    }

    else {

        throw new Error(
            "The selected file is not a valid MockTest question file."
        );

    }


    const valid = [];


    list.forEach(
        function (item, index) {

            try {

                valid.push(
                    normalizeQuestion(item)
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


    return valid;

}


// ======================================================
// NORMALIZE QUESTION
// ======================================================

function normalizeQuestion(q) {

    /*
     * -----------------------------------------------
     * NEW COMPACT FORMAT
     *
     * [
     *   question,
     *   A,
     *   B,
     *   C,
     *   D,
     *   correct
     * ]
     * -----------------------------------------------
     */

    if (Array.isArray(q)) {

        if (q.length !== 6) {

            throw new Error(
                "Compact question must contain exactly 6 items."
            );

        }

        const answer =
            String(q[5]).toUpperCase();


        if (
            !["A", "B", "C", "D"].includes(answer)
        ) {

            throw new Error(
                "Correct answer must be A, B, C, or D."
            );

        }


        return {

            id: createQuestionId(),

            question:
                normalizeMedia(q[0]),

            options: {

                A: normalizeMedia(q[1]),

                B: normalizeMedia(q[2]),

                C: normalizeMedia(q[3]),

                D: normalizeMedia(q[4])

            },

            correctAnswer:
                answer

        };

    }


    /*
     * -----------------------------------------------
     * OLD FORMAT
     * -----------------------------------------------
     */

    if (
        q &&
        typeof q === "object"
    ) {

        if (
            q.question === undefined
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


        keys.forEach(
            function (key) {

                if (
                    q.options[key] === undefined
                ) {

                    throw new Error(
                        "Option " +
                        key +
                        " is missing."
                    );

                }

            }
        );


        const answer =
            String(
                q.correctAnswer || ""
            ).toUpperCase();


        if (!keys.includes(answer)) {

            throw new Error(
                "Correct answer must be A, B, C, or D."
            );

        }


        return {

            id:
                typeof q.id === "string" &&
                q.id.trim()
                    ? q.id
                    : createQuestionId(),

            question:
                normalizeMedia(
                    q.question
                ),

            options: {

                A:
                    normalizeMedia(
                        q.options.A
                    ),

                B:
                    normalizeMedia(
                        q.options.B
                    ),

                C:
                    normalizeMedia(
                        q.options.C
                    ),

                D:
                    normalizeMedia(
                        q.options.D
                    )

            },

            correctAnswer:
                answer

        };

    }


    throw new Error(
        "Invalid question."
    );

}


// ======================================================
// MEDIA FORMAT
// ======================================================

function normalizeMedia(value) {

    /*
     * Plain text
     */

    if (
        typeof value === "string"
    ) {

        if (!value.trim()) {

            throw new Error(
                "Empty text is not allowed."
            );

        }

        return value.trim();

    }


    /*
     * Image or text + image
     *
     * {"i":"image.png"}
     *
     * {"t":"Text","i":"image.png"}
     */

    if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value)
    ) {

        const text =
            typeof value.t === "string"
                ? value.t.trim()
                : "";

        const image =
            typeof value.i === "string"
                ? value.i.trim()
                : "";


        if (!text && !image) {

            throw new Error(
                "Media object is empty."
            );

        }


        return {

            ...(text ? { t: text } : {}),

            ...(image ? { i: image } : {})

        };

    }


    throw new Error(
        "Invalid text/image value."
    );

}


// ======================================================
// COMPACT MEDIA
// ======================================================

function compactMedia(value) {

    if (
        typeof value === "string"
    ) {

        return value;

    }


    if (
        value &&
        typeof value === "object"
    ) {

        const obj = {};

        if (value.t) {

            obj.t =
                value.t;

        }

        if (value.i) {

            obj.i =
                value.i;

        }

        return obj;

    }


    return "";

}


// ======================================================
// DISPLAY MEDIA
// ======================================================

function createMediaElement(value) {

    const wrapper =
        document.createElement("div");


    if (
        typeof value === "string"
    ) {

        wrapper.textContent =
            value;

        return wrapper;

    }


    if (
        value &&
        typeof value === "object"
    ) {

        if (value.t) {

            const text =
                document.createElement("div");

            text.textContent =
                value.t;

            wrapper.appendChild(text);

        }


        if (value.i) {

            const image =
                document.createElement("img");

            image.src =
                value.i;

       image.alt =
                value.t || "Question image";

            image.style.maxWidth =
                "100%";

            image.style.height =
                "auto";

            image.style.display =
                "block";

            image.style.marginTop =
                "8px";

            wrapper.appendChild(image);

        }

    }


    return wrapper;

}


// ======================================================
// MEDIA → TEXT
// ======================================================

function mediaText(value) {

    if (
        typeof value === "string"
    ) {

        return value;

    }


    if (
        value &&
        typeof value === "object"
    ) {

        return value.t || "";

    }


    return "";

}


// ======================================================
// MERGE IMPORTED QUESTIONS
// ======================================================

function mergeImportedQuestions(imported) {

    const existing =
        getQuestions();


    const ids =
        new Set(
            existing.map(
                q => q.id
            )
        );


    let duplicates = 0;


    imported.forEach(
        function (q) {

            if (ids.has(q.id)) {

                q.id =
                    createQuestionId();

                duplicates++;

            }

            ids.add(q.id);

            existing.push(q);

        }
    );


    if (!confirm(
        "Import " +
        imported.length +
        " question(s)?\n\n" +
        "Existing questions will be kept."
    )) {

        return;

    }


    saveQuestions(existing);

    renderQuestions();


    alert(

        imported.length +
        " question(s) imported successfully." +

        (
            duplicates
                ? "\n\n" +
                  duplicates +
                  " duplicate ID(s) received new IDs."
                : ""
        )

    );

}


// ======================================================
// DOWNLOAD JSON
// ======================================================

function downloadJSON(
    json,
    filename
) {

    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href =
        url;

    link.download =
        filename;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// ======================================================
// CREATE ID
// ======================================================

function createQuestionId() {

    return (

        Date.now().toString(36) +

        Math.random()
            .toString(36)
            .slice(2, 8)

    );

}


// ======================================================
// HTML ESCAPING
// ======================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

        }
