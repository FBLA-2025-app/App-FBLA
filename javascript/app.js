let units = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchUnits();
    setupEventListeners();

    const currentUnit = localStorage.getItem('currentUnit');
    if (currentUnit !== null) {
        setTimeout(() => {
            handleUnitSelect({ target: { value: currentUnit } });
            localStorage.removeItem('currentUnit');
        }, 300)
    }
});

async function fetchUnits() {
    try {
        const response = await fetch('../data/units.json');
        const data = await response.json();
        units = data.units;
        console.log(units);
        populateUnitSelect();
    } catch (error) {
        console.error('Error fetching units:', error);
    }
}

function setupEventListeners() {
    const unitSelect = document.getElementById('unitSelect');
    const homeBtn = document.getElementById('homeBtn');
    const profileBtn = document.getElementById('profileBtn');
    const settingsBtn = document.getElementById('settingsBtn');

    if (unitSelect) {
        unitSelect.addEventListener('change', handleUnitSelect);
    }

    homeBtn.addEventListener('click', () => navigateTo('index.html'));
    profileBtn.addEventListener('click', () => navigateTo('profile.html'));
    settingsBtn.addEventListener('click', () => navigateTo('settings.html'));
}

function navigateTo(page) {
    window.location.href = page;
}

function populateUnitSelect() {
    const unitSelect = document.getElementById('unitSelect');
    if (!unitSelect) return;

    units.forEach((unit, index) => {
        const option = document.createElement('option');
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
}

function populateLevelList(unitIndex) {
    const levelList = document.getElementById('levelList');
    levelList.innerHTML = '';

    units[unitIndex].levels.forEach((level, index) => {
        const levelButton = document.createElement('button');
        levelButton.className = 'level-button';
        levelButton.textContent = `Level ${level.level}`;
        if (index !== 0 && !isLevelCompleted(unitIndex, index - 1)) {
            levelButton.disabled = true;
            levelButton.classList.add('disabled-level');
        } else {
            levelButton.classList.add('active-level');
        }
        levelButton.addEventListener('click', () => startLevel(unitIndex, index));
        levelList.appendChild(levelButton);
    });
}

function startLevel(unitIndex, levelIndex) {
    localStorage.setItem('currentUnit', unitIndex);
    localStorage.setItem('currentLevel', levelIndex);
    localStorage.setItem('incorrectAnswers', 0);
    window.location.href = 'level.html';
}

if (window.location.pathname.includes('level.html')) {
    const unitIndex = localStorage.getItem('currentUnit');
    const levelIndex = localStorage.getItem('currentLevel');
    if (unitIndex !== null && levelIndex !== null) {
        setTimeout(() => {
            displayQuestion(unitIndex, levelIndex, 0);
        }, 300)
    }
}

function displayQuestion(unitIndex, levelIndex, questionIndex) {
    console.log(units);
    const unit = units[unitIndex];
    const level = unit.levels[levelIndex];
    const problem = level.problems[questionIndex];

    document.getElementById('levelTitle').textContent = `${unit.unitName} - Level ${level.level}`;
    document.getElementById('problemTitle').textContent = `Problem ${questionIndex + 1}`;
    document.getElementById('question').textContent = problem.question;

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    const shuffledAnswers = shuffleArray(problem.answers);

    shuffledAnswers.forEach((answer, index) => {
        const answerButton = document.createElement('button');
        answerButton.className = 'answer-button';
        answerButton.textContent = answer;
        answerButton.addEventListener('click', () => checkAnswer(unitIndex, levelIndex, questionIndex, index));
        answersContainer.appendChild(answerButton);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function checkAnswer(unitIndex, levelIndex, questionIndex, answerIndex) {
    const problem = units[unitIndex].levels[levelIndex].problems[questionIndex];
    const isCorrect = problem.answers[answerIndex] === problem.correctAnswer;

    if (isCorrect) {
        alert('Correct!');
        if (questionIndex < units[unitIndex].levels[levelIndex].problems.length - 1) {
            displayQuestion(unitIndex, levelIndex, questionIndex + 1);
        } else {
            markLevelCompleted(unitIndex, levelIndex);
            alert('Level completed!');
            if (parseInt(levelIndex) === units[unitIndex].levels.length - 1) {
                markUnitCompleted(unitIndex);
                alert('Unit completed!');
            }
            localStorage.setItem('currentUnit', unitIndex); 
            window.location.href = 'index.html';
        }
    } else {
        alert('Incorrect. Try again!');
        localStorage.setItem('incorrectAnswers', parseInt(localStorage.getItem('incorrectAnswers')) + 1);
        console.log(localStorage.getItem('incorrectAnswers'));
    }
}

function isUnitCompleted(unitIndex) {
    return localStorage.getItem(`unit_${unitIndex}_completed`) === 'true';
}

function isLevelCompleted(unitIndex, levelIndex) {
    return localStorage.getItem(`unit_${unitIndex}_level_${levelIndex}_completed`) === 'true';
}

function markLevelCompleted(unitIndex, levelIndex) {
    localStorage.setItem(`unit_${unitIndex}_level_${levelIndex}_completed`, 'true');
    if (levelIndex === units[unitIndex].levels.length - 1) {
        localStorage.setItem(`unit_${unitIndex}_completed`, 'true');
    }
}

function markUnitCompleted(unitIndex) {
    localStorage.setItem(`unit_${unitIndex}_completed`, 'true');
}