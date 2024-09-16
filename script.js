class Flashcard {
    constructor(question, answer, interval = 1, nextReview = Date.now()) {
        this.question = question;
        this.answer = answer;
        this.interval = interval;
        this.nextReview = nextReview;
    }

    updateInterval(correct) {
        if (correct) {
            this.interval *= 2;
        } else {
            this.interval = Math.max(1, Math.floor(this.interval / 2));
        }
        this.nextReview = Date.now() + this.interval * 86400000; // Set next review time in milliseconds
    }
}

class SpacedRepetitionApp {
    constructor() {
        this.flashcards = [];
        this.currentFlashcard = null;
        this.loadFlashcards();
    }

    loadFlashcards() {
        const savedFlashcards = localStorage.getItem('flashcards');
        if (savedFlashcards) {
            this.flashcards = JSON.parse(savedFlashcards).map(f => 
                new Flashcard(f.question, f.answer, f.interval, f.nextReview)
            );
        }
    }

    saveFlashcards() {
        localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
    }

    addFlashcard(question, answer) {
        this.flashcards.push(new Flashcard(question, answer));
        this.saveFlashcards();
    }

    getDueFlashcard() {
        const currentTime = Date.now();
        const dueFlashcards = this.flashcards.filter(f => currentTime >= f.nextReview);
        if (dueFlashcards.length > 0) {
            this.currentFlashcard = dueFlashcards[Math.floor(Math.random() * dueFlashcards.length)];
            return this.currentFlashcard;
        }
        return null;
    }

    processAnswer(correct) {
        if (this.currentFlashcard) {
            this.currentFlashcard.updateInterval(correct);
            this.saveFlashcards();
        }
    }
}

// Initialize the app
const app = new SpacedRepetitionApp();

// DOM elements
const flashcardElement = document.getElementById('flashcard');
const questionSide = document.getElementById('question-side');
const answerSide = document.getElementById('answer-side');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const feedbackButtons = document.getElementById('feedback-buttons');
const yesButton = document.getElementById('yes-button');
const noButton = document.getElementById('no-button');
const newQuestionInput = document.getElementById('new-question');
const newAnswerInput = document.getElementById('new-answer');
const addQuestionButton = document.getElementById('add-question');

// Function to display the current flashcard
function displayFlashcard() {
    const flashcard = app.getDueFlashcard();
    if (flashcard) {
        questionText.textContent = flashcard.question;
        answerText.textContent = flashcard.answer;
        flashcardElement.classList.remove('flipped');
        feedbackButtons.classList.add('hidden');
    } else {
        questionText.textContent = 'No flashcards due at the moment. Add new flashcards or wait for the next review cycle.';
        answerText.textContent = '';
        feedbackButtons.classList.add('hidden');
    }
}

// Flashcard click event
flashcardElement.addEventListener('click', () => {
    if (app.currentFlashcard) {
        flashcardElement.classList.toggle('flipped');
        if (flashcardElement.classList.contains('flipped')) {
            feedbackButtons.classList.remove('hidden');
        } else {
            feedbackButtons.classList.add('hidden');
        }
    }
});

// Yes button click event
yesButton.addEventListener('click', () => {
    app.processAnswer(true);
    displayFlashcard();
});

// No button click event
noButton.addEventListener('click', () => {
    app.processAnswer(false);
    displayFlashcard();
});

// Add flashcard button click event
addQuestionButton.addEventListener('click', () => {
    const newQuestion = newQuestionInput.value.trim();
    const newAnswer = newAnswerInput.value.trim();
    if (newQuestion && newAnswer) {
        app.addFlashcard(newQuestion, newAnswer);
        newQuestionInput.value = '';
        newAnswerInput.value = '';
        displayFlashcard();
    } else {
        alert('Please enter both a question and an answer.');
    }
});

// Initial display
displayFlashcard();

// Check for due flashcards periodically
setInterval(displayFlashcard, 60000); // Check every minute