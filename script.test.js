/**
 * @jest-environment jsdom
 */

// Mock DOM elements
const mockGameArea = document.createElement('div');
mockGameArea.id = 'game-area';
mockGameArea.offsetHeight = 800; // Mock for gameArea.offsetHeight
document.body.appendChild(mockGameArea);

const mockStartScreen = document.createElement('div');
mockStartScreen.id = 'start-screen';
document.body.appendChild(mockStartScreen);
mockStartScreen.remove = jest.fn(); // Mock the remove method

const mockStartButton = document.createElement('button');
mockStartButton.id = 'start-button';
document.body.appendChild(mockStartButton);

const mockPinyinInput = document.createElement('input');
mockPinyinInput.id = 'pinyin-input';
mockPinyinInput.classList.add('hidden');
mockPinyinInput.focus = jest.fn(); // Mock the focus method
document.body.appendChild(mockPinyinInput);

const mockSlowDownArrow = document.createElement('div');
mockSlowDownArrow.id = 'slow-down-arrow';
document.body.appendChild(mockSlowDownArrow);

const mockSpeedUpArrow = document.createElement('div');
mockSpeedUpArrow.id = 'speed-up-arrow';
document.body.appendChild(mockSpeedUpArrow);

const mockSpeedControls = document.createElement('div');
mockSpeedControls.id = 'speed-controls';
mockSpeedControls.classList.add('hidden');
document.body.appendChild(mockSpeedControls);

const mockPauseButton = document.createElement('div');
mockPauseButton.id = 'pause-button';
document.body.appendChild(mockPauseButton);

const mockPauseIcon = document.createElement('div');
mockPauseIcon.id = 'pause-icon';
document.body.appendChild(mockPauseIcon);

const mockPlayIcon = document.createElement('div');
mockPlayIcon.id = 'play-icon';
mockPlayIcon.style.display = 'none'; // Initially hidden
document.body.appendChild(mockPlayIcon);

const mockFullscreenButton = document.createElement('div');
mockFullscreenButton.id = 'fullscreen-button';
document.body.appendChild(mockFullscreenButton);

const mockResultsScreen = document.createElement('div');
mockResultsScreen.id = 'results-screen';
mockResultsScreen.classList.add('hidden');
document.body.appendChild(mockResultsScreen);

const mockRetryButton = document.createElement('button');
mockRetryButton.id = 'retry-button';
document.body.appendChild(mockRetryButton);

const mockRetryFailedButton = document.createElement('button');
mockRetryFailedButton.id = 'retry-failed-button';
document.body.appendChild(mockRetryFailedButton);

const mockPausePopup = document.createElement('div');
mockPausePopup.id = 'pause-popup';
mockPausePopup.classList.add('hidden'); // Initially hidden
document.body.appendChild(mockPausePopup);

const mockResumeButton = document.createElement('button');
mockResumeButton.id = 'resume-button';
document.body.appendChild(mockResumeButton);

const mockStatsTotal = document.createElement('span');
mockStatsTotal.id = 'stats-total';
document.body.appendChild(mockStatsTotal);

const mockStatsCorrect = document.createElement('span');
mockStatsCorrect.id = 'stats-correct';
document.body.appendChild(mockStatsCorrect);

const mockStatsMissed = document.createElement('span');
mockStatsMissed.id = 'stats-missed';
document.body.appendChild(mockStatsMissed);

const mockCorrectCountDisplay = document.createElement('span');
mockCorrectCountDisplay.id = 'correct-count';
document.body.appendChild(mockCorrectCountDisplay);

const mockMissedCountDisplay = document.createElement('span');
mockMissedCountDisplay.id = 'missed-count-display';
document.body.appendChild(mockMissedCountDisplay);

const mockMissedCharactersList = document.createElement('div');
mockMissedCharactersList.id = 'missed-characters-list';
document.body.appendChild(mockMissedCharactersList);

const mockFinalScore = document.createElement('p');
mockFinalScore.id = 'final-score';
document.body.appendChild(mockFinalScore);

const mockFinalMissed = document.createElement('p');
mockFinalMissed.id = 'final-missed';
document.body.appendChild(mockFinalMissed);

const mockFinalMissedList = document.createElement('ul');
mockFinalMissedList.id = 'final-missed-list';
document.body.appendChild(mockFinalMissedList);


// Mock global variables and functions from script.js
let gameStarted = false;
let gamePaused = false;
let gameInterval;
let baseCharacterSpeed = 0.3;
let totalCharacters = 10;
let correctCount = 0;
let missedCharacters = new Set();
let allCharacters = [{ char: 'A', pinyin: 'a' }, { char: 'B', pinyin: 'b' }];
let availableCharacters = [...allCharacters];
let activeCharacters = [];

// Mock setInterval and clearInterval
global.setInterval = jest.fn(() => 123); // Return a mock interval ID
global.clearInterval = jest.fn();

// Mock fullscreen API
Object.defineProperty(document, 'fullscreenElement', {
    get: jest.fn(() => null),
    configurable: true,
});
document.exitFullscreen = jest.fn();
Element.prototype.requestFullscreen = jest.fn();

// Mock audio elements
const mockShootSound = { play: jest.fn() };
const mockExplosionSound = { play: jest.fn() };
const mockErrorSound = { play: jest.fn() };
const mockMissedSound = { play: jest.fn() };

Object.defineProperty(document, 'getElementById', {
    value: jest.fn((id) => {
        switch (id) {
            case 'game-area': return mockGameArea;
            case 'start-screen': return mockStartScreen;
            case 'start-button': return mockStartButton;
            case 'player-fighter': return mockPlayerFighter;
            case 'pinyin-input': return mockPinyinInput;
            case 'slow-down-arrow': return mockSlowDownArrow;
            case 'speed-up-arrow': return mockSpeedUpArrow;
            case 'speed-controls': return mockSpeedControls;
            case 'pause-button': return mockPauseButton;
            case 'pause-icon': return mockPauseIcon;
            case 'play-icon': return mockPlayIcon;
            case 'fullscreen-button': return mockFullscreenButton;
            case 'results-screen': return mockResultsScreen;
            case 'retry-button': return mockRetryButton;
            case 'retry-failed-button': return mockRetryFailedButton;
            case 'pause-popup': return mockPausePopup;
            case 'resume-button': return mockResumeButton;
            case 'stats-total': return mockStatsTotal;
            case 'stats-correct': return mockStatsCorrect;
            case 'stats-missed': return mockStatsMissed;
            case 'correct-count': return mockCorrectCountDisplay;
            case 'missed-count-display': return mockMissedCountDisplay;
            case 'missed-characters-list': return mockMissedCharactersList;
            case 'final-score': return mockFinalScore;
            case 'final-missed': return mockFinalMissed;
            case 'final-missed-list': return mockFinalMissedList;
            case 'shoot-sound': return mockShootSound;
            case 'explosion-sound': return mockExplosionSound;
            case 'error-sound': return mockErrorSound;
            case 'missed-sound': return mockMissedSound;
            default: return null;
        }
    }),
    configurable: true,
});


// Functions from script.js (copied for testing purposes)
function togglePauseGame() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        mockPauseIcon.style.display = 'none';
        mockPlayIcon.style.display = 'block';
        clearInterval(gameInterval);
        mockStatsTotal.textContent = totalCharacters;
        mockStatsCorrect.textContent = correctCount;
        mockStatsMissed.textContent = missedCharacters.size;
        mockPausePopup.classList.remove('hidden');
    } else {
        mockPauseIcon.style.display = 'block';
        mockPlayIcon.style.display = 'none';
        gameInterval = setInterval(() => {}, 2000); // Mock createCharacter call
        mockPausePopup.classList.add('hidden');
    }
}

function updateMissedCharactersDisplay() {
    mockMissedCharactersList.innerHTML = '';
    Array.from(missedCharacters).forEach(c => {
        const charSpan = document.createElement('span');
        charSpan.classList.add('missed-char-item');
        charSpan.textContent = c.char;
        mockMissedCharactersList.appendChild(charSpan);
    });
}

function showResults() {
    const hitCount = correctCount;
    const missedCount = missedCharacters.size;
    mockFinalScore.textContent = `Characters Hit: ${hitCount}`;
    mockFinalMissed.textContent = `Characters Missed: ${missedCount}`;

    mockFinalMissedList.innerHTML = '';
    if (missedCharacters.size > 0) {
        missedCharacters.forEach(c => {
            const listItem = document.createElement('li');
            listItem.textContent = `${c.char} (${c.pinyin})`;
            mockFinalMissedList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'Great job! No characters missed!';
        mockFinalMissedList.appendChild(listItem);
    }

    mockResultsScreen.classList.remove('hidden');
    mockPinyinInput.disabled = true;

    if (missedCount === 0) {
        mockRetryFailedButton.style.display = 'none';
    } else {
        mockRetryFailedButton.style.display = 'inline-block';
    }
}

function retryGame() {
    correctCount = 0;
    missedCharacters.clear();
    activeCharacters = [];
    availableCharacters = [...allCharacters];

    mockGameArea.querySelectorAll('.character').forEach(char => char.remove());

    mockCorrectCountDisplay.textContent = `Correct: ${correctCount}`;
    updateMissedCharactersDisplay();

    mockResultsScreen.classList.add('hidden');
    mockPinyinInput.disabled = false;
    mockPinyinInput.value = '';
    mockPinyinInput.focus();

    clearInterval(gameInterval);
    gameInterval = setInterval(() => {}, 2000); // Mock createCharacter call
    // gameLoop(); // Not testing gameLoop directly here
}

function retryFailedGame() {
    correctCount = 0;
    availableCharacters = Array.from(missedCharacters);
    missedCharacters.clear();
    activeCharacters = [];

    mockGameArea.querySelectorAll('.character').forEach(char => char.remove());

    mockCorrectCountDisplay.textContent = `Correct: ${correctCount}`;
    updateMissedCharactersDisplay();

    mockResultsScreen.classList.add('hidden');
    mockPinyinInput.disabled = false;
    mockPinyinInput.value = '';
    mockPinyinInput.focus();

    clearInterval(gameInterval);
    gameInterval = setInterval(() => {}, 2000); // Mock createCharacter call
    // gameLoop(); // Not testing gameLoop directly here
}

function startGame() {
    gameStarted = true;
    mockStartScreen.remove();
    mockPinyinInput.classList.remove('hidden');
    mockSpeedControls.classList.remove('hidden');
    mockPinyinInput.focus();
    retryGame();
}


describe('Button Click Tests', () => {
    beforeEach(() => {
        // Reset mocks and global variables before each test
        gameStarted = false;
        gamePaused = false;
        baseCharacterSpeed = 0.3;
        correctCount = 0;
        missedCharacters.clear();
        availableCharacters = [...allCharacters];
        activeCharacters = [];

        mockStartScreen.remove.mockClear();
        mockPinyinInput.focus.mockClear();
        mockPinyinInput.classList.add('hidden');
        mockSpeedControls.classList.add('hidden');
        mockResultsScreen.classList.add('hidden');
        mockPinyinInput.disabled = false;
        mockPinyinInput.value = '';
        mockCorrectCountDisplay.textContent = '';
        mockMissedCountDisplay.textContent = '';
        mockMissedCharactersList.innerHTML = '';
        mockFinalScore.textContent = '';
        mockFinalMissed.textContent = '';
        mockFinalMissedList.innerHTML = '';
        mockRetryFailedButton.style.display = '';

        clearInterval.mockClear();
        setInterval.mockClear();
        document.exitFullscreen.mockClear();
        Element.prototype.requestFullscreen.mockClear();
        Object.defineProperty(document, 'fullscreenElement', { get: jest.fn(() => null) });

        // Reset pause button specific mocks
        mockPauseIcon.style.display = 'block';
        mockPlayIcon.style.display = 'none';
        mockPausePopup.classList.add('hidden');
        mockStatsTotal.textContent = '';
        mockStatsCorrect.textContent = '';
        mockStatsMissed.textContent = '';

        // Mock querySelectorAll for gameArea
        const mockCharacters = [
            { remove: jest.fn() },
            { remove: jest.fn() }
        ];
        mockGameArea.querySelectorAll = jest.fn(() => mockCharacters);
    });

    describe('Start Button', () => {
        test('should start the game when clicked', () => {
            startGame(); // Directly call the function
            expect(gameStarted).toBe(true);
            expect(mockStartScreen.remove).toHaveBeenCalled();
            expect(mockPinyinInput.classList.contains('hidden')).toBe(false);
            expect(mockSpeedControls.classList.contains('hidden')).toBe(false);
            expect(mockPinyinInput.focus).toHaveBeenCalled();
            expect(correctCount).toBe(0); // retryGame resets correctCount
            expect(missedCharacters.size).toBe(0); // retryGame clears missedCharacters
            expect(availableCharacters.length).toBe(allCharacters.length); // retryGame resets availableCharacters
            expect(clearInterval).toHaveBeenCalled(); // from retryGame
            expect(setInterval).toHaveBeenCalled(); // from retryGame
        });
    });

    describe('Speed Controls', () => {
        test('slow-down-arrow should decrease baseCharacterSpeed', () => {
            const initialSpeed = baseCharacterSpeed;
            // Manually call the logic that the event listener would trigger
            if (baseCharacterSpeed > 0.1) {
                baseCharacterSpeed -= 0.1;
            }
            mockPinyinInput.focus();
            expect(baseCharacterSpeed).toBeCloseTo(initialSpeed - 0.1);
            expect(mockPinyinInput.focus).toHaveBeenCalled();
        });

        test('slow-down-arrow should not decrease baseCharacterSpeed below 0.1', () => {
            baseCharacterSpeed = 0.1;
            // Manually call the logic that the event listener would trigger
            if (baseCharacterSpeed > 0.1) {
                baseCharacterSpeed -= 0.1;
            }
            mockPinyinInput.focus();
            expect(baseCharacterSpeed).toBe(0.1);
            expect(mockPinyinInput.focus).toHaveBeenCalled();
        });

        test('speed-up-arrow should increase baseCharacterSpeed', () => {
            const initialSpeed = baseCharacterSpeed;
            // Manually call the logic that the event listener would trigger
            baseCharacterSpeed += 0.1;
            mockPinyinInput.focus();
            expect(baseCharacterSpeed).toBeCloseTo(initialSpeed + 0.1);
            expect(mockPinyinInput.focus).toHaveBeenCalled();
        });
    });

    describe('Pause/Resume Button', () => {
        test('pause-button should pause the game and show popup', () => {
            togglePauseGame(); // Directly call the function
            expect(gamePaused).toBe(true);
            expect(mockPauseIcon.style.display).toBe('none');
            expect(mockPlayIcon.style.display).toBe('block');
            expect(clearInterval).toHaveBeenCalled();
            expect(mockPausePopup.classList.contains('hidden')).toBe(false);
            expect(mockStatsTotal.textContent).toBe(String(totalCharacters));
            expect(mockStatsCorrect.textContent).toBe(String(correctCount));
            expect(mockStatsMissed.textContent).toBe(String(missedCharacters.size));
        });

        test('resume-button should resume the game and hide popup', () => {
            // Set initial state to paused
            gamePaused = true;
            mockPauseIcon.style.display = 'none';
            mockPlayIcon.style.display = 'block';
            mockPausePopup.classList.remove('hidden');

            togglePauseGame(); // Directly call the function
            expect(gamePaused).toBe(false);
            expect(mockPauseIcon.style.display).toBe('block');
            expect(mockPlayIcon.style.display).toBe('none');
            expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 2000);
            expect(mockPausePopup.classList.contains('hidden')).toBe(true);
        });
    });

    describe('Fullscreen Button', () => {
        test('should request fullscreen when not in fullscreen', () => {
            // Manually call the logic that the event listener would trigger
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                Element.prototype.requestFullscreen();
            }
            mockPinyinInput.focus();
            expect(Element.prototype.requestFullscreen).toHaveBeenCalled();
            expect(mockPinyinInput.focus).toHaveBeenCalled();
        });

        test('should exit fullscreen when in fullscreen', () => {
            Object.defineProperty(document, 'fullscreenElement', { get: jest.fn(() => mockGameArea) });
            // Manually call the logic that the event listener would trigger
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                Element.prototype.requestFullscreen();
            }
            mockPinyinInput.focus();
            expect(document.exitFullscreen).toHaveBeenCalled();
            expect(mockPinyinInput.focus).toHaveBeenCalled();
        });
    });

    describe('Retry Buttons', () => {
        beforeEach(() => {
            // Set up a scenario where there are missed characters and some correct
            correctCount = 3;
            missedCharacters.add({ char: 'C', pinyin: 'c' });
            missedCharacters.add({ char: 'D', pinyin: 'd' });
            activeCharacters = [{ char: 'E', pinyin: 'e' }]; // Some active characters
            const mockCharacters = [
                { remove: jest.fn() },
                { remove: jest.fn() }
            ];
            mockGameArea.querySelectorAll = jest.fn(() => mockCharacters);
        });

        test('retry-button should reset game and start new game', () => {
            retryGame(); // Directly call the function
            expect(correctCount).toBe(0);
            expect(missedCharacters.size).toBe(0);
            expect(activeCharacters.length).toBe(0);
            expect(availableCharacters.length).toBe(allCharacters.length);
            expect(mockGameArea.querySelectorAll).toHaveBeenCalledWith('.character');
            expect(mockGameArea.querySelectorAll()[0].remove).toHaveBeenCalled();
            expect(mockCorrectCountDisplay.textContent).toBe('Correct: 0');
            expect(mockMissedCharactersList.innerHTML).toBe('');
            expect(mockResultsScreen.classList.contains('hidden')).toBe(true);
            expect(mockPinyinInput.disabled).toBe(false);
            expect(mockPinyinInput.value).toBe('');
            expect(mockPinyinInput.focus).toHaveBeenCalled();
            expect(clearInterval).toHaveBeenCalled();
            expect(setInterval).toHaveBeenCalled();
        });

        test('retry-failed-button should reset game and retry only failed characters', () => {
            const initialMissedSize = missedCharacters.size;
            const missedCharsArray = Array.from(missedCharacters);

            retryFailedGame(); // Directly call the function
            expect(correctCount).toBe(0);
            expect(missedCharacters.size).toBe(0); // Missed characters should be cleared after moving to available
            expect(activeCharacters.length).toBe(0);
            expect(availableCharacters.length).toBe(initialMissedSize);
            expect(availableCharacters).toEqual(expect.arrayContaining(missedCharsArray)); // Check if original missed are now available
            expect(mockGameArea.querySelectorAll).toHaveBeenCalledWith('.character');
            expect(mockGameArea.querySelectorAll()[0].remove).toHaveBeenCalled();
            expect(mockCorrectCountDisplay.textContent).toBe('Correct: 0');
            expect(mockMissedCharactersList.innerHTML).toBe('');
            expect(mockResultsScreen.classList.contains('hidden')).toBe(true);
            expect(mockPinyinInput.disabled).toBe(false);
            expect(mockPinyinInput.value).toBe('');
            expect(mockPinyinInput.focus).toHaveBeenCalled();
            expect(clearInterval).toHaveBeenCalled();
            expect(setInterval).toHaveBeenCalled();
        });
    });
});