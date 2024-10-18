document.addEventListener("DOMContentLoaded", () => {
    const difficultyForm = document.getElementById("difficultyForm");
    const categorySelect = document.getElementById("category");
    const quizSection = document.getElementById("quizSection");
    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const resultMessage = document.getElementById("resultMessage");
    const correctCountElement = document.getElementById("correctCount");
    const incorrectCountElement = document.getElementById("incorrectCount");
    const resetScoreButton = document.getElementById("resetScore");
    const nextQuestionButton = document.getElementById("nextQuestion");
    const submitAnswerButton = document.getElementById("submitAnswer");
  
    let selectedAnswer = null;
    let correctCount = parseInt(localStorage.getItem("correctCount")) || 0;
    let incorrectCount = parseInt(localStorage.getItem("incorrectCount")) || 0;
    const apiKey = "kaAgZz3QaZazrbopidO1RigaDC3Ud2cBQg1KOfsV";
  
    correctCountElement.textContent = correctCount;
    incorrectCountElement.textContent = incorrectCount;
  
    fetchCategories();
  
    difficultyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const difficulty = document.getElementById("difficulty").value;
      const category = document.getElementById("category").value;
      if (!difficulty || !category) return;
  
      const questionData = await fetchQuestion(difficulty, category);
      displayQuestion(questionData);
    });
  
    async function fetchQuestion(difficulty, category) {
      const response = await fetch(
        `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&limit=1&difficulty=${difficulty}&category=${category}`
      );
      const data = await response.json();
      return data[0];
    }
  
    async function fetchCategories() {
      const response = await fetch(
        `https://quizapi.io/api/v1/categories?apiKey=${apiKey}`
      );
      const categories = await response.json();
  
      categories
        .filter(
          (category) =>
            category.name !== "bash" && category.name !== "uncategorized"
        )
        .forEach((category) => {
          const option = document.createElement("option");
          option.value = category.name;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
    }
  
    function displayQuestion(questionData) {
      quizSection.style.display = "block";
      questionElement.textContent = questionData.question;
      answersElement.innerHTML = "";
      resultMessage.textContent = "";
      selectedAnswer = null;
  
      Object.keys(questionData.answers).forEach((key) => {
        if (questionData.answers[key]) {
          const answerButton = document.createElement("button");
          answerButton.className =
            "bg-gray-200 py-2 px-4 rounded hover:bg-gray-400";
          answerButton.textContent = questionData.answers[key];
          answerButton.dataset.correct =
            questionData.correct_answers[`${key}_correct`];
          answerButton.addEventListener("click", (e) => selectAnswer(e, key));
          answersElement.appendChild(answerButton);
        }
      });
  
      nextQuestionButton.style.display = "none";
      submitAnswerButton.style.display = "block";
    }
  
    function selectAnswer(e, key) {
      e.preventDefault();
      selectedAnswer = {
        correct: e.target.dataset.correct,
        element: e.target,
      };
  
      Array.from(answersElement.children).forEach((button) => {
        button.classList.remove("bg-blue-200", "bg-red-200");
      });
  
      e.target.classList.add("bg-blue-200");
    }
  
    submitAnswerButton.addEventListener("click", (e) => {
      e.preventDefault();
  
      if (!selectedAnswer) {
        resultMessage.textContent = "Please select an answer!";
        resultMessage.className = "text-yellow-500 font-bold";
        return;
      }
  
      const isCorrect = selectedAnswer.correct === "true";
  
      if (isCorrect) {
        correctCount++;
        resultMessage.textContent = "Correct! Well done.";
        resultMessage.className = "text-green-500 font-bold";
        selectedAnswer.element.classList.add("bg-green-200");
      } else {
        incorrectCount++;
        resultMessage.textContent = "Incorrect! Better luck next time.";
        resultMessage.className = "text-red-500 font-bold";
        selectedAnswer.element.classList.add("bg-red-200");
      }
  
      localStorage.setItem("correctCount", correctCount);
      localStorage.setItem("incorrectCount", incorrectCount);
      correctCountElement.textContent = correctCount;
      incorrectCountElement.textContent = incorrectCount;
  
      submitAnswerButton.style.display = "none";
      nextQuestionButton.style.display = "block";
    });
  
    nextQuestionButton.addEventListener("click", async () => {
      const difficulty = document.getElementById("difficulty").value;
      const category = document.getElementById("category").value;
      const questionData = await fetchQuestion(difficulty, category);
      displayQuestion(questionData);
    });
  
    resetScoreButton.addEventListener("click", () => {
      correctCount = 0;
      incorrectCount = 0;
      localStorage.setItem("correctCount", correctCount);
      localStorage.setItem("incorrectCount", incorrectCount);
      correctCountElement.textContent = correctCount;
      incorrectCountElement.textContent = incorrectCount;
    });
  });
  