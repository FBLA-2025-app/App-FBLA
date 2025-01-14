

const musicAudio = document.getElementById('musicAudio');
if (musicAudio) { 
    musicAudio.volume = 0.5;
}
const correctAudio = document.getElementById("correctAudio");
const wrongAudio = document.getElementById('incorrectAudio');
if (wrongAudio) { 
    wrongAudio.volume = 0.3;
}
let units = [];
let audioEnabled = localStorage.getItem("audioEnabled") === "true";
let musicEnabled = localStorage.getItem("musicEnabled") === "true";
if (window.location.pathname.includes("settings.html")) {
    if (audioEnabled) {
        document.getElementById('toggle-audio').checked = true;
    }

    if (musicEnabled) {
        document.getElementById('toggle-music').checked = true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchUnits();
    setupEventListeners();
    
    if (musicEnabled) { 
        musicAudio.play();
    }

  const currentUnit = localStorage.getItem("currentUnit");
  if (currentUnit !== null) {
    setTimeout(() => {
      handleUnitSelect({ target: { value: currentUnit } });
      localStorage.removeItem("currentUnit");
    }, 300);
  }
});

if (localStorage.getItem("loggedIn") !== "true") {
  localStorage.setItem("loggedIn", "false");
}

if (window.location.pathname.includes("index.html") || window.location.pathname.includes("profile.html") || window.location.pathname.includes("settings.html")) {
  const logoSvg = document.getElementById("logo-svg");
  const randomSrc = Math.floor(Math.random() * 3) + 1;
  logoSvg.src = `../assets/quickmathlogo-0${randomSrc}.svg`;
  if (window.location.pathname.includes("profile.html")) {
    if (localStorage.getItem("loggedIn") === "true") {
      const logoSvg = document.getElementById("logo-svg");
      const randomSrc = Math.floor(Math.random() * 3) + 1;
      logoSvg.src = `../assets/quickmathlogo-0${randomSrc}.svg`;

    }
  }
}

async function fetchUnits() {
  try {
    const response = await fetch("../data/units.json");
    const data = await response.json();
    units = data.units;
    console.log(units);
    populateUnitSelect();
  } catch (error) {
    console.error("Error fetching units:", error);
  }
}

function setupEventListeners() {
  const unitSelect = document.getElementById("unitSelect");
  const homeBtn = document.getElementById("homeBtn");
  const profileBtn = document.getElementById("profileBtn");
  const settingsBtn = document.getElementById("settingsBtn");

  if (unitSelect) {
    unitSelect.addEventListener("change", handleUnitSelect);
  }

  homeBtn.addEventListener("click", () => navigateTo("index.html"));
  profileBtn.addEventListener("click", () => navigateTo("profile.html"));
    settingsBtn.addEventListener("click", () => navigateTo("settings.html"));
    

    homeBtn.addEventListener('click', () => {
        // JavaScript function to play the audio
        const audio = document.getElementById("audio2");
        if (audio) {
            audio.currentTime = 0; // Reset the audio to the beginning
            audio.play(); // Play the audio
            audio.onended = () => {
                window.location.href = 'index.html'; // Navigate to home.html
            };
        } else {
            console.error("Audio element with id 'audio2' not found!");
            window.location.href = 'index.html'; // Fallback navigation
        }
        
        // navigateTo('index.html')
    })
;
    profileBtn.addEventListener('click', () => {
        // JavaScript function to play the audio

        const audio = document.getElementById("audio2");
        
        
        audio.currentTime = 0; // Reset the audio to the beginning
        audio.play(); // Play the audio
        audio.onended = () => {
            window.location.href = 'profile.html'; // Navigate to home.html
        };

        // navigateTo('index.html')
    })
        
    settingsBtn.addEventListener('click', () => navigateTo('settings.html'));
}

function playAudio() {
    const audio = document.getElementById("audio");
    audio.currentTime = 0; // Reset the audio to the beginning
    audio.play(); // Play the audio
}


function navigateTo(page) {
  window.location.href = page;
}

function populateUnitSelect() {
  const unitSelect = document.getElementById("unitSelect");
  if (!unitSelect) return;

  units.forEach((unit, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = unit.unitName;
    if (index !== 0 && !isUnitCompleted(index - 1)) {
      option.disabled = true;
    }
    unitSelect.appendChild(option);
  });
}

function handleUnitSelect(event) {
  const selectedUnitIndex = event.target.value;
  populateLevelList(selectedUnitIndex);
  const homeLogo = document.getElementById("home-logo");
  homeLogo.innerHTML = "";
}

function populateLevelList(unitIndex) {
  const levelList = document.getElementById("levelList");
  if (levelList) {
    levelList.innerHTML = "";
  }

  units[unitIndex].levels.forEach((level, index) => {
    const levelButton = document.createElement("button");
    levelButton.className = "level-button";
    levelButton.textContent = `Level ${level.level}`;
    if (index !== 0 && !isLevelCompleted(unitIndex, index - 1)) {
      levelButton.disabled = true;
      levelButton.classList.add("disabled-level");
    } else {
      levelButton.classList.add("active-level");
    }
    levelButton.addEventListener("click", () => startLevel(unitIndex, index));
    if (levelList) {
      levelList.appendChild(levelButton);
    }
  });
}

function startLevel(unitIndex, levelIndex) {
  localStorage.setItem("currentUnit", unitIndex);
  localStorage.setItem("currentLevel", levelIndex);
  localStorage.setItem("incorrectAnswers", 0);
  window.location.href = "level.html";
}

if (window.location.pathname.includes("level.html")) {
  const unitIndex = localStorage.getItem("currentUnit");
  const levelIndex = localStorage.getItem("currentLevel");
  if (unitIndex !== null && levelIndex !== null) {
    setTimeout(() => {
      displayQuestion(unitIndex, levelIndex, 0);
    }, 300);
  }
}

function updateProgressBar(unitIndex, levelIndex, questionIndex) {
  const unit = units[unitIndex];
  const level = unit.levels[levelIndex];
  const totalQuestions = level.problems.length;
  const progress = (questionIndex / totalQuestions) * 100;
  document.getElementById("progress-bar").style.width = `${progress}%`;
}

function displayQuestion(unitIndex, levelIndex, questionIndex) {
  console.log(units);
  const unit = units[unitIndex];
  const level = unit.levels[levelIndex];
  const problem = level.problems[questionIndex];

  document.getElementById(
    "levelTitle"
  ).textContent = `${unit.unitName} - Level ${level.level}`;
  document.getElementById("problemTitle").textContent = `Problem ${questionIndex + 1
    }`;
  document.getElementById("question").textContent = problem.question;

  const answersContainer = document.getElementById("answers");
  answersContainer.innerHTML = "";

  updateProgressBar(unitIndex, levelIndex, questionIndex);

  const shuffledAnswers = shuffleArray(problem.answers);

  shuffledAnswers.forEach((answer, index) => {
    const answerButton = document.createElement("button");
    answerButton.className = "answer-button";
    answerButton.textContent = answer;
    answerButton.addEventListener("click", () =>
      checkAnswer(unitIndex, levelIndex, questionIndex, index)
    );
    answersContainer.appendChild(answerButton);
  });

  const calculatorContainer = document.getElementById("calculatorContainer");
  calculatorContainer.innerHTML = "";

  if (problem.calculatorActive) {
    const calculatorButton = document.createElement("button");
    calculatorButton.textContent = "Open Calculator";
    calculatorButton.id = "calc-toggle-button";

    calculatorButton.addEventListener("click", toggleCalculator);
    calculatorContainer.appendChild(calculatorButton);
    const calculatorIcon = document.createElement("i");
    calculatorIcon.className = "fa-solid fa-calculator";
    calculatorIcon.style.marginLeft = "5px";
    calculatorButton.appendChild(calculatorIcon);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function toggleCalculator() {
  const calculator = document.getElementById("calculator");
  const calculatorButton = document.getElementById("calc-toggle-button");
  calculator.style.display =
    calculator.style.display === "none" ? "block" : "none";
  const calculatorIcon = document.createElement("i");
  calculatorIcon.className = "fa-solid fa-calculator";
  calculatorIcon.style.marginLeft = "5px";

  if (calculator.style.display === "block") {
    setupCalculator();
    calculatorButton.textContent = "Close Calculator";
    calculatorButton.appendChild(calculatorIcon);
  } else {
    calculatorButton.textContent = "Open Calculator";
    calculatorButton.appendChild(calculatorIcon);
  }
}

function setupCalculator() {
  const display = document.getElementById("calcDisplay");
  const buttons = document.querySelectorAll(".calc-btn");

  let currentExpression = "";

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.value;
      const action = button.dataset.action;

      if (action === "clear") {
        currentExpression = "";
        display.textContent = "0";
      } else if (action === "delete") {
        currentExpression = currentExpression.slice(0, -1);
        display.textContent = currentExpression || "0";
      } else if (value === "=") {
        try {
          const result = await calculateExpression(currentExpression);
          display.textContent = result;
          currentExpression = result.toString();
        } catch (error) {
          display.textContent = "Error";
          currentExpression = "";
        }
      } else {
        currentExpression += value;
        display.textContent = currentExpression;
      }
    });
  });
}

async function calculateExpression(expression) {
  const response = await fetch(
    `https://api.mathjs.org/v4/?expr=${encodeURIComponent(expression)}`
  );
  if (!response.ok) {
    throw new Error("Failed to calculate expression.");
  }
  const result = await response.text();
  return result;
}

function checkAnswer(unitIndex, levelIndex, questionIndex, answerIndex) {
  const problem = units[unitIndex].levels[levelIndex].problems[questionIndex];
  const isCorrect = problem.answers[answerIndex] === problem.correctAnswer;

  if (isCorrect) {
      correctAnim("Correct!");
      if (audioEnabled) {
          correctAudio.play();
      }
    updateProgressBar(unitIndex, levelIndex, questionIndex + 1);

    const calculator = document.getElementById("calculator");
    calculator.style.display = "none";
    if (
      questionIndex <
      units[unitIndex].levels[levelIndex].problems.length - 1
    ) {
      displayQuestion(unitIndex, levelIndex, questionIndex + 1);
    } else {
      if (parseInt(levelIndex) === units[unitIndex].levels.length - 1) {
        markLevelCompleted(unitIndex, levelIndex);
        setTimeout(() => {
          levelCompleteAnim("Level completed!");
          setTimeout(() => {
            markUnitCompleted(unitIndex);
            unitCompleteAnim("Unit completed!");
            localStorage.setItem("currentUnit", unitIndex);
            setTimeout(() => {
              window.location.href = "index.html";
            }, 2000);
          }, 2000);
        }, 2000);
      } else {
        markLevelCompleted(unitIndex, levelIndex);
        setTimeout(() => {
          levelCompleteAnim("Level completed!");
          localStorage.setItem("currentUnit", unitIndex);
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        }, 2000);
      }
    }
  } else {
      incorrectAnim("Incorrect. Try again!");
      if (audioEnabled) { 
          wrongAudio.play();
      }
    localStorage.setItem(
      "incorrectAnswers",
      parseInt(localStorage.getItem("incorrectAnswers")) + 1
    );
    console.log(localStorage.getItem("incorrectAnswers"));
  }
}

function showModal(message, color) {
  const modalOverlay = document.getElementById("modal-overlay");
  const modalMessage = document.getElementById("modal-message");
  modalMessage.innerHTML = "";

  //   modalMessage.textContent = message;
  const modalIcon = document.createElement("i");
  const modalMessageText = document.createElement("p");
  if (color === "green" || color === "blue" || color === "darkorchid") {
    modalIcon.className = "fa-solid fa-check-circle";
    modalMessageText.textContent = message;
  } else {
    modalIcon.className = "fa-solid fa-exclamation-circle";
    modalMessageText.textContent = message;
  }
  modalMessage.appendChild(modalIcon);
  modalMessage.appendChild(modalMessageText);
  modalMessage.style.backgroundColor = color;

  modalOverlay.classList.remove("hidden");
  setTimeout(() => {
    modalOverlay.style.opacity = 1;
    modalOverlay.style.visibility = "visible";
  }, 10);

  setTimeout(() => {
    modalOverlay.style.opacity = 0;
    modalOverlay.style.visibility = "hidden";
    setTimeout(() => {
      modalOverlay.classList.add("hidden");
    }, 500);
  }, 1500);
}

function correctAnim(message) {
  showModal(message, "green");
}

function incorrectAnim(message) {
  showModal(message, "red");
}

function levelCompleteAnim(message) {
  showModal(message, "blue");
}

function unitCompleteAnim(message) {
  showModal(message, "darkorchid");
}

function isUnitCompleted(unitIndex) {
  return localStorage.getItem(`unit_${unitIndex}_completed`) === "true";
}

function isLevelCompleted(unitIndex, levelIndex) {
  return (
    localStorage.getItem(`unit_${unitIndex}_level_${levelIndex}_completed`) ===
    "true"
  );
}

function markLevelCompleted(unitIndex, levelIndex) {
  localStorage.setItem(
    `unit_${unitIndex}_level_${levelIndex}_completed`,
    "true"
  );
  if (levelIndex === units[unitIndex].levels.length - 1) {
    localStorage.setItem(`unit_${unitIndex}_completed`, "true");
  }
}

function markUnitCompleted(unitIndex) {
  localStorage.setItem(`unit_${unitIndex}_completed`, "true");
}

if (window.location.pathname.includes("profile.html")) {
  const signUpForm = document.getElementById("sign-up-form");
  const logInForm = document.getElementById("log-in-form");
  const toggleAuthFormsButton = document.getElementById("toggle-auth-forms");
  const profileContainer = document.getElementById("profile-container");
  const profileInfo = document.getElementById("profile-info");
  const submitFeedbackButton = document.getElementById("submit-feedback");

  toggleAuthFormsButton.addEventListener("click", () => {
    signUpForm.classList.toggle("profile-hidden");
    logInForm.classList.toggle("profile-hidden");
    toggleAuthFormsButton.textContent = signUpForm.classList.contains(
      "profile-hidden"
    )
      ? "Switch to Sign Up"
      : "Switch to Log In";
  });

  document.getElementById("sign-up-button").addEventListener("click", () => {
    const username = document.getElementById("sign-up-username").value;
    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;

    if (username && email && password) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const emailExists = users.some((user) => user.email === email);

      if (emailExists) {
        alert("Email already exists. Please use a different email.");
      } else {
        users.push({ username, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Sign up successful! Please log in.");
        signUpForm.classList.add("profile-hidden");
        logInForm.classList.remove("profile-hidden");
        toggleAuthFormsButton.textContent = "Switch to Sign Up";
      }
    } else {
      alert("Please fill in all fields.");
    }
  });

  document.getElementById("log-in-button").addEventListener("click", () => {
    const email = document.getElementById("log-in-email").value;
    const password = document.getElementById("log-in-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("loggedIn", "true");
      displayProfile(user);
    } else {
      alert("Invalid email or password.");
    }
  });

  submitFeedbackButton.addEventListener("click", () => {
    const feedbackText = document.getElementById("feedback-text").value;
    if (feedbackText) {
      const feedback = JSON.parse(localStorage.getItem("appFeedback")) || [];
      feedback.push(feedbackText);
      localStorage.setItem("appFeedback", JSON.stringify(feedback));
      alert("Feedback submitted!");
      document.getElementById("feedback-text").value = "";
    } else {
      alert("Please enter your feedback.");
    }
  });

  function displayProfile(user) {
    document.getElementById("auth-container").classList.add("profile-hidden");
    profileContainer.classList.remove("profile-hidden");
    // profileInfo.textContent = `Username: ${user.username}\nEmail: ${user.email}`;
    const profileUsername = document.createElement("p");
    profileUsername.textContent = `Hello ${user.username}`;
    const profileEmail = document.createElement("p");
    profileEmail.textContent = `Email: ${user.email}`;
    profileInfo.appendChild(profileUsername);
    profileInfo.appendChild(profileEmail);
  }

  if (localStorage.getItem("loggedIn") === "true") {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    displayProfile(currentUser);
    console.log("logged in");
  }

  document.getElementById("log-out-button").addEventListener("click", logOut);

  function logOut() {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("currentUser");
    window.location.reload();
  }
}

if (localStorage.getItem("audioEnabled") === null) {
  localStorage.setItem("audioEnabled", "true");
}
if (localStorage.getItem("musicEnabled") === null) {
  localStorage.setItem("musicEnabled", "true");
}

if (window.location.pathname.includes("settings.html")) {
  const toggleAudio = document.getElementById("toggle-audio");
  const toggleMusic = document.getElementById("toggle-music");

  toggleAudio.addEventListener("change", () => {
    if (toggleAudio.checked) {
      localStorage.setItem("audioEnabled", "true");
    } else {
      localStorage.setItem("audioEnabled", "false");
    }
  });

  toggleMusic.addEventListener("change", () => {
    if (toggleMusic.checked) {
        localStorage.setItem("musicEnabled", "true");
        musicAudio.load();
        musicAudio.play();
    } else {
        localStorage.setItem("musicEnabled", "false");
        musicAudio.pause();
    }
  });
}
