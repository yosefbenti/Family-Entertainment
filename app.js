const container = document.querySelector("#container");
const imageInput = document.querySelector("#imageInput");
const solveButton = document.querySelector("#solveButton");
const restartBtn = document.getElementById("restartBtn");
const nextLevel = document.getElementById("nextLevel")
const resetGameBtn = document.getElementById("resetGameBtn")
const canvas = document.createElement("canvas");
canvas.width = 1400;  // Canvas width
canvas.height = 700;  // Canvas height
canvas.style.border = "4px solid pink";
canvas.style.opacity = "1";
container.appendChild(canvas);

const ctx = canvas.getContext("2d");
//nextLevel.disabled = true

solveButton.style.display = 'block';

let isPuzzleSolved = false;  // Flag to track if the puzzle is solved manually
let timeLimit = 60;  // Default time limit for Level 1 (30 seconds)
let timer;
let timeRemaining = timeLimit;
let pieces = [];
let offsetX, offsetY, isDragging = false, currentPiece = null;
let img = null;
let cols = 3, rows = 3; // Default for Level 1 (3x3)
let pieceWidth = 700 / cols, pieceHeight = 700 / rows;
let currentLevel = 1; // Starting level
let timeLeft = timeLimit;
let playerScore = 0; // Initialize player score
let score = 0; // Track total score
const maxScorePerLevel = 100; // Maximum points per level
let totalTime; // Adjust this based on level
let startTime; // Variable to track the start time
let pointsEarned = 0 ;
let gameOver = false;

document.getElementById("level").innerText = `ዙር ${currentLevel}`;

function startLevel() {
    clearInterval(timer);  // Clear any existing timer to prevent duplicates
    
    // Hide the Next Level button when the level starts
    document.getElementById("nextLevel").style.display = "none";

    // Set time limit based on the current level
    if (currentLevel === 1) {
        timeLeft = 60;  // Level 1: 30 seconds
        totalTime = 60;
    } else if (currentLevel === 2) {
        timeLeft = 120;  // Level 2: 60 seconds
        totalTime = 120;
    } else if (currentLevel === 3) {
        timeLeft = 300;  // Level 3: 90 seconds
        totalTime = 300;
    } else if (currentLevel === 4) {
        timeLeft = 420;  // Level 3: 90 seconds
        totalTime = 420;
    } 

    document.getElementById("level").innerText = `ዙር ${currentLevel}`;
    document.getElementById("timer").innerText = timeLeft;
    document.getElementById("restartBtn").style.display = "none";

    
    startTime = Date.now(); // Start the timer when the level begins
   
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("timer").innerText = timeLeft;
        } else {
            clearInterval(timer);
            failLevel();
        }
    }, 1000); 
}

// Reset the game to Level 1 (3x3 grid)
function resetGame() {
    // Reset game state to level 1
    currentLevel = 1;
    score = 0;
    pointsEarned = 0;
    cols = 3;
    rows = 3;
    pieceWidth = 700 / cols;
    pieceHeight = 700 / rows;
    timeLeft = 60;  // Time limit for level 1
    isPuzzleSolved = false;  // Reset solved state
    pieces = [];  // Clear previous pieces

    // Reset the canvas and draw the new grid
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
    drawFullGrid();  // Redraw the grid
    drawWinnerZone();  // Redraw the winner zone

    // Reset the timer display and start the level
    document.getElementById("level").innerText = "ዙር 1";
    document.getElementById("timer").innerText = timeLeft;
    document.getElementById("message").innerText = "ሰአቱ ከማለቁ በፌት ዙሩን ማጠናቀቅ!";
    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("scoreDisplay").innerText ="";

    // Reset pieces and draw them
    //startLevel();  // Start the level timer
}

// Add event listener to the reset game button
 document.getElementById("resetGameBtn").addEventListener("click", () => {
    resetGame();  // Reset everything to level 1
    imageInput.disabled = false;
});


function winLevel() {
    clearInterval(timer); // Stop the timer

    // Calculate score based on remaining time
    let percentageLeft = timeLeft / totalTime; // Percentage of time left
    pointsEarned = Math.round(maxScorePerLevel * percentageLeft); // Score calculation

    score += pointsEarned; // Add to total score

    // Update score display in the HTML
    let scoreElement = document.getElementById("scoreDisplay");
    if (scoreElement) {
        scoreElement.innerText = `${score}`;
    } else {
        console.error("Score element not found in HTML");
    }

    // Display a message on the page instead of an alert
    let messageElement = document.getElementById("message");
    if (messageElement) {
        messageElement.innerText = `ዙር ${currentLevel} አልፈዋል! ቀሪ ሰአት: ${timeLeft} ሰከንድ. የተገኘ ነጥብ: ${pointsEarned}. ጠቅላላ ነጥብ: ${score}`;
    }

   // document.getElementById("nextLevel").style.display = "block"; // Show Next Level button
}


document.getElementById("nextLevel").addEventListener("click", () => {
    if (currentLevel < 4) {
        currentLevel++; // Move to the next level
       
        document.getElementById("message").innerText = "";
        setLevel(currentLevel); // Update the game with new level settings
         imageInput.disabled = false;
    } else {
        document.getElementById("message").innerText = `እንኳን ደስ አሎት! ሁሉንም ዙሮች አልቀዋልአልቀዋል! ጠቅላላ ውጤት: ${score}`;
        document.getElementById("nextLevel").style.display = "none"; // Hide next level button after completing all levels
        resetGameBtn.style.display = 'block'
        //resetGameBtn.style.display = 'block'
    }
});



function updateScoreDisplay(score) {
    let scoreElement = document.getElementById("scoreDisplay");
    if (scoreElement) {
        scoreElement.innerText = `Score: ${score}`;
    } else {
        console.error("Score display element not found in HTML");
    }
}

/*
resetBtn.addEventListener("click", () => {
    currentLevel = 1;  // Reset to Level 1
    setLevel(1);
    resetBtn.style.display = "none"; // Hide the reset button
});*/


function restartLevel() {
    clearInterval(timer); // Ensure no duplicate timers
    //startLevel();
}

//startLevel();  // Start the first level
// Initialize game state after level selection
function startGame() {
    imageInput.disabled = false;
    isPuzzleSolved = false;  // Reset the solved state every time a new game starts
    pieces = [];             // Clear the pieces
    drawPieces();            // Redraw the pieces on the canvas
    //startTimer();            // Start the timer
}

// Draw the winner zone border with black 2px stroke and grid lines
function drawWinnerZone() {
    ctx.strokeStyle = "white";  // Set stroke color to black
    ctx.lineWidth = 1;          // Set stroke width to 2px
    ctx.strokeRect(0, 0, 700, 700);  // Draw the winner zone border

    ctx.fillStyle = "MistyRose";
    ctx.fillRect(0, 0, 700, 700);

    // Draw vertical grid lines inside the winner zone
    for (let i = 1; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * pieceWidth, 0);
        ctx.lineTo(i * pieceWidth, 700);
        ctx.stroke();
    }

    // Draw horizontal grid lines inside the winner zone
    for (let j = 1; j < rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * pieceHeight);
        ctx.lineTo(700, j * pieceHeight);
        ctx.stroke();
    }
}

function drawFullGrid() {
    // Fill the entire canvas with a different background color
    ctx.fillStyle = "AliceBlue"; // Change this to your preferred color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const divisionWidth = pieceWidth;
    const divisionHeight = pieceHeight;

    ctx.strokeStyle = "white";  // Set stroke color to black
    ctx.lineWidth = 1;

    // Draw vertical grid lines for the entire canvas (covering the winner zone and remaining area)
    for (let i = 0; i <= Math.ceil(canvas.width / divisionWidth); i++) {
        ctx.beginPath();
        ctx.moveTo(i * divisionWidth, 0);
        ctx.lineTo(i * divisionWidth, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal grid lines for the entire canvas (covering the winner zone and remaining area)
    for (let j = 0; j <= Math.ceil(canvas.height / divisionHeight); j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * divisionHeight);
        ctx.lineTo(canvas.width, j * divisionHeight);
        ctx.stroke();
    }
}    

// Check if the position of a piece overlaps any other piece
function isPositionOccupied(x, y, pieceWidth, pieceHeight) {
return pieces.some(piece => 
    x < piece.x + pieceWidth &&
    x + pieceWidth > piece.x &&
    y < piece.y + pieceHeight &&
    y + pieceHeight > piece.y
);
}

// Get a random position outside the winner zone with no overlap
function getRandomPositionOutsideWinnerZone() {
let randomX, randomY;
let validPositionFound = false;

// Ensure position is outside the winner zone and does not overlap
while (!validPositionFound) {
    // Generate random position for the piece outside the winner zone
    randomX = Math.floor(Math.random() * Math.floor(canvas.width / pieceWidth)) * pieceWidth;
    randomY = Math.floor(Math.random() * Math.floor(canvas.height / pieceHeight)) * pieceHeight;

    // Ensure position is outside the winner zone and is not overlapping with other pieces
    if ((randomX >= 700 || randomY >= 700) && !isPositionOccupied(randomX, randomY, pieceWidth, pieceHeight)) {
        validPositionFound = true;
    }
}

return { x: randomX, y: randomY };
}

nextLevel.style.display = 'none'
restartBtn.style.display = 'none'
resetGameBtn.style.display = 'none'

// Set correct image dimensions (for example 700x700)
const requiredWidth = 700;
const requiredHeight = 700;

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

     // Check if the file is an image
     const fileType = file.type.split('/')[0];
     if (fileType !== 'image') {
         alert("Please upload a valid image file.");
         imageInput.value = ''; // Clear the file input
         return;
     }
    // Clear the file input to allow the user to upload the same image again if needed
    imageInput.value = '';

    nextLevel.style.display = 'none';
    resetGameBtn.style.display = 'none';
    imageInput.disabled = true;

    // Clear the canvas and reset game state before starting a new game
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    pieces = [];  // Clear previous pieces
    isPuzzleSolved = false;  // Reset solved state
    timeRemaining = timeLimit;  // Reset the time remaining to the original time limit
    clearInterval(timer); // Clear previous timer

    const reader = new FileReader();
    reader.onload = (e) => {
        
        img = new Image();
        img.onload = function () {
            // Check if the image size matches the required dimensions
            if (img.width !== requiredWidth || img.height !== requiredHeight) {
                alert(`Please upload an image of size ${requiredWidth}x${requiredHeight}.`);
                
                // Enable the image input again for the user to upload a new image
                imageInput.disabled = false;
                return; // Exit the function if the image size is incorrect
            }

            pieceWidth = img.width / cols;
            pieceHeight = img.height / rows;
            pieces = [];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    let position = getRandomPositionOutsideWinnerZone();
                    pieces.push({
                        x: position.x,
                        y: position.y,
                        width: pieceWidth,
                        height: pieceHeight,
                        imgX: col * pieceWidth,
                        imgY: row * pieceHeight,
                        originalX: col * pieceWidth,
                        originalY: row * pieceHeight
                    });
                }
            }

            drawPieces();  // Draw the pieces after loading the image
            startLevel();  // Start the timer and game when the image is loaded and the puzzle starts
            showButton();  // Show the appropriate button (if needed)
          
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});



function drawPieces() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawFullGrid(); // Draw grid for the entire canvas area
drawWinnerZone(); // Draw winner zone grid
for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    ctx.drawImage(img, piece.imgX, piece.imgY, piece.width, piece.height, piece.x, piece.y, piece.width, piece.height);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 2;
    ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
}
checkWin();
}


// Event listeners for dragging pieces
canvas.addEventListener('mousedown', (e) => {
    if(timeLeft > 0)
    {
const mouseX = e.offsetX;
const mouseY = e.offsetY;

for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (mouseX >= piece.x && mouseX <= piece.x + piece.width && mouseY >= piece.y && mouseY <= piece.y + piece.height) {
        isDragging = true;
        currentPiece = piece;
        offsetX = mouseX - piece.x;
        offsetY = mouseY - piece.y;
        break;
    }
}
    }
});


document.addEventListener('mousemove', (e) => {
if (isDragging && currentPiece) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    currentPiece.x = Math.min(canvas.width - pieceWidth, Math.max(0, mouseX - offsetX));
    currentPiece.y = Math.min(canvas.height - pieceHeight, Math.max(0, mouseY - offsetY));
    drawPieces();
}
});

document.addEventListener('mouseup', () => {
if (isDragging && currentPiece) {
    let newX = Math.round(currentPiece.x / pieceWidth) * pieceWidth;
    let newY = Math.round(currentPiece.y / pieceHeight) * pieceHeight;

    let existingPiece = pieces.find(p => p !== currentPiece && p.x === newX && p.y === newY);

    if (existingPiece) {
        let emptySpot = findEmptyPosition();
        existingPiece.x = emptySpot.x;
        existingPiece.y = emptySpot.y;
    }

    currentPiece.x = newX;
    currentPiece.y = newY;

    isDragging = false;
    currentPiece = null;
    drawPieces();
}
});

function findEmptyPosition() {
let emptyX, emptyY;
let found = false;

while (!found) {
    emptyX = Math.floor(Math.random() * cols) * pieceWidth;
    emptyY = Math.floor(Math.random() * rows) * pieceHeight;
    found = !pieces.some(p => p.x === emptyX && p.y === emptyY);
}

return { x: emptyX, y: emptyY };
}

function checkWin() {
if (!pieces || pieces.length === 0) return;

let allCorrect = pieces.every(piece => 
    piece.x !== undefined && piece.y !== undefined &&
    piece.x === piece.originalX && piece.y === piece.originalY
);

if (allCorrect && !isPuzzleSolved) {  
    isPuzzleSolved = true;  
    clearInterval(timer);  

    setTimeout(() => {
        if (isPuzzleSolved) {  
            alert(`ዙር ${currentLevel} አልቋል !`);
            winLevel()
            if (currentLevel < 4) {  // Move to the next level
                
                currentLevel++;
                setLevel(currentLevel);
                startGame();
            } else {
                alert("ሁሉም የጨዋታ ዙሮች አልቀዋል! 🎉");
                resetGameBtn.style.display = 'block'
            }
        }
    }, 100);
}
}

function solvePuzzle() {
for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    piece.x = piece.originalX;
    piece.y = piece.originalY;
}
drawPieces();
isPuzzleSolved = true;  // Mark the puzzle as solved when the user manually solves it
clearInterval(timer);  // Stop the timer
setTimeout(() => {
    if (isPuzzleSolved) {  // Only show if the puzzle is solved manually
        alert("👌! ጨዋታውን ጨርሰዋል!");  // Show congratulatory message
    }
}, 100);
}



solveButton.addEventListener("click", solvePuzzle);


// Function to update level settings
function setLevel(level) {
    
    if (level === 1) {
        cols = 3;
        rows = 3;
        timeLeft = 60;
    } else if (level === 2) {
        cols = 4;
        rows = 4;
        timeLeft = 120;
    } else if (level === 3) {
        cols = 5;
        rows = 5;
        timeLeft = 300;
    } else if (level === 4) {
        cols = 6;
        rows = 6;
        timeLeft = 420;
    }

    pieceWidth = 700 / cols;
    pieceHeight = 700 / rows;

    document.getElementById("level").innerText = `Level ${level}`;
    document.getElementById("timer").innerText = timeLeft;
    document.getElementById("nextLevel").style.display = "none"; // Hide Next Level button

    // Reset game state for new level
    pieces = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFullGrid();
    drawWinnerZone();
    //startLevel();
}



startGame();  // Initialize the game and timer



const familynameInput = document.querySelector('#familynameInput');
const familyName = document.querySelector('#familyName');

familynameInput.addEventListener("input", () => {
   const familyGroupe = familynameInput.value;
   familyName.textContent = familyGroupe;
});


function failLevel() {
    clearInterval(timer);
    
    document.getElementById("message").innerText = "ግዜው አልቋል! ወደ ቀጣይ ዙር የሚለውን ማስፈንጠሪያ ይጫኑ.";
    document.getElementsByClassName("customImage").innerText ="block";
    //document.getElementById("restartBtn").style.display = "block";
    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("nextLevel").style.display = "block"; // Show Next Level button after failure
}


const previewButton = document.createElement("button");
previewButton.innerText = "ምስሉን 1 ግዜ ብቻ መመልከቻ";
previewButton.style.position = "absolute";
previewButton.style.top = "10px";
previewButton.style.right = "10px";
previewButton.style.padding = "10px";
previewButton.style.backgroundColor = "#ff69b4";
previewButton.style.color = "white";
previewButton.style.border = "none";
previewButton.style.cursor = "pointer";
previewButton.style.borderRadius = "50px";
container.appendChild(previewButton);

let originalPuzzleState = null;
let hasPreviewed = false; // Track if the preview has been used
previewButton.addEventListener("mousedown", () => {
    if (img && !hasPreviewed) {
        
        originalPuzzleState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 700, 700);
    }
});

previewButton.addEventListener("mouseup", () => {
    if (originalPuzzleState) {
       
        ctx.putImageData(originalPuzzleState, 0, 0);
    }
});

// Hide button after first use across all levels
previewButton.addEventListener("click", function() {
    
    hasPreviewed = true; // Mark preview as used
    this.style.display = "none"; // Hide button after first use
});

// Reset button visibility when a new level starts
function showButton(level) {
    
    hasPreviewed = false; // Reset preview status
    
    // Ensure the preview button visibility logic is applied for each level
    if (!hasPreviewed) {
        
    previewButton.style.display = ""; // Make sure the button is visible for the new level
      }
    // You can add any additional logic here for level transitions, such as updating the UI or handling level state
}

/*
previewButton.addEventListener("mouseleave", () => {
    if (originalPuzzleState) {
        
        ctx.putImageData(originalPuzzleState, 0, 0);
    }
});*/