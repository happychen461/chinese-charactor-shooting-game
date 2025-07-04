const gameArea = document.getElementById('game-area');
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const playerFighter = document.getElementById('player-fighter');
const pinyinInput = document.getElementById('pinyin-input');
const slowDownArrow = document.getElementById('slow-down-arrow');
const speedUpArrow = document.getElementById('speed-up-arrow');
const speedControls = document.getElementById('speed-controls');
const shootSound = document.getElementById('shoot-sound');
const explosionSound = document.getElementById('explosion-sound');
const errorSound = document.getElementById('error-sound');
const missedSound = document.getElementById('missed-sound');
const scoreDisplay = document.getElementById('score-display');
const missedCharactersDisplay = document.getElementById('missed-characters');

let characters = [];
let allCharacters = []; // Store all characters initially
let availableCharacters = []; // Characters yet to be dropped
let activeCharacters = [];
let score = 0;
let characterSpeed = 0.3;

let missedCharacters = new Set();
let gameInterval;
let totalCharacters = 0;

slowDownArrow.addEventListener('click', () => {
    if (characterSpeed > 1) {
        characterSpeed--;
    }
});

speedUpArrow.addEventListener('click', () => {
    characterSpeed++;
});

let gamePaused = false;
const pauseButton = document.getElementById('pause-button');

const pauseIcon = document.getElementById('pause-icon');
const playIcon = document.getElementById('play-icon');
const fullscreenButton = document.getElementById('fullscreen-button');

function togglePauseGame() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
        clearInterval(gameInterval);
    } else {
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
        gameInterval = setInterval(createCharacter, 2000);
    }
}

pauseButton.addEventListener('click', togglePauseGame);

fullscreenButton.addEventListener('click', () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        gameContainer.requestFullscreen();
    }
    pinyinInput.focus();

});

fetch('characters.json')
    .then(response => response.json())
    .then(data => {
        allCharacters = data;
        totalCharacters = allCharacters.length;
    });

startButton.addEventListener('click', startGame);

function startGame() {
    gameStarted = true;
    startScreen.remove(); // Remove the entire start screen from the DOM
    pinyinInput.classList.remove('hidden');
    speedControls.classList.remove('hidden');
    pinyinInput.focus();
    retryGame();
}

function createCharacter() {
    if (!gameStarted || gamePaused) return;

    if (availableCharacters.length === 0) {
        if (activeCharacters.length === 0) {
            clearInterval(gameInterval);
            showResults();
        }
        return;
    }
    if (activeCharacters.length >= 3) return;

    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    const charData = availableCharacters.splice(randomIndex, 1)[0];

    const charElement = document.createElement('div');
    charElement.classList.add('character');
    charElement.textContent = charData.char;
    charElement.dataset.pinyin = charData.pinyin;
    charElement.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    charElement.style.top = '-50px';
    gameArea.appendChild(charElement);
    activeCharacters.push(charElement);
}

function moveCharacters() {
    if (!gameStarted || gamePaused) return;

    //console.log('gameArea.offsetHeight:', gameArea.offsetHeight);
    activeCharacters.forEach((char, index) => {
        const top = parseFloat(char.style.top);
        //console.log(`Character ${char.textContent} raw top: ${char.style.top}, parsed top: ${top}`); // Debugging line
        if (top > gameArea.offsetHeight + 50) {
            missedCharacters.add({ char: char.textContent, pinyin: char.dataset.pinyin });
            updateMissedCharactersDisplay();
            missedSound.play();
            char.remove();
            activeCharacters.splice(index, 1);
            if (availableCharacters.length === 0 && activeCharacters.length === 0) {
                clearInterval(gameInterval);
                showResults();
            }
        } else {
            char.style.top = top + characterSpeed + 'px';
        }
    });
}

function updateMissedCharactersDisplay() {
    missedCharactersDisplay.textContent = `Missed: ${Array.from(missedCharacters).map(c => c.char).join(', ')}`;
}

function shoot(pinyin) {
    let targetCharacter = null;
    let targetIndex = -1;

    for (let i = 0; i < activeCharacters.length; i++) {
        if (activeCharacters[i].dataset.pinyin === pinyin) {
            targetCharacter = activeCharacters[i];
            targetIndex = i;
            break;
        }
    }

    if (targetCharacter) {
        console.log('targetCharacter:', targetCharacter);

        // Calculate player fighter's center coordinates relative to gameArea
        const playerCenterX = playerFighter.offsetLeft + playerFighter.offsetWidth / 2;
        const playerCenterY = playerFighter.offsetTop + playerFighter.offsetHeight / 2;

        const targetX = targetCharacter.offsetLeft + targetCharacter.offsetWidth / 2;
        const targetY = targetCharacter.offsetTop + targetCharacter.offsetHeight / 2;

        // Calculate the angle in radians from the player to the target
        // Math.atan2(y, x) gives angle from positive x-axis.
        // We want angle from positive y-axis (upwards), so swap x and y, and negate y.
        const angleRad = Math.atan2(targetX - playerCenterX, -(targetY - playerCenterY));

        // Apply rotation to the player fighter
        playerFighter.style.transform = `rotate(${angleRad}rad)`;

        shootSound.play();
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        const playerRect = playerFighter.getBoundingClientRect();
        const gameAreaRect = gameArea.getBoundingClientRect();

        let bulletX = playerRect.left - gameAreaRect.left + playerRect.width / 2 - 2.5;
        let bulletY = playerRect.top - gameAreaRect.top;

        bullet.style.left = bulletX + 'px';
        bullet.style.top = bulletY + 'px';
        gameArea.appendChild(bullet);

        const speed = 40;

        const bulletInterval = setInterval(() => {
            const currentTargetRect = targetCharacter.getBoundingClientRect();
            const currentTargetX = currentTargetRect.left - gameAreaRect.left + currentTargetRect.width / 2;
            const currentTargetY = currentTargetRect.top - gameAreaRect.top + currentTargetRect.height / 2;

            const angle = Math.atan2(currentTargetY - bulletY, currentTargetX - bulletX);
            bulletX += Math.cos(angle) * speed;
            bulletY += Math.sin(angle) * speed;

            bullet.style.left = bulletX + 'px';
            bullet.style.top = bulletY + 'px';
            bullet.style.transform = `rotate(${angle + Math.PI / 2}rad)`; // Add PI/2 to point upwards

            const bulletRect = bullet.getBoundingClientRect();
            const charRect = targetCharacter.getBoundingClientRect();

            if (
                bulletRect.left < charRect.right &&
                bulletRect.right > charRect.left &&
                bulletRect.top < charRect.bottom &&
                bulletRect.bottom > charRect.top
            ) {
                explosionSound.play();
                explode(currentTargetX, currentTargetY);
                targetCharacter.remove();
                activeCharacters.splice(targetIndex, 1);
                bullet.remove();
                clearInterval(bulletInterval);
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                //console.log('Score:', score);
            }

            if (bulletY < 0 || bulletY > gameArea.offsetHeight || bulletX < 0 || bulletX > gameArea.offsetWidth) {
                bullet.remove();
                clearInterval(bulletInterval);
            }
        }, 20);

        pinyinInput.value = '';
    } else {
        errorSound.play();
        pinyinInput.value = '';
    }
}

function explode(x, y) {
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = x - 25 + 'px';
    explosion.style.top = y - 25 + 'px';
    gameArea.appendChild(explosion);
    setTimeout(() => {
        explosion.remove();
    }, 500);
}

pinyinInput.addEventListener('change', (e) => {
    shoot(e.target.value.toLowerCase().trim());
});

document.getElementById('retry-button').addEventListener('click', retryGame);
document.getElementById('retry-failed-button').addEventListener('click', retryFailedGame);

function gameLoop() {
    //console.log('Game loop running...'); // Debugging game loop
    moveCharacters();
    requestAnimationFrame(gameLoop);
}

function showResults() {
    const hitCount = score;
    const missedCount = missedCharacters.size;
    document.getElementById('final-score').textContent = `Characters Hit: ${hitCount}`;
    document.getElementById('final-missed').textContent = `Characters Missed: ${missedCount}`;
    const missedList = Array.from(missedCharacters).map(c => `${c.char} (${c.pinyin})`).join(', ');
    document.getElementById('final-missed-list').textContent = missedList;
    document.getElementById('results-screen').classList.remove('hidden');
    pinyinInput.disabled = true;

    const retryFailedButton = document.getElementById('retry-failed-button');
    if (missedCount === 0) {
        retryFailedButton.style.display = 'none';
    } else {
        retryFailedButton.style.display = 'inline-block';
    }
}

function retryGame() {
    console.log('characterSpeed on retryGame:', characterSpeed);
    //console.log('retryGame function called.');
    // Reset game state
    score = 0;
    missedCharacters.clear();
    activeCharacters = [];
    availableCharacters = [...allCharacters]; // Reset available characters

    // Clear existing characters from game area
    gameArea.querySelectorAll('.character').forEach(char => char.remove());

    // Update displays
    scoreDisplay.textContent = `Score: ${score}`;
    updateMissedCharactersDisplay();

    // Hide results screen and enable input
    document.getElementById('results-screen').classList.add('hidden');
    pinyinInput.disabled = false;
    pinyinInput.value = '';
    pinyinInput.focus();

    // Restart game loop and character creation
    clearInterval(gameInterval);
    gameInterval = setInterval(createCharacter, 2000);
    gameLoop();
}

function retryFailedGame() {
    console.log('characterSpeed on retryFailedGame:', characterSpeed);
    //console.log('retryFailedGame function called.');
    // Reset game state
    score = 0;
    availableCharacters = Array.from(missedCharacters);
    missedCharacters.clear();
    activeCharacters = [];

    // Clear existing characters from game area
    gameArea.querySelectorAll('.character').forEach(char => char.remove());

    // Update displays
    scoreDisplay.textContent = `Score: ${score}`;
    updateMissedCharactersDisplay();

    // Hide results screen and enable input
    document.getElementById('results-screen').classList.add('hidden');
    pinyinInput.disabled = false;
    pinyinInput.value = '';
    pinyinInput.focus();

    // Restart game loop and character creation
    clearInterval(gameInterval);
    gameInterval = setInterval(createCharacter, 2000);
    gameLoop();
}
