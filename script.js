/* ==========================================
   ICICI BANK EXAM PRACTICE WEBSITE
   File: script.js
   ========================================== */

/*
  Add your questions inside QUESTION_BANK.
  correct: use "A", "B", "C", or "D".
  This is an independent practice website.
*/

const QUESTION_BANK = [
    {
        id: 1,
        category: "aptitude",
        question: "What is 20% of 500?",
        options: {
            A: "50",
            B: "100",
            C: "150",
            D: "200"
        },
        correct: "B",
        explanation: "20 / 100 × 500 = 100."
    },
    {
        id: 2,
        category: "aptitude",
        question: "A product costs ₹600 and is sold for ₹750. What is the profit percentage?",
        options: {
            A: "10%",
            B: "15%",
            C: "25%",
            D: "30%"
        },
        correct: "C",
        explanation: "Profit = ₹150. Profit percentage = 150 / 600 × 100 = 25%."
    },
    {
        id: 3,
        category: "aptitude",
        question: "Find the average of 10, 20, 30, 40 and 50.",
        options: {
            A: "20",
            B: "25",
            C: "30",
            D: "35"
        },
        correct: "C",
        explanation: "The total is 150. Average = 150 / 5 = 30."
    },
    {
        id: 4,
        category: "reasoning",
        question: "Find the next number: 3, 6, 12, 24, __.",
        options: {
            A: "36",
            B: "42",
            C: "48",
            D: "50"
        },
        correct: "C",
        explanation: "Each number is multiplied by 2."
    },
    {
        id: 5,
        category: "reasoning",
        question: "A person faces North and turns right. Which direction are they facing?",
        options: {
            A: "South",
            B: "East",
            C: "West",
            D: "North"
        },
        correct: "B",
        explanation: "A right turn from North points East."
    },
    {
        id: 6,
        category: "banking",
        question: "What is the full form of KYC?",
        options: {
            A: "Keep Your Cash",
            B: "Know Your Customer",
            C: "Keep Your Customer",
            D: "Know Your Credit"
        },
        correct: "B",
        explanation: "KYC stands for Know Your Customer."
    },
    {
        id: 7,
        category: "banking",
        question: "What is the full form of UPI?",
        options: {
            A: "Unified Payments Interface",
            B: "Universal Payment Information",
            C: "United Payments India",
            D: "Unified Banking Interface"
        },
        correct: "A",
        explanation: "UPI stands for Unified Payments Interface."
    },
    {
        id: 8,
        category: "english",
        question: "Choose the correct spelling.",
        options: {
            A: "Recieve",
            B: "Receeve",
            C: "Receive",
            D: "Receve"
        },
        correct: "C",
        explanation: "The correct spelling is Receive."
    },
    {
        id: 9,
        category: "computer",
        question: "Which shortcut is commonly used to copy text?",
        options: {
            A: "Ctrl + V",
            B: "Ctrl + C",
            C: "Ctrl + X",
            D: "Ctrl + P"
        },
        correct: "B",
        explanation: "Ctrl + C copies selected text."
    },
    {
        id: 10,
        category: "customer",
        question: "A customer is angry about a failed transaction. What should you do first?",
        options: {
            A: "Ignore the customer",
            B: "Argue with the customer",
            C: "Listen calmly and investigate through approved procedures",
            D: "Promise an immediate refund without checking"
        },
        correct: "C",
        explanation: "Listen calmly, acknowledge the concern and follow approved procedures."
    }
];

/* ==========================================
   APPLICATION STATE
   ========================================== */

const $ = (id) => document.getElementById(id);

let candidate = {
    name: "",
    email: ""
};

let mode = "practice";
let questions = [...QUESTION_BANK];
let currentIndex = 0;
let answers = {};
let submitted = false;
let remainingSeconds = 30 * 60;
let timerInterval = null;
let lastResult = null;
let lastReview = [];
let currentFilter = "all";

/* ==========================================
   PAGE NAVIGATION
   ========================================== */

function showPage(pageId) {
    ["loginPage", "dashboardPage", "examPage", "resultPage"]
        .forEach(id => {
            const page = $(id);
            if (page) page.hidden = id !== pageId;
        });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function stopTimer() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return String(minutes).padStart(2, "0") + ":" +
           String(secs).padStart(2, "0");
}

/* ==========================================
   LOGIN
   ========================================== */

$("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = $("candidateName").value.trim();
    const email = $("candidateEmail").value.trim();

    if (!name || !email) {
        alert("Please enter your name and email.");
        return;
    }

    candidate.name = name;
    candidate.email = email;

    $("displayName").textContent = candidate.name;

    showPage("dashboardPage");
});

/* ==========================================
   START STUDY / PRACTICE / MOCK EXAM
   ========================================== */

function startExam(selectedMode) {
    stopTimer();

    mode = selectedMode;
    currentFilter = $("categorySelect").value;

    questions = QUESTION_BANK.filter(question =>
        currentFilter === "all" ||
        question.category === currentFilter
    );

    if (questions.length === 0) {
        alert("No questions available for this subject yet.");
        return;
    }

    currentIndex = 0;
    answers = {};
    submitted = false;
    lastResult = null;
    lastReview = [];

    remainingSeconds = 30 * 60;

    const titles = {
        study: "Study Mode",
        practice: "Practice Mode",
        mock: "Mock Examination"
    };

    $("modeTitle").textContent = titles[mode];
    $("timer").textContent = "Time: " + formatTime(remainingSeconds);
    $("timer").hidden = mode !== "mock";

    $("categorySelect").disabled = true;
    $("reviewButton").hidden = mode === "mock";
    $("submitExamButton").hidden = mode === "study";

    showPage("examPage");
    renderQuestion();
    renderQuestionNavigator();

    if (mode === "mock") {
        startTimer();
    }
}

$("studyButton").addEventListener("click", () => {
    startExam("study");
});

$("practiceButton").addEventListener("click", () => {
    startExam("practice");
});

$("mockButton").addEventListener("click", () => {
    startExam("mock");
});

/* ==========================================
   DISPLAY QUESTION AND FOUR OPTIONS
   ========================================== */

function renderQuestion() {
    const question = questions[currentIndex];

    if (!question) return;

    $("questionNumber").textContent =
        "Question " + (currentIndex + 1);

    $("questionProgress").textContent =
        "Question " + (currentIndex + 1) +
        " of " + questions.length;

    $("questionText").textContent = question.question;

    const container = $("optionsContainer");
    container.replaceChildren();

    ["A", "B", "C", "D"].forEach(letter => {
        const label = document.createElement("label");
        label.className = "option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.value = letter;
        radio.checked = answers[question.id] === letter;
        radio.disabled = submitted;

        const text = document.createElement("span");
        text.textContent = letter + ". " + question.options[letter];

        radio.addEventListener("change", () => {
            if (submitted) return;

            answers[question.id] = letter;
            renderQuestionNavigator();

            if (mode === "study") {
                showFeedback();
            } else {
                $("answerFeedback").hidden = true;
            }
        });

        label.append(radio, text);
        container.appendChild(label);
    });

    $("answerFeedback").hidden = true;

    $("previousButton").disabled = currentIndex === 0;
    $("nextButton").disabled = currentIndex === questions.length - 1;

    if (mode === "study") {
        showFeedback();
    }

    renderQuestionNavigator();
}

/* ==========================================
   ANSWER FEEDBACK
   ========================================== */

function showFeedback() {
    const question = questions[currentIndex];
    const selected = answers[question.id];

    if (!selected) {
        $("answerFeedback").hidden = true;
        return;
    }

    $("answerFeedback").hidden = false;

    const isCorrect = selected === question.correct;

    $("correctAnswer").textContent =
        (isCorrect ? "Correct! " : "Incorrect. ") +
        "Correct answer: " +
        question.correct + ". " +
        question.options[question.correct];

    $("correctAnswer").style.color =
        isCorrect ? "#16804a" : "#c62828";

    $("answerExplanation").textContent =
        question.explanation || "No explanation added yet.";
}

$("reviewButton").addEventListener("click", () => {
    if (mode !== "practice" || submitted) return;

    const question = questions[currentIndex];

    if (!answers[question.id]) {
        alert("Please select an option first.");
        return;
    }

    showFeedback();
});

/* ==========================================
   PREVIOUS / NEXT
   ========================================== */

$("previousButton").addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
    }
});

$("nextButton").addEventListener("click", () => {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion();
    }
});

/* ==========================================
   QUESTION NAVIGATOR
   ========================================== */

function renderQuestionNavigator() {
    const container = $("questionNumbers");
    container.replaceChildren();

    questions.forEach((question, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = index + 1;

        if (index === currentIndex) {
            button.classList.add("active");
        }

        if (answers[question.id]) {
            button.style.borderColor = "#16804a";
        }

        button.setAttribute(
            "aria-label",
            "Go to question " + (index + 1)
        );

        button.addEventListener("click", () => {
            currentIndex = index;
            renderQuestion();
        });

        container.appendChild(button);
    });
}

/* ==========================================
   MOCK EXAM TIMER
   ========================================== */

function startTimer() {
    stopTimer();

    timerInterval = setInterval(() => {
        remainingSeconds--;

        $("timer").textContent =
            "Time: " + formatTime(Math.max(0, remainingSeconds));

        if (remainingSeconds <= 0) {
            stopTimer();
            finishExam(true);
        }
    }, 1000);
}

/* ==========================================
   SUBMIT EXAM
   ========================================== */

$("submitExamButton").addEventListener("click", () => {
    if (mode === "study" || submitted) return;

    const unanswered = questions.filter(
        question => !answers[question.id]
    ).length;

    const message = unanswered > 0
        ? "You have " + unanswered +
          " unanswered question(s). Submit anyway?"
        : "Are you sure you want to submit your exam?";

    if (confirm(message)) {
        finishExam(false);
    }
});

function finishExam(timeExpired = false) {
    if (submitted) return;

    submitted = true;
    stopTimer();

    $("categorySelect").disabled = false;

    const total = questions.length;
    const attempted = questions.filter(
        question => Boolean(answers[question.id])
    ).length;

    const correct = questions.filter(
        question => answers[question.id] === question.correct
    ).length;

    const wrong = attempted - correct;
    const unanswered = total - attempted;
    const percentage = total
        ? Math.round((correct / total) * 100)
        : 0;

    lastResult = {
        candidate: candidate.name,
        email: candidate.email,
        mode: mode,
        total,
        attempted,
        correct,
        wrong,
        unanswered,
        percentage,
        timeExpired,
        date: new Date().toLocaleString()
    };

    lastReview = questions.map((question, index) => ({
        number: index + 1,
        question: question.question,
        options: { ...question.options },
        selected: answers[question.id] || null,
        correct: question.correct,
        explanation: question.explanation || ""
    }));

    $("resultCandidate").textContent = candidate.name;
    $("totalQuestions").textContent = total;
    $("attemptedQuestions").textContent = attempted;
    $("correctCount").textContent = correct;
    $("wrongCount").textContent = wrong;
    $("unansweredCount").textContent = unanswered;
    $("scorePercentage").textContent = percentage + "%";

    $("reviewContainer").replaceChildren();

    showPage("resultPage");

    if (timeExpired) {
        alert("Time is over. Your mock exam has been submitted.");
    }
}

/* ==========================================
   RESULT REVIEW
   ========================================== */

$("reviewAnswersButton").addEventListener("click", () => {
    if (!lastResult || lastReview.length === 0) {
        alert("No submitted result is available to review.");
        return;
    }

    const container = $("reviewContainer");
    container.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "Answer Review";
    container.appendChild(heading);

    lastReview.forEach(item => {
        const isCorrect = item.selected === item.correct;

        const card = document.createElement("article");
        card.className =
            "review-item " + (isCorrect ? "correct" : "wrong");

        const title = document.createElement("h3");
        title.textContent =
            "Question " + item.number + ": " + item.question;

        card.appendChild(title);

        ["A", "B", "C", "D"].forEach(letter => {
            const p = document.createElement("p");

            let line = letter + ". " + item.options[letter];

            if (letter === item.correct) {
                line += " — Correct answer";
            }

            if (letter === item.selected) {
                line += " — Your answer";
            }

            p.textContent = line;
            card.appendChild(p);
        });

        const status = document.createElement("p");
        status.className = isCorrect ? "correct-text" : "wrong-text";

        status.textContent = !item.selected
            ? "Not answered"
            : isCorrect
                ? "Your answer is correct"
                : "Your answer is incorrect";

        card.appendChild(status);

        const explanation = document.createElement("p");
        explanation.textContent =
            "Explanation: " +
            (item.explanation || "No explanation provided.");

        card.appendChild(explanation);
        container.appendChild(card);
    });

    container.scrollIntoView({ behavior: "smooth" });
});

/* ==========================================
   RESULTS PAGE NAVIGATION
   ========================================== */

$("resultsButton").addEventListener("click", () => {
    if (!lastResult) {
        alert("You have not completed a practice or mock exam yet.");
        return;
    }

    $("resultCandidate").textContent = lastResult.candidate;
    $("totalQuestions").textContent = lastResult.total;
    $("attemptedQuestions").textContent = lastResult.attempted;
    $("correctCount").textContent = lastResult.correct;
    $("wrongCount").textContent = lastResult.wrong;
    $("unansweredCount").textContent = lastResult.unanswered;
    $("scorePercentage").textContent = lastResult.percentage + "%";

    showPage("resultPage");
});

$("returnHomeButton").addEventListener("click", () => {
    stopTimer();
    $("categorySelect").disabled = false;
    showPage("dashboardPage");
});

$("backDashboardButton").addEventListener("click", () => {
    stopTimer();
    $("categorySelect").disabled = false;
    showPage("dashboardPage");
});

/* ==========================================
   LOGOUT
   ========================================== */

$("logoutButton").addEventListener("click", () => {
    if (!confirm("Are you sure you want to log out?")) return;

    stopTimer();

    candidate = { name: "", email: "" };
    answers = {};
    lastResult = null;
    lastReview = [];
    submitted = false;

    $("loginForm").reset();
    $("categorySelect").disabled = false;

    showPage("loginPage");
});