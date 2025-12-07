// --- Game Configuration ---
const gameArea = document.getElementById('runner-game-area');
const character = document.getElementById('character');
const obstacleContainer = document.getElementById('obstacle-container');
const scoreDisplay = document.getElementById('score-display');
const startButton = document.getElementById('start-button');
const messageArea = document.getElementById('message-area');
// The 'nextButton' element is now removed from HTML and JS state

// --- Game State ---
let isJumping = false;
let isGameOver = true; 
let score = 0;
let gameLoopInterval;
let obstacleSpeed = 6; 
let speedIncreaseInterval;
let obstacleSpawnTimeout; 

const GROUND_LEVEL = 15; 
const GAME_INTERVAL = 20; 
const INITIAL_SPEED = 6;

// --- Touch State for Swipe Detection ---
let touchStartY = 0;
const SWIPE_THRESHOLD = 40; 

// --- Core Game Functions ---
// The showBirthdayNote function is completely removed.

function startGame() {
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);
    if (obstacleSpawnTimeout) clearTimeout(obstacleSpawnTimeout);

    // Reset State
    isGameOver = false;
    isJumping = false;
    score = 0;
    obstacleSpeed = INITIAL_SPEED; 
    obstacleContainer.innerHTML = '';
    character.classList.remove('jump');
    messageArea.textContent = 'JUMP TO SURVIVE!';
    startButton.style.display = 'none';
    
    // Start Game Loops
    gameLoopInterval = setInterval(gameLoop, GAME_INTERVAL);
    speedIncreaseInterval = setInterval(() => { obstacleSpeed += 0.5; }, 8000); 

    // Initial obstacle spawn
    setTimeout(spawnObstacle, 1500); 
}

function gameLoop() {
    if (isGameOver) return;

    score += 1;
    // Score displayed as distance
    scoreDisplay.textContent = `Distance: ${Math.floor(score / 10)}m`; 

    handleObstacles();
    checkCollision();
    
    // Win/Endless Condition: Game continues indefinitely.
}

function jump() {
    if (isJumping || isGameOver) return;

    isJumping = true;
    character.classList.add('jump');

    setTimeout(() => {
        character.classList.remove('jump');
        setTimeout(() => { isJumping = false; }, 300); 
    }, 400); 
}

function spawnObstacle() {
    if (isGameOver) return;
    
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${gameArea.clientWidth}px`; 

    obstacleContainer.appendChild(obstacle);

    const nextSpawnTime = Math.random() * 1500 + 700; // 0.7s to 2.2s

    // Set the timeout ID to the global variable
    obstacleSpawnTimeout = setTimeout(spawnObstacle, nextSpawnTime);
}

function handleObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    
    obstacles.forEach(obstacle => {
        let currentLeft = parseFloat(obstacle.style.left || gameArea.clientWidth);
        currentLeft -= obstacleSpeed; 
        obstacle.style.left = `${currentLeft}px`;

        if (currentLeft < -50) {
            obstacle.remove();
        }
    });
}

function checkCollision() {
    if (isJumping) return;

    const obstacles = document.querySelectorAll('.obstacle');
    
    const charXPosition = 20; // Matches CSS left: 20px
    const charWidth = 35; 

    obstacles.forEach(obstacle => {
        const obsLeft = parseFloat(obstacle.style.left); 
        const obsWidth = 25; 

        // 1. Check for Horizontal Overlap
        const isXOverlap = (charXPosition < obsLeft + obsWidth) && (charXPosition + charWidth > obsLeft);
        
        // 2. Check for Vertical Overlap (Since all obstacles are GROUNDED, we only check if the character is grounded)
        const isCharacterGrounded = !character.classList.contains('jump');

        if (isXOverlap && isCharacterGrounded) {
             endGame();
        }
    });
}

function endGame() {
    clearInterval(gameLoopInterval);
    clearInterval(speedIncreaseInterval);
    clearTimeout(obstacleSpawnTimeout);
    isGameOver = true;
    messageArea.textContent = `GAME OVER! Final Distance: ${Math.floor(score / 10)}m.`;
    startButton.textContent = 'Play Again';
    startButton.style.display = 'block';
}


// --- Event Listeners for Controls ---

// 1. Desktop Controls (UP Arrow / W key)
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault(); 
        jump();
    }
});


// 2. Mobile Touch/Swipe Controls (Swipe Up on the game area)
if (gameArea) {
    // We only attach touch listeners once the game area exists
    gameArea.addEventListener('touchstart', e => {
        e.preventDefault(); 
        touchStartY = e.touches[0].clientY;
    });

    gameArea.addEventListener('touchend', e => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;

        // Check for a clear upward swipe
        if (deltaY < -SWIPE_THRESHOLD) { 
            jump();
        }
    });
}


// --- Robust Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    // Ensure button listener is only attached once the element exists
    if (startButton) {
        startButton.addEventListener('click', startGame);
        startButton.style.display = 'block';
    }
});
