let units = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchUnits();
    setupEventListeners();
});

async function fetchUnits() {
    try {
        const response = await fetch('../data/units.json');
        const data = await response.json();
        units = data.units;
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
        unitSelect.appendChild(option);
    });
}

function handleUnitSelect(event) {
    const selectedUnitIndex = event.target.value;
    if (selectedUnitIndex !== '') {
        displayLevels(selectedUnitIndex);
    } else {
        document.getElementById('levelList').innerHTML = '';
    }
}

function displayLevels(unitIndex) {
    const levelList = document.getElementById('levelList');
    levelList.innerHTML = '';

    units[unitIndex].levels.forEach((level, index) => {
        const levelButton = document.createElement('div');
        levelButton.className = 'level-button';
        levelButton.textContent = `Level ${level.level}`;
        levelButton.addEventListener('click', () => startLevel(unitIndex, index));
        levelList.appendChild(levelButton);
    });
}

function startLevel(unitIndex, levelIndex) {
    localStorage.setItem('currentUnit', unitIndex);
    localStorage.setItem('currentLevel', levelIndex);
    window.location.href = 'level.html';
}

if (window.location.pathname.includes('level.html')) {
    const unitIndex = localStorage.getItem('currentUnit');
    const levelIndex = localStorage.getItem('currentLevel');
    if (unitIndex !== null && levelIndex !== null) {
        displayQuestion(unitIndex, levelIndex, 0);
    }
}

function displayQuestion(unitIndex, levelIndex, questionIndex) {
    const unit = units[unitIndex];
    const level = unit.levels[levelIndex];
    const problem = level.problems[questionIndex];

    document.getElementById('levelTitle').textContent = `${unit.unitName} - Level ${level.level}`;
    document.getElementById('question').textContent = problem.question;

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    problem.answers.forEach((answer, index) => {
        const answerButton = document.createElement('button');
        answerButton.className = 'answer-button';
        answerButton.textContent = answer;
        answerButton.addEventListener('click', () => checkAnswer(unitIndex, levelIndex, questionIndex, index));
        answersContainer.appendChild(answerButton);
    });
}

function checkAnswer(unitIndex, levelIndex, questionIndex, answerIndex) {
    const problem = units[unitIndex].levels[levelIndex].problems[questionIndex];
    const isCorrect = problem.answers[answerIndex] === problem.correctAnswer;

    if (isCorrect) {
        alert('Correct!');
        if (questionIndex < units[unitIndex].levels[levelIndex].problems.length - 1) {
            displayQuestion(unitIndex, levelIndex, questionIndex + 1);
        } else {
            alert('Level completed!');
            window.location.href = 'index.html';
        }
    } else {
        alert('Incorrect. Try again!');
    }
}