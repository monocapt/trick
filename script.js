// --- Game Configuration ---
const gameArea = document.getElementById('runner-game-area');
const character = document.getElementById('character');
const obstacleContainer = document.getElementById('obstacle-container');
const scoreDisplay = document.getElementById('score-display');
const startButton = document.getElementById('start-button');
const messageArea = document.getElementById('message-area');
const nextButton = document.getElementById('next-button');

// --- Game State ---
let isJumping = false;
let isGameOver = false;
let score = 0;
let gameLoopInterval;
let obstacleSpeed = 5; // Base speed (pixels per interval)
let speedIncreaseInterval; // Timer for increasing speed

const JUMP_HEIGHT = 65; // px (Matches CSS .jump class)
const GROUND_LEVEL = 15; // px (Matches CSS #ground height)
const GAME_INTERVAL = 20; // ms (How often the game state updates)

// --- Background Animation Function (Keep this for the Cosmic theme) ---
function generateMeteors() {
    const meteorContainer = document.getElementById('meteor-shower-container');
    if (!meteorContainer) return;

    const NUM_METEORS = 30;

    for (let i = 0; i < NUM_METEORS; i++) {
        const meteor = document.createElement('div');
        meteor.classList.add('meteor');
        const startX = Math.random() * 100 + 100;
        const startY = Math.random() * 100 + 10; 
        const duration = Math.random() * 5 + 3;
        const delay = Math.random() * 6;

        meteor.style.top = `${startY}vh`;
        meteor.style.left = `${startX}vw`;
        meteor.style.animationDuration = `${duration}s`;
        meteor.style.animationDelay = `${delay}s`;

        meteorContainer.appendChild(meteor);
    }
}

// --- Birthday Screen Function ---
function showBirthdayNote() {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('birthday-screen').classList.add('active'); 
}

// --- Core Game Functions ---

function startGame() {
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    if (speedIncreaseInterval) clearInterval(speedIncreaseInterval);

    // Reset State
    isGameOver = false;
    score = 0;
    obstacleSpeed = 5; 
    obstacleContainer.innerHTML = '';
    messageArea.textContent = 'JUMP TO SURVIVE!';
    startButton.style.display = 'none';
    nextButton.style.display = 'none';
    
    // Start Game Loops
    gameLoopInterval = setInterval(gameLoop, GAME_INTERVAL);
    // Increase speed every 10 seconds
    speedIncreaseInterval = setInterval(() => { obstacleSpeed += 0.5; }, 10000); 

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

    // After jump duration, remove the class to land
    setTimeout(() => {
        character.classList.remove('jump');
        // Wait for CSS transition to finish before allowing next jump
        setTimeout(() => { isJumping = false; }, 300); 
    }, 400); 
}

function spawnObstacle() {
    if (isGameOver) return;
    
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${gameArea.clientWidth}px`; // Start off screen right

    obstacleContainer.appendChild(obstacle);

    // Set a random time for the next obstacle spawn
    const nextSpawnTime = Math.random() * 2000 + 1000; // 1s to 3s

    setTimeout(spawnObstacle, nextSpawnTime);
}

function handleObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    
    obstacles.forEach(obstacle => {
        let currentLeft = parseInt(obstacle.style.left || gameArea.clientWidth);
        
        // Move the obstacle left based on current speed
        currentLeft -= obstacleSpeed; 
        obstacle.style.left = `${currentLeft}px`;

        // Remove obstacles that have moved off screen
        if (currentLeft < -20) {
            obstacle.remove();
        }
    });
}

function checkCollision() {
    const obstacles = document.querySelectorAll('.obstacle');
    
    // Get character's position and size (approximation)
    const charRect = character.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    // Normalized character position relative to game area
    const charLeft = charRect.left - gameAreaRect.left;
    const charBottom = gameAreaRect.bottom - charRect.bottom;
    const charWidth = charRect.width;
    const charHeight = charRect.height;
    
    obstacles.forEach(obstacle => {
        // Get obstacle's position and size (approximation)
        const obsRect = obstacle.getBoundingClientRect();
        const obsLeft = obsRect.left - gameAreaRect.left;
        const obsWidth = obsRect.width;
        
        // Check for overlap: 
        const isXOverlap = charLeft < obsLeft + obsWidth && charLeft + charWidth > obsLeft;
        const isYOverlap = charBottom < (obsRect.height + GROUND_LEVEL); // Check if character is low enough to hit

        if (isXOverlap && !isJumping && isYOverlap) {
             // Collision detected only if NOT jumping
             endGame();
        }
    });
    
    // Win Condition (Reach 500 meters)
    if (score > 5000) {
        winGame();
    }
}

function endGame() {
    clearInterval(gameLoopInterval);
    clearInterval(speedIncreaseInterval);
    isGameOver = true;
    messageArea.textContent = `MISSION FAILED! Distance: ${Math.floor(score / 10)}m. Try Again!`;
    startButton.textContent = 'Restart Mission';
    startButton.style.display = 'block';
}

function winGame() {
    clearInterval(gameLoopInterval);
    clearInterval(speedIncreaseInterval);
    isGameOver = true;
    messageArea.textContent = `SUCCESS! Sahil, you survived the Asteroid Field!`;
    nextButton.style.display = 'block';
}

// --- Event Listeners for Controls ---

startButton.addEventListener('click', startGame);

// 1. Desktop Controls (UP Arrow / W key)
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault(); 
        jump();
    }
});


// 2. Mobile Touch/Swipe Controls (Swipe Up on the game area)
gameArea.addEventListener('touchstart', e => {
    e.preventDefault(); 
    touchStartY = e.touches[0].clientY;
});

gameArea.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;

    // Check for a clear upward swipe
    if (deltaY < -40) { // If swipe is upward and significant (40px threshold)
        jump();
    }
});


// --- Initial Setup ---
generateMeteors();
startButton.style.display = 'block';
