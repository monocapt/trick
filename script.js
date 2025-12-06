let enemiesDefeated = 0;
let difficultyLevel = 'normal'; // Can be 'normal', 'medium', or 'hard'
let capturesNeeded = 3; 

// --- Configuration ---
const DIFFICULTY_LEVELS = {
    'normal': 3, // Captures needed for Normal
    'medium': 5, // Captures needed for Medium
    'hard': 7   // Captures needed for Hard
};

// --- Sound Setup ---
const CAPTURE_SOUND_URL = 'INSERT_YOUR_NARUTO_SOUND_URL_HERE'; 
const captureSound = new Audio(CAPTURE_SOUND_URL);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Set initial captures needed
    capturesNeeded = DIFFICULTY_LEVELS[difficultyLevel];
    updateStatusDisplay();
    
    // 2. Add event listeners to enemies
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        enemy.addEventListener('click', shootEnemy);
    });
    
    // 3. Add event listener to difficulty buttons
    document.querySelectorAll('.difficulty-button').forEach(button => {
        button.addEventListener('click', setDifficulty);
    });
});

function setDifficulty(event) {
    // Reset game state when difficulty changes
    difficultyLevel = event.target.id;
    capturesNeeded = DIFFICULTY_LEVELS[difficultyLevel];
    enemiesDefeated = 0;
    
    // Reset enemy appearance (optional, if you had complex enemies)
    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach(enemy => {
        enemy.classList.remove('defeated');
    });

    // Visually update the active button
    document.querySelectorAll('.difficulty-button').forEach(button => {
        button.classList.remove('active-difficulty');
    });
    event.target.classList.add('active-difficulty');

    updateStatusDisplay();
}

function updateStatusDisplay() {
    document.getElementById('enemies-remaining').textContent = `Captures Left (${difficultyLevel.toUpperCase()}): ${capturesNeeded - enemiesDefeated}`;
}

function shootEnemy(event) {
    const enemyElement = event.target;
    
    // Only shoot if the enemy hasn't been defeated yet
    if (!enemyElement.classList.contains('defeated')) {
        
        // 1. Play Naruto Sound
        captureSound.currentTime = 0; // Rewind to play quickly
        captureSound.play().catch(e => console.log('Sound blocked by browser policy.'));
        
        // 2. Mark as defeated
        enemyElement.classList.add('defeated');
        enemiesDefeated++;
        
        // 3. Update status message
        updateStatusDisplay();
        
        // 4. Check for mission complete
        if (enemiesDefeated >= capturesNeeded) {
            setTimeout(showLevelComplete, 1000); 
        }
    }
}

function showLevelComplete() {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('level-complete-screen').classList.add('active');
    
    // Stop the bounce animation when complete (optional, depends on your CSS)
    document.querySelectorAll('.enemy').forEach(e => e.style.animation = 'none');
}

function showBirthdayNote() {
    document.getElementById('level-complete-screen').classList.remove('active');
    document.getElementById('birthday-screen').classList.add('active');
}