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
let correctCount = 0;


let missedCharacters = new Set();
let gameInterval;
let totalCharacters = 0;

let baseCharacterSpeed = 0.3; // Global base speed
const minSpeed = 0.8;
const maxSpeed = 1.5;

slowDownArrow.addEventListener('click', () => {
    if (baseCharacterSpeed > 0.1) { // Prevent speed from going too low
        baseCharacterSpeed -= 0.1;
    }
    pinyinInput.focus();
});

speedUpArrow.addEventListener('click', () => {
    baseCharacterSpeed += 0.1;
    pinyinInput.focus();
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

    // Random color
    const colors = ['#FF6347', '#FFD700', '#6A5ACD', '#3CB371', '#1E90FF', '#FF69B4']; // A palette of fun colors
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    charElement.style.color = randomColor;

    // Random font size
    const minFontSize = 2.0; // em
    const maxFontSize = 4.0; // em
    const randomFontSize = (Math.random() * (maxFontSize - minFontSize) + minFontSize).toFixed(1);
    charElement.style.fontSize = `${randomFontSize}em`;
    charElement.dataset.initialSize = randomFontSize;

    // Random speed
    const randomSpeedMultiplier = (Math.random() * (maxSpeed - minSpeed) + minSpeed);
    charElement.dataset.speed = randomSpeedMultiplier;

    gameArea.appendChild(charElement);
    activeCharacters.push(charElement);
}

function moveCharacters() {
    if (!gameStarted || gamePaused) return;

    activeCharacters.forEach((char, index) => {
        const top = parseFloat(char.style.top);
        if (top > gameArea.offsetHeight + 50) {
            missedCharacters.add({ char: char.textContent, pinyin: char.dataset.pinyin });
            document.getElementById('missed-count-display').textContent = `Missed: ${missedCharacters.size}`;
            updateMissedCharactersDisplay();
            missedSound.play();
            char.remove();
            activeCharacters.splice(index, 1);
            if (availableCharacters.length === 0 && activeCharacters.length === 0) {
                clearInterval(gameInterval);
                showResults();
            }
        } else {
            // Move character
            char.style.top = top + (baseCharacterSpeed * parseFloat(char.dataset.speed)) + 'px';

            // Dynamically change font size
            const initialSize = parseFloat(char.dataset.initialSize);
            if (initialSize) {
                const progress = Math.max(0, top) / gameArea.offsetHeight; // Progress from 0 to 1
                const growthFactor = 1.5; // How much it grows. 1.5 means it can get 50% bigger.
                const newSize = initialSize * (1 + progress * (growthFactor - 1));
                char.style.fontSize = `${newSize}em`;
            }
        }
    });
}

function updateMissedCharactersDisplay() {
    const missedListContainer = document.getElementById('missed-characters-list');
    missedListContainer.innerHTML = ''; // Clear previous characters
    Array.from(missedCharacters).forEach(c => {
        const charSpan = document.createElement('span');
        charSpan.classList.add('missed-char-item');
        charSpan.textContent = c.char;
        missedListContainer.appendChild(charSpan);
    });
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
        playerFighter.style.transform = `translateX(-50%) rotate(${angleRad}rad)`;

        // Create bullet element here to get its dimensions
        const bullet = document.createElement('div');
        bullet.classList.add('bullet');
        gameArea.appendChild(bullet); // Append to DOM to get dimensions

        // Introduce a short delay before shooting the bullet
        setTimeout(() => {
            shootSound.play();
            const playerRect = playerFighter.getBoundingClientRect();
            const gameAreaRect = gameArea.getBoundingClientRect();

            const playerCenterX = playerRect.left - gameAreaRect.left + playerRect.width / 2;
            const playerCenterY = playerRect.top - gameAreaRect.top + playerRect.height / 2;

            // Calculate absolute bullet start position from the center of the player fighter
            let bulletX = playerCenterX - (bullet.offsetWidth / 2); // Center horizontally
            let bulletY = playerCenterY - (bullet.offsetHeight / 2); // Center vertically

            bullet.style.left = bulletX + 'px';
            bullet.style.top = bulletY + 'px';

            // Debugging marker
            const debugMarker = document.createElement('div');
            debugMarker.style.position = 'absolute';
            debugMarker.style.width = '5px';
            debugMarker.style.height = '5px';
            debugMarker.style.backgroundColor = 'transparent';
            debugMarker.style.left = bulletX + 'px';
            debugMarker.style.top = bulletY + 'px';
            debugMarker.style.zIndex = '999'; // Ensure it's visible
            gameArea.appendChild(debugMarker);

            setTimeout(() => {
                debugMarker.remove();
            }, 2000); // Remove marker after 500ms

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
                    correctCount++;
                    document.getElementById('correct-count').textContent = `Correct: ${correctCount}`;
                    //console.log('Score:', score);
                }

                if (bulletY < 0 || bulletY > gameArea.offsetHeight || bulletX < 0 || bulletX > gameArea.offsetWidth) {
                    bullet.remove();
                    clearInterval(bulletInterval);
                }
            }, 20);
        }, 200); // 200ms delay for smoother animation

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
    const hitCount = correctCount;
    const missedCount = missedCharacters.size;
    document.getElementById('final-score').textContent = `Characters Hit: ${hitCount}`;
    document.getElementById('final-missed').textContent = `Characters Missed: ${missedCount}`;

    const finalMissedList = document.getElementById('final-missed-list');
    finalMissedList.innerHTML = ''; // Clear previous list
    if (missedCharacters.size > 0) {
        missedCharacters.forEach(c => {
            const listItem = document.createElement('li');
            listItem.textContent = `${c.char} (${c.pinyin})`;
            finalMissedList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'Great job! No characters missed!';
        finalMissedList.appendChild(listItem);
    }

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
    console.log('baseCharacterSpeed on retryGame:', baseCharacterSpeed);
    //console.log('retryGame function called.');
    // Reset game state
    correctCount = 0;
    missedCharacters.clear();
    activeCharacters = [];
    availableCharacters = [...allCharacters]; // Reset available characters

    // Clear existing characters from game area
    gameArea.querySelectorAll('.character').forEach(char => char.remove());

    // Update displays
    document.getElementById('correct-count').textContent = `Correct: ${correctCount}`;
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
    console.log('baseCharacterSpeed on retryFailedGame:', baseCharacterSpeed);
    //console.log('retryFailedGame function called.');
    // Reset game state
    correctCount = 0;
    availableCharacters = Array.from(missedCharacters);
    missedCharacters.clear();
    activeCharacters = [];

    // Clear existing characters from game area
    gameArea.querySelectorAll('.character').forEach(char => char.remove());

    // Update displays
    document.getElementById('correct-count').textContent = `Correct: ${correctCount}`;
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
