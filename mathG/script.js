// MODE SELECTION ELEMENTS
const modeContainer = document.getElementById("mode-container");
const learnNumbersBtn = document.getElementById("learn-numbers-btn");
const mathQuizBtn = document.getElementById("math-quiz-btn");
const logoutBtn = document.getElementById("logout-btn");

// GAME ELEMENTS
const gameContainer = document.getElementById("game-container");
const gameTitle = document.getElementById("game-title");
const questionContainer = document.getElementById("question");
const answerContainer = document.getElementById("answer-container");
const feedbackContainer = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const backButton = document.getElementById("back-btn");
const revealBtn = document.getElementById("reveal-btn");

let mode = ""; // "numbers" or "quiz"

// NUMBERS MODE (0-10)
const numbers = Array.from({ length: 11 }, (_, i) => i);

// MATH QUIZ MODE with three difficulty levels:
const quizLevels = {
  simple: [
    { question: "What is 2 + 3?", correctAnswer: 5, options: [4, 5, 6, 7] },
    { question: "What is 5 - 2?", correctAnswer: 3, options: [2, 3, 4, 5] },
    { question: "What is 2 x 2?", correctAnswer: 4, options: [3, 4, 5, 6] },
    { question: "What is 6 ÷ 2?", correctAnswer: 3, options: [2, 3, 4, 5] }
  ],
  medium: [
    { question: "What is 7 + 8?", correctAnswer: 15, options: [14, 15, 16, 17] },
    { question: "What is 10 - 6?", correctAnswer: 4, options: [3, 4, 5, 6] },
    { question: "What is 3 x 4?", correctAnswer: 12, options: [10, 12, 14, 16] },
    { question: "What is 8 ÷ 2?", correctAnswer: 4, options: [3, 4, 5, 6] }
  ],
  hard: [
    { question: "What is 12 + 15?", correctAnswer: 27, options: [25, 26, 27, 28] },
    { question: "What is 20 - 9?", correctAnswer: 11, options: [10, 11, 12, 13] },
    { question: "What is 6 x 3?", correctAnswer: 18, options: [16, 17, 18, 19] },
    { question: "What is 24 ÷ 3?", correctAnswer: 8, options: [7, 8, 9, 10] }
  ]
};
const difficulties = ["simple", "medium", "hard"];
let currentDifficultyIndex = 0;
let currentQuestionIndex = 0;
let attempts = 0;

// MODE SELECTION HANDLERS
learnNumbersBtn.onclick = function() {
  mode = "numbers";
  gameTitle.textContent = "Learn Numbers (0-10)";
  loadNumbers();
  modeContainer.style.display = "none";
  gameContainer.style.display = "block";
};

mathQuizBtn.onclick = function() {
  mode = "quiz";
  currentDifficultyIndex = 0;
  currentQuestionIndex = 0;
  gameTitle.textContent = "Math Quiz (" + difficulties[currentDifficultyIndex].toUpperCase() + ")";
  loadQuizQuestion();
  modeContainer.style.display = "none";
  gameContainer.style.display = "block";
};

logoutBtn.onclick = function() {
  // Replace with your actual logout logic. Here we simulate logout by redirecting.
  window.location.href = "login.html";
};

// NUMBERS MODE FUNCTION
function loadNumbers() {
  questionContainer.textContent = "";
  answerContainer.innerHTML = "";
  feedbackContainer.textContent = "";
  nextButton.style.display = "none";
  
  // Back button returns to home in numbers mode.
  backButton.onclick = function() {
    modeContainer.style.display = "block";
    gameContainer.style.display = "none";
  };
  
  numbers.forEach(num => {
    const btn = document.createElement("button");
    btn.classList.add("answer-btn");
    btn.textContent = num;
    btn.onclick = () => speakText(num.toString());
    answerContainer.appendChild(btn);
  });
}

// MATH QUIZ MODE FUNCTION
function loadQuizQuestion() {
  questionContainer.textContent = "";
  answerContainer.innerHTML = "";
  feedbackContainer.textContent = "";
  nextButton.disabled = true;
  revealBtn.disabled = true;
  attempts = 0;
  
  // Back button for quiz mode:
  backButton.onclick = function() {
    // If we're not at the first question, go back one question.
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuizQuestion();
    } else if (currentDifficultyIndex > 0) {
      // If at first question of current difficulty and previous difficulty exists,
      // go to previous difficulty's last question.
      currentDifficultyIndex--;
      const prevLevelQuestions = quizLevels[difficulties[currentDifficultyIndex]];
      currentQuestionIndex = prevLevelQuestions.length - 1;
      gameTitle.textContent = "Math Quiz (" + difficulties[currentDifficultyIndex].toUpperCase() + ")";
      loadQuizQuestion();
    } else {
      // At first question of the first difficulty, so return to home.
      modeContainer.style.display = "block";
      gameContainer.style.display = "none";
    }
  };
  
  let difficulty = difficulties[currentDifficultyIndex];
  let questions = quizLevels[difficulty];
  const q = questions[currentQuestionIndex];
  questionContainer.textContent = q.question;
  speakText("Question: " + q.question);
  
  // Shuffle answer options
  const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
  shuffledOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("answer-btn");
    btn.textContent = option;
    btn.onclick = () => checkQuizAnswer(option);
    answerContainer.appendChild(btn);
  });
}

// Check Answer for Quiz Mode
function checkQuizAnswer(selectedAnswer) {
  let difficulty = difficulties[currentDifficultyIndex];
  let questions = quizLevels[difficulty];
  const correctAnswer = questions[currentQuestionIndex].correctAnswer;
  
  if (selectedAnswer === correctAnswer) {
    feedbackContainer.textContent = "Correct! Well done!";
    feedbackContainer.style.color = "#4CAF50";
    speakText("Correct! Well done!");
    nextButton.disabled = false;
  } else {
    feedbackContainer.textContent = "Oops! Try again.";
    feedbackContainer.style.color = "#f44336";
    speakText("Oops! Try again.");
    attempts++;
    if (attempts >= 2) {
      revealBtn.disabled = false;
    }
  }
}

// Navigation for Quiz Mode
nextButton.onclick = function() {
  let difficulty = difficulties[currentDifficultyIndex];
  let questions = quizLevels[difficulty];
  
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuizQuestion();
  } else {
    // Finished current difficulty level
    if (currentDifficultyIndex < difficulties.length - 1) {
      currentDifficultyIndex++;
      currentQuestionIndex = 0;
      gameTitle.textContent = "Math Quiz (" + difficulties[currentDifficultyIndex].toUpperCase() + ")";
      loadQuizQuestion();
    } else {
      nextButton.textContent = "Finished";
      speakText("Congratulations! You have completed the quiz!");
      // Optionally, add logic to return home or restart.
    }
  }
};

revealBtn.onclick = function() {
  let difficulty = difficulties[currentDifficultyIndex];
  let questions = quizLevels[difficulty];
  const correctAnswer = questions[currentQuestionIndex].correctAnswer;
  speakText("The correct answer is " + correctAnswer);
  feedbackContainer.textContent = "The correct answer is " + correctAnswer;
};

// COMMON VOICE SYNTHESIS FUNCTION
function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }
}
