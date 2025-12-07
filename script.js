// --- Game Configuration ---
// These variables will be defined when the DOM is ready
let gameArea;
let character;
let obstacleContainer;
let scoreDisplay;
let startButton;
let messageArea;

// --- Game State ---
let isJumping = false;
let isGameOver = true; 
let score = 0;
let gameLoopInterval;
let obstacleSpeed = 6; 
let speedIncreaseInterval;
let obstacleSpawnTimeout; 

const GROUND_LEVEL = 15; // px (Matches CSS)
const GAME_INTERVAL = 20; // ms (Game update rate)
const INITIAL_SPEED = 6;

// --- Touch State for Swipe Detection ---
let touchStartY = 0;
const SWIPE_THRESHOLD = 40; 


// --- Core Game Functions ---

function startGame() {
    // Clear any previous intervals/timeouts
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
    scoreDisplay.textContent = `Distance: ${Math.floor(score / 10)}m`; 

    handleObstacles();
    checkCollision();
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
    // Ensure obstacle starts fully off-screen right
    obstacle.style.left = `${gameArea.clientWidth}px`; 

    obstacleContainer.appendChild(obstacle);

    const nextSpawnTime = Math.random() * 1500 + 700; 

    obstacleSpawnTimeout = setTimeout(spawnObstacle, nextSpawnTime);
}

function handleObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    
    obstacles.forEach(obstacle => {
        let currentLeft = parseFloat(obstacle.style.left);
        
        currentLeft -= obstacleSpeed; 
        obstacle.style.left = `${currentLeft}px`;

        if (currentLeft < -50) {
            obstacle.remove();
        }
    });
}

function checkCollision() {
    // We only need to check collision when the character is on the ground
    if (isJumping) return;

    const obstacles = document.querySelectorAll('.obstacle');
    
    const charXPosition = 20; // Matches CSS left: 20px
    const charWidth = 35; 

    obstacles.forEach(obstacle => {
        const obsLeft = parseFloat(obstacle.style.left); 
        const obsWidth = 25; 

        // 1. Check for Horizontal Overlap
        const isXOverlap = (charXPosition < obsLeft + obsWidth) && (charXPosition + charWidth > obsLeft);
        
        // 2. Check for Vertical Overlap (is the character grounded and hitting a grounded obstacle)
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
function setupTouchControls() {
    if (gameArea) {
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
}


// --- Robust Initial Setup: Ensures all elements are loaded before assignment ---
document.addEventListener('DOMContentLoaded', () => {
    // Assign global variables now that the DOM is ready
    gameArea = document.getElementById('runner-game-area');
    character = document.getElementById('character');
    obstacleContainer = document.getElementById('obstacle-container');
    scoreDisplay = document.getElementById('score-display');
    startButton = document.getElementById('start-button');
    messageArea = document.getElementById('message-area');

    // Attach button listener
    if (startButton) {
        startButton.addEventListener('click', startGame);
        startButton.style.display = 'block';
    }
    
    // Setup touch controls
    setupTouchControls();
});
