// Get necessary elements from the HTML
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const revealButton = document.getElementById('reveal-button');
const messageContainer = document.getElementById('birthday-message-container');

// Game state variables
let board = Array(9).fill(null); // Represents the 9 cells of the board
let isXNext = true; // X always starts

// All possible winning combinations (rows, columns, diagonals)
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];

// --- Core Game Functions ---

/**
 * Generates the 9 interactive cells and attaches event listeners.
 */
function createBoard() {
    boardElement.innerHTML = ''; // Clear board on initialization
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        // Pass the index to the click handler
        cell.addEventListener('click', () => handleCellClick(i));
        boardElement.appendChild(cell);
    }
}

/**
 * Handles a click on a Tic-Tac-Toe cell.
 * @param {number} index - The index of the clicked cell (0-8).
 */
function handleCellClick(index) {
    // Stop if the cell is already filled or the game is over
    if (board[index] || checkWinner()) {
        return; 
    }

    const currentMark = isXNext ? 'X' : 'O';
    board[index] = currentMark;
    
    // Update the display for the clicked cell
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = currentMark;
    cell.classList.add(currentMark);

    if (checkWinner()) {
        statusElement.textContent = `Player ${currentMark} Wins!`;
        endGame(true);
        return;
    }

    // Check for a draw (all cells filled, but no winner)
    if (board.every(cell => cell !== null)) {
        statusElement.textContent = `It's a Draw!`;
        endGame(false);
        return;
    }

    // Switch turns
    isXNext = !isXNext;
    statusElement.textContent = `Player ${isXNext ? 'X' : 'O'}'s Turn`;
}

/**
 * Checks if the current board state has a winner.
 * @returns {boolean} - True if there is a winner, false otherwise.
 */
function checkWinner() {
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        // Check if all three cells in the combination are the same non-null value
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

/**
 * Actions to perform when the game ends (win or draw).
 * @param {boolean} isWin - True if the game was a win, false for a draw.
 */
function endGame(isWin) {
    // Disable further clicks
    document.querySelectorAll('.cell').forEach(cell => {
        cell.style.cursor = 'default';
        // To make it stop working, we remove the listener by cloning the element
        let oldCell = cell;
        let newCell = oldCell.cloneNode(true);
        oldCell.parentNode.replaceChild(newCell, oldCell);
    });
    
    // Show the button to reveal the birthday message
    revealButton.style.display = 'block';
    
    // Optional: Highlight winning cells
    if (isWin) {
         for (const combination of WINNING_COMBINATIONS) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                document.querySelector(`.cell[data-index="${a}"]`).style.backgroundColor = '#90ee90';
                document.querySelector(`.cell[data-index="${b}"]`).style.backgroundColor = '#90ee90';
                document.querySelector(`.cell[data-index="${c}"]`).style.backgroundColor = '#90ee90';
                break;
            }
        }
    }
}

// --- Reveal Function (called by the button) ---

/**
 * Hides the game and reveals the hidden birthday message section.
 */
function revealMessage() {
    // Get the element to hide
    const gameContainer = document.getElementById('game-container');
    
    // Hide the game container
    gameContainer.style.display = 'none';
    
    // Reveal the message container using the 'revealed' class for animation
    messageContainer.classList.add('revealed');
    
    // Scroll to the message smoothly
    messageContainer.scrollIntoView({ behavior: 'smooth' });
}

// Initialize the game when the page loads
window.onload = createBoard;
