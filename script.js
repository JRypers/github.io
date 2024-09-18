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
        this.nextReview = Date.now() + this.interval * 86400000;
    }
}

class SpacedRepetitionApp {
    constructor() {
        this.flashcards = [];
        this.currentFlashcard = null;
        this.currentUser = null;
    }

    loadFlashcards() {
        const savedFlashcards = localStorage.getItem(`flashcards_${this.currentUser}`);
        if (savedFlashcards) {
            this.flashcards = JSON.parse(savedFlashcards).map(f =>
                new Flashcard(f.question, f.answer, f.interval, f.nextReview)
            );
        } else {
            // Load default flashcards for new users
            this.flashcards = [
                new Flashcard("Cognitive load theory", "In het korte-termijn geheugen past slechts een kleine hoeveelheid informatie. Je kan het geheugen dus maar beperkt belasten voor het blokkeert."),
                new Flashcard("Het coherentieprincipe", "Je leert beter als er geen extra zaken zijn die je afleiden. Dit betekent dat extra informatie en afbeeldingen die niet relevant zijn voor de boodschap vermeden moeten worden."),
                new Flashcard("Het modaliteitsprincipe", "Je leert beter van beelden en gesproken woorden dan van beelden en geschreven tekst. Dit benadrukt het belang van auditieve ondersteuning bij visuele informatie."),
                new Flashcard("Het multimediaprincipe", "Je leert beter van een combinatie van woorden en beelden dan van woorden alleen. Dit principe benadrukt het belang van visuele ondersteuning bij leren."),
                new Flashcard("Het personalisatieprincipe", "Je leert beter als je op een informele manier wordt aangesproken in plaats van op een formele manier. Dit betekent dat een academische toon, lange zinnen of complexe bewoordingen vermeden moeten worden."),
                new Flashcard("Het principe van redundantie", "Je leert beter van afbeeldingen en gesproken tekst dan van afbeeldingen, gesproken tekst en tekst op het scherm. Dit betekent dat overbodige informatie vermeden moet worden."),
                new Flashcard("Het ruimtelijke nabijheidsprincipe", "Je leert beter als woorden en beelden dicht bij elkaar staan. Dit helpt om de relatie tussen de informatie te verduidelijken."),
                new Flashcard("Het signaleringsprincipe", "Je leert beter als belangrijke zaken worden benadrukt. Dit helpt om de aandacht te vestigen op de meest relevante informatie."),
                new Flashcard("Het stemprincipe", "Je leert beter als de stem vriendelijk en menselijk is, in plaats van een machinestem. Dit maakt de leerervaring aangenamer."),
                new Flashcard("Het temporele nabijheidsprincipe", "Je leert beter wanneer woorden en beelden tegelijkertijd worden afgespeeld. Dit bevordert de synchronisatie van informatie."),
                new Flashcard("Het beeldprincipe", "Je leert echt niet beter als je het gezicht van de spreker ziet. Je trekt de aandacht beter naar wat er op het scherm getoond wordt."),
                new Flashcard("Het segmenteringsprincipe", "Je leert beter als een les is opgedeeld in kleinere delen en je zelf het tempo bepaalt."),
                new Flashcard("Het pre-training principe", "Je leert beter als je de hoofdconcepten al kent. Op die manier kan je complexere onderwerpen en processen sneller begrijpen."),
                new Flashcard("Bewegen", "Bewegen zorgt voor zuurstof in het brein, waardoor je beter informatie kan opnemen."),
                new Flashcard("Spaced Repetition", "Zonder herhaling vergeten we zeer snel wat we geleerd hebben. Met herhaling kan je die vergeetcurve afremmen en sterk verminderen."),
                new Flashcard("Retrieval Practice", "Het effect van herhaling is nog sterker als je de deelnemer actief laat graven in diens geheugen om het geleerde te herinneren, bv. door een quiz."),
                new Flashcard("Expanding (Spaced Repetion of Retrieval Practice"), "Elke keer je herhaalt, vertraag je de vergeetcurve. Je kan je herhaalmomenten dus steeds verder spreiden in de tijd."),
                // Add more default flashcards here
            ];
        }
    }

    saveFlashcards() {
        localStorage.setItem(`flashcards_${this.currentUser}`, JSON.stringify(this.flashcards, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));
    }

    addFlashcard(question, answer) {
        this.flashcards.push(new Flashcard(question, answer));
        this.saveFlashcards();
    }

    getDueFlashcard() {
        const currentTime = Date.now();
        console.log("Current time:", new Date(currentTime));
        const dueFlashcards = this.flashcards.filter(f => {
            console.log("Flashcard:", f.question, "Next review:", new Date(f.nextReview));
            return currentTime >= f.nextReview;
        });
        console.log("Due flashcards:", dueFlashcards.length);
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

document.addEventListener('DOMContentLoaded', () => {
    const app = new SpacedRepetitionApp();

    // DOM elements
    const loginSection = document.getElementById('login-section');
    const flashcardSection = document.getElementById('flashcard-section');
    const addQuestionSection = document.getElementById('add-question-section');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('login-button');
    const loginMessage = document.getElementById('login-message');
    const flashcardElement = document.getElementById('flashcard');
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');
    const feedbackButtons = document.getElementById('feedback-buttons');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const newQuestionInput = document.getElementById('new-question');
    const newAnswerInput = document.getElementById('new-answer');
    const addQuestionButton = document.getElementById('add-question');

    function displayFlashcard() {
        const flashcard = app.getDueFlashcard();
        if (flashcard) {
            questionText.textContent = flashcard.question;
            answerText.textContent = flashcard.answer;
            flashcardElement.classList.remove('flipped');
            feedbackButtons.classList.add('hidden');
        } else {
            questionText.textContent = 'No flashcards due at the moment. Check back later!';
            answerText.textContent = '';
            feedbackButtons.classList.add('hidden');
        }
    }

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

    yesButton.addEventListener('click', () => {
        app.processAnswer(true);
        displayFlashcard();
    });

    noButton.addEventListener('click', () => {
        app.processAnswer(false);
        displayFlashcard();
    });

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

    loginButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (email === 'jan.rypers@colruytgroup.com') {
            if (passwordInput.classList.contains('hidden')) {
                // First click for special user, show password field
                passwordInput.classList.remove('hidden');
                loginMessage.textContent = 'Please enter your password.';
            } else {
                // Second click for special user, check password
                if (passwordInput.value === 'Colruyt12') {
                    login(email, true);
                } else {
                    loginMessage.textContent = 'Incorrect password';
                }
            }
        } else {
            login(email, false);
        }
    });

    function login(email, isSpecialUser) {
        app.currentUser = email;
        app.loadFlashcards();
        loginSection.classList.add('hidden');
        flashcardSection.classList.remove('hidden');
        if (isSpecialUser) {
            addQuestionSection.classList.remove('hidden');
        }
        displayFlashcard();
    }

    // Check for due flashcards periodically
    setInterval(displayFlashcard, 60000);
});
