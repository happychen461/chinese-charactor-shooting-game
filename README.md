# Chinese Character Shooting Game

A fun and interactive web-based game where you shoot down falling Chinese characters by typing their Pinyin.

## Features

*   **Interactive Gameplay:** Shoot falling Chinese characters by typing their Pinyin.
*   **Dynamic Character Spawning:** Characters appear randomly from the top of the screen.
*   **Score Tracking:** Keep track of your hits and missed characters.
*   **Adjustable Speed:** Increase or decrease the falling speed of characters.
*   **Sound Effects:** Engaging sound effects for shooting, explosions, and missed characters.
*   **Game Over Screen:** Displays your final score and a list of missed characters.
*   **Start Screen:** A clear start screen to begin the game.
*   **Tank Rotation:** Your tank rotates to target the character you are shooting.

## How to Play

1.  **Start the Game:** Open `index.html` in your web browser. Click the "Start Game" button to begin.
2.  **Shoot Characters:** As Chinese characters fall, type their corresponding Pinyin into the input field at the bottom of the screen and press Enter.
3.  **Score Points:** Successfully typing the correct Pinyin will shoot down the character and increase your score.
4.  **Avoid Missing:** If a character reaches the bottom of the screen without being shot, it will be added to your "Missed" list.
5.  **Adjust Speed:** Use the up and down arrow buttons on the right side of the screen to increase or decrease the falling speed of the characters.
6.  **Game Over:** The game ends when all characters have either been shot or missed.
7.  **Retry:** On the game over screen, you can see your performance and click "Retry" to play again.

## Technologies Used

*   HTML5
*   CSS3
*   JavaScript

## Setup (Local Development)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/happychen461/chinese-charactor-shooting-game.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd chinese-charactor-shooting-game
    ```
3.  **Open `index.html`:** Simply open the `index.html` file in your preferred web browser.

Alternatively, you can use a local web server (like `http-server` from npm) to serve the files:

```bash
# Install http-server globally (if you haven't already)
npm install -g http-server

# Start the server in your project directory
http-server .
```
Then, open your browser and go to `http://localhost:8080` (or the port indicated by `http-server`).

## Live Demo

You can play the game live on GitHub Pages:
[https://happychen461.github.io/chinese-charactor-shooting-game/](https://happychen461.github.io/chinese-charactor-shooting-game/)

## Credits

*   Chinese character data from `characters.json`.
*   Sound effects:
    *   `fire.mp3` (shoot sound)
    *   `explode.mp3` (explosion sound)
    *   `error.mp3` (error sound)
    *   `add-miss-char.mp3` (missed character sound)
*   Background image: `bg.png`
*   Player fighter image: `tank.png`
