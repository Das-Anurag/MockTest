// ======================================================
// Mock Test - Question Editor
// Text + Image Support
// ======================================================


// ======================================================
// ELEMENTS
// ======================================================

const questionForm =
    document.getElementById("questionForm");

const questionId =
    document.getElementById("questionId");

const questionInput =
    document.getElementById("question");

const correctAnswer =
    document.getElementById("correctAnswer");

const questionsContainer =
    document.getElementById(
        "questionsContainer"
    );

const questionCount =
    document.getElementById(
        "questionCount"
    );

const formTitle =
    document.getElementById(
        "formTitle"
    );

const cancelButton =
    document.getElementById(
        "cancelButton"
    );

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

const clearAllButton =
    document.getElementById(
        "clearAllButton"
    );


// ======================================================
// IMAGE INPUTS
// ======================================================

const imageInputs = {

    question:
        document.getElementById(
            "questionImage"
        ),

    A:
        document.getElementById(
            "optionAImage"
        ),

    B:
        document.getElementById(
            "optionBImage"
        ),

    C:
        document.getElementById(
            "optionCImage"
        ),

    D:
        document.getElementById(
            "optionDImage"
        )

};


// ======================================================
// IMAGE PREVIEWS
// ======================================================

const imagePreviews = {

    question:
        document.getElementById(
            "questionImagePreview"
        ),

    A:
        document.getElementById(
            "optionAImagePreview"
        ),

    B:
        document.getElementById(
            "optionBImagePreview"
        ),

    C:
        document.getElementById(
            "optionCImagePreview"
        ),

    D:
        document.getElementById(
            "optionDImagePreview"
        )

};


// ======================================================
// CURRENT IMAGE DATA
// ======================================================
//
// These contain images currently belonging to
// the question being edited.
//
// ======================================================

let currentImages = {

    question: null,

    A: null,

    B: null,

    C: null,

    D: null

};


// ======================================================
// GET QUESTIONS
// ======================================================

let questions =
    getQuestions();


// ======================================================
// INITIALIZE
// ======================================================

loadSettings();

renderQuestions();

setupImageInputs();


// ======================================================
// IMAGE INPUT EVENTS
// ======================================================

function setupImageInputs() {

    Object.keys(
        imageInputs
    ).forEach(
        function(key) {

            const input =
                imageInputs[key];

            if (!input) {

                return;

            }


            input.addEventListener(
                "change",
                function() {

                    handleImageSelect(
                        key
                    );

                }
            );

        }
    );

}


// ======================================================
// IMAGE SELECTION
// ======================================================

function handleImageSelect(
    key
) {

    const input =
        imageInputs[key];

    const file =
        input.files[0];


    if (!file) {

        return;

    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "Please select an image file."
        );

        input.value = "";

        return;

    }


    const reader =
        new FileReader();


    reader.onload =
        function(event) {

            currentImages[key] =
                event.target.result;


            showImagePreview(
                key,
                currentImages[key]
            );

        };


    reader.readAsDataURL(
        file
    );

}


// ======================================================
// SHOW IMAGE PREVIEW
// ======================================================

function showImagePreview(
    key,
    src
) {

    const preview =
        imagePreviews[key];


    if (!preview) {

        return;

    }


    preview.innerHTML = "";


    if (!src) {

        return;

    }


    const image =
        document.createElement(
            "img"
        );


    image.src =
        src;


    image.alt =
        key === "question"

            ? "Question image"

            : "Option " +
              key +
              " image";


    image.className =
        "editor-image-preview";


    preview.appendChild(
        image
    );


    const removeButton =
        document.createElement(
            "button"
        );


    removeButton.type =
        "button";


    removeButton.textContent =
        "Remove Image";


    removeButton.className =
        "remove-image-button";


    removeButton.addEventListener(
        "click",
        function() {

            removeImage(
                key
            );

        }
    );


    preview.appendChild(
        removeButton
    );

}


// ======================================================
// REMOVE IMAGE
// ======================================================

function removeImage(
    key
) {

    currentImages[key] =
        null;


    if (
        imageInputs[key]
    ) {

        imageInputs[key].value =
            "";

    }


    if (
        imagePreviews[key]
    ) {

        imagePreviews[key].innerHTML =
            "";

    }

}


// ======================================================
// CREATE MEDIA VALUE
// ======================================================
//
// Text only:
//
// "Option A"
//
// Image only:
//
// { "i": "data:image/..." }
//
// Text + image:
//
// { "t": "Option A",
//   "i": "data:image/..." }
//
// ======================================================

function createMediaValue(
    text,
    image
) {

    text =
        String(
            text || ""
        ).trim();


    if (
        text &&
        image
    ) {

        return {

            t: text,

            i: image

        };

    }


    if (image) {

        return {

            i: image

        };

    }


    return text;

}


// ======================================================
// EXTRACT MEDIA TEXT
// ======================================================

function getMediaText(
    value
) {

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
// EXTRACT MEDIA IMAGE
// ======================================================

function getMediaImage(
    value
) {

    if (
        value &&
        typeof value === "object"
    ) {

        return value.i || null;

    }


    return null;

}


// ======================================================
// SAVE QUESTION
// ======================================================

questionForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const textQuestion =
            questionInput.value.trim();


        const answer =
            correctAnswer.value;


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
            !textQuestion &&
            !currentImages.question
        ) {

            alert(
                "Please enter a question or select a question image."
            );

            return;

        }


        const optionValues = {};


        ["A", "B", "C", "D"].forEach(
            function(key) {

                const input =
                    document.getElementById(
                        "option" + key
                    );


                optionValues[key] =
                    createMediaValue(

                        input
                            ? input.value
                            : "",

                        currentImages[key]

                    );

            }
        );


        // ------------------------------------------
        // CHECK OPTIONS
        // ------------------------------------------

        for (
            const key of
            ["A", "B", "C", "D"]
        ) {

            const value =
                optionValues[key];


            const text =
                getMediaText(
                    value
                );


            const image =
                getMediaImage(
                    value
                );


            if (
                !text &&
                !image
            ) {

                alert(
                    "Please enter or add an image for Option " +
                    key +
                    "."
                );

                return;

            }

        }


        if (!answer) {

            alert(
                "Please select the correct answer."
            );

            return;

        }


        // ------------------------------------------
        // CREATE QUESTION
        // ------------------------------------------

        const questionObject = {

            id:
                questionId.value ||
                createId(),

            question:
                createMediaValue(

                    textQuestion,

                    currentImages.question

                ),

            options:
                optionValues,

            correctAnswer:
                answer

        };


        // ------------------------------------------
        // EDIT EXISTING
        // ------------------------------------------

        if (
            questionId.value
        ) {

            const index =
                questions.findIndex(
                    function(q) {

                        return String(q.id) ===
                            String(questionId.value);

                    }
                );


            if (
                index !== -1
            ) {

                questions[index] =
                    questionObject;

            }

        }

        // ------------------------------------------
        // ADD NEW
        // ------------------------------------------

        else {

            questions.push(
                questionObject
            );

        }


        saveQuestions(
            questions
        );


        renderQuestions();


        clearForm();


        alert(
            "Question saved successfully."
        );

    }
);


// ======================================================
// CREATE ID
// ======================================================

function createId() {

    return (

        Date.now().toString(
            36
        )

        +

        Math.random()
            .toString(36)
            .substring(2, 8)

    );

}


// ======================================================
// RENDER QUESTIONS
// ======================================================

function renderQuestions() {

    if (!questionsContainer) {

        return;

    }


    questionsContainer.innerHTML =
        "";


    if (
        questionCount
    ) {

        questionCount.textContent =

            questions.length +
            (
                questions.length === 1
                    ? " question"
                    : " questions"
            );

    }


    questions.forEach(
        function(q, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "question-card";


            // --------------------------------------
            // NUMBER
            // --------------------------------------

            const heading =
                document.createElement(
                    "h3"
                );


            heading.textContent =
                "Question " +
                (index + 1);


            card.appendChild(
                heading
            );


            // --------------------------------------
            // QUESTION
            // --------------------------------------

            const questionBox =
                document.createElement(
                    "div"
                );


            questionBox.className =
                "editor-question-preview";


            appendMedia(
                questionBox,
                q.question,
                "Question image"
            );


            card.appendChild(
                questionBox
            );


            // --------------------------------------
            // OPTIONS
            // --------------------------------------

            ["A", "B", "C", "D"].forEach(
                function(key) {

                    const option =
                        document.createElement(
                            "div"
                        );


                    option.className =
                        "editor-option-preview";


                    const label =
                        document.createElement(
                            "strong"
                        );


                    label.textContent =
                        key + ". ";


                    option.appendChild(
                        label
                    );


                    const content =
                        document.createElement(
                            "span"
                        );


                    appendMedia(
                        content,
                        q.options[key],
                        "Option " +
                        key +
                        " image"
                    );


                    option.appendChild(
                        content
                    );


                    if (
                        key ===
                        q.correctAnswer
                    ) {

                        option.classList.add(
                            "editor-correct-option"
                        );

                    }


                    card.appendChild(
                        option
                    );

                }
            );


            // --------------------------------------
            // BUTTONS
            // --------------------------------------

            const buttons =
                document.createElement(
                    "div"
                );


            buttons.className =
                "question-card-buttons";


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

                    editQuestion(
                        index
                    );

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

                    deleteQuestion(
                        index
                    );

                }
            );


            buttons.appendChild(
                editButton
            );


            buttons.appendChild(
                deleteButton
            );


            card.appendChild(
                buttons
            );


            questionsContainer.appendChild(
                card
            );

        }
    );

}


// ======================================================
// DISPLAY MEDIA
// ======================================================

function appendMedia(
    container,
    value,
    altText
) {

    if (
        typeof value === "string"
    ) {

        container.appendChild(
            document.createTextNode(
                value
            )
        );

        return;

    }


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
                "editor-media-image";


            container.appendChild(
                image
            );

        }

    }

}


// ======================================================
// EDIT QUESTION
// ======================================================

function editQuestion(
    index
) {

    const q =
        questions[index];


    if (!q) {

        return;

    }


    questionId.value =
        q.id || "";


    // ------------------------------------------
    // QUESTION
    // ------------------------------------------

    questionInput.value =
        getMediaText(
            q.question
        );


    currentImages.question =
        getMediaImage(
            q.question
        );


    showImagePreview(
        "question",
        currentImages.question
    );


    // ------------------------------------------
    // OPTIONS
    // ------------------------------------------

    ["A", "B", "C", "D"].forEach(
        function(key) {

            const input =
                document.getElementById(
                    "option" + key
                );


            if (input) {

                input.value =
                    getMediaText(
                        q.options[key]
                    );

            }


            currentImages[key] =
                getMediaImage(
                    q.options[key]
                );


            showImagePreview(
                key,
                currentImages[key]
            );

        }
    );


    // ------------------------------------------
    // CORRECT ANSWER
    // ------------------------------------------

    correctAnswer.value =
        q.correctAnswer || "";


    // ------------------------------------------
    // FORM TITLE
    // ------------------------------------------

    if (formTitle) {

        formTitle.textContent =
            "Edit Question";

    }


    if (
        questionForm
    ) {

        questionForm.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ======================================================
// DELETE QUESTION
// ======================================================

function deleteQuestion(
    index
) {

    if (
        !confirm(
            "Are you sure you want to delete this question?"
        )
    ) {

        return;

    }


    questions.splice(
        index,
        1
    );


    saveQuestions(
        questions
    );


    renderQuestions();


    clearForm();

}


// ======================================================
// CLEAR FORM
// ======================================================

cancelButton.addEventListener(
    "click",
    function() {

        clearForm();

    }
);


function clearForm() {

    questionForm.reset();


    questionId.value =
        "";


    currentImages = {

        question: null,

        A: null,

        B: null,

        C: null,

        D: null

    };


    Object.keys(
        imagePreviews
    ).forEach(
        function(key) {

            if (
                imagePreviews[key]
            ) {

                imagePreviews[key].innerHTML =
                    "";

            }

        }
    );


    if (formTitle) {

        formTitle.textContent =
            "Add Question";

    }

}


// ======================================================
// CLEAR ALL QUESTIONS
// ======================================================

clearAllButton.addEventListener(
    "click",
    function() {

        if (
            questions.length === 0
        ) {

            return;

        }


        if (
            !confirm(
                "Are you sure you want to delete ALL questions?"
            )
        ) {

            return;

        }


        questions = [];


        saveQuestions(
            questions
        );


        renderQuestions();


        clearForm();

    }
);


// ======================================================
// EXPORT
// ======================================================

exportButton.addEventListener(
    "click",
    function() {

        if (
            questions.length === 0
        ) {

            alert(
                "There are no questions to export."
            );

            return;

        }


        const compact =
            questions.map(
                function(q) {

                    return [

                        q.question,

                        q.options.A,

                        q.options.B,

                        q.options.C,

                        q.options.D,

                        q.correctAnswer

                    ];

                }
            );


        const json =
            JSON.stringify(
                compact
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


        link.download =
            "MockTest_Questions.json";


        link.click();


        URL.revokeObjectURL(
            url
        );

    }
);


// ======================================================
// IMPORT
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


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                importQuestions(
                    event.target.result
                );

            };


        reader.readAsText(
            file
        );

    }
);


// ======================================================
// IMPORT QUESTIONS
// ======================================================

function importQuestions(
    text
) {

    let data;


    try {

        data =
            JSON.parse(
                text
            );

    }

    catch (error) {

        alert(
            "Import failed.\nInvalid JSON file."
        );

        return;

    }


    if (
        !Array.isArray(data)
    ) {

        alert(
            "Import failed.\nInvalid question format."
        );

        return;

    }


    const imported = [];


    data.forEach(
        function(item) {

            // --------------------------------------
            // COMPACT FORMAT
            // --------------------------------------

            if (
                Array.isArray(item) &&
                item.length >= 6
            ) {

                const q =
                    item[0];


                const A =
                    item[1];


                const B =
                    item[2];


                const C =
                    item[3];


                const D =
                    item[4];


                const answer =
                    String(
                        item[5]
                    )
                    .trim()
                    .toUpperCase();


                if (
                    !answer.match(
                        /^[ABCD]$/
                    )
                ) {

                    return;

                }


                if (
                    !hasContent(q) ||
                    !hasContent(A) ||
                    !hasContent(B) ||
                    !hasContent(C) ||
                    !hasContent(D)
                ) {

                    return;

                }


                imported.push({

                    id:
                        createId(),

                    question:
                        q,

                    options: {

                        A: A,

                        B: B,

                        C: C,

                        D: D

                    },

                    correctAnswer:
                        answer

                });

            }

        }
    );


    if (
        imported.length === 0
    ) {

        alert(
            "Import failed.\nNo valid questions were found."
        );

        return;

    }


    if (
        !confirm(
            "Import " +
            imported.length +
            " question(s)?\n\n" +
            "They will be added to the existing question bank."
        )
    ) {

        return;

    }


    questions =
        questions.concat(
            imported
        );


    saveQuestions(
        questions
    );


    renderQuestions();


    alert(
        imported.length +
        " question(s) imported successfully."
    );


    importFile.value =
        "";

}


// ======================================================
// CHECK CONTENT
// ======================================================

function hasContent(
    value
) {

    if (
        typeof value === "string"
    ) {

        return (
            value.trim().length > 0
        );

    }


    if (
        value &&
        typeof value === "object"
    ) {

        return Boolean(
            value.t ||
            value.i
        );

    }


    return false;

}


// ======================================================
// SETTINGS
// ======================================================

function loadSettings() {

    const settings =
        getSettings();


    const positive =
        document.getElementById(
            "positiveMarks"
        );

    const negative =
        document.getElementById(
            "negativeMarks"
        );

    const duration =
        document.getElementById(
            "testDuration"
        );


    if (positive) {

        positive.value =
            settings.positiveMarks;

    }


    if (negative) {

        negative.value =
            settings.negativeMarks;

    }


    if (duration) {

        duration.value =
            settings.testDurationMinutes;

    }

}


// ======================================================
// SAVE SETTINGS
// ======================================================

const saveSettingsButton =
    document.getElementById(
        "saveSettingsButton"
    );


if (
    saveSettingsButton
) {

    saveSettingsButton.addEventListener(
        "click",
        function() {

            const positive =
                Number(
                    document.getElementById(
                        "positiveMarks"
                    ).value
                );


            const negative =
                Number(
                    document.getElementById(
                        "negativeMarks"
                    ).value
                );


            const duration =
                Number(
                    document.getElementById(
                        "testDuration"
                    ).value
                );


            if (
                positive < 0 ||
                negative < 0 ||
                duration <= 0
            ) {

                alert(
                    "Please enter valid test settings."
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


            const message =
                document.getElementById(
                    "settingsMessage"
                );


            if (message) {

                message.textContent =
                    "Settings saved successfully.";

            }

        }
    );

}
  
