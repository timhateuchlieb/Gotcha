const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// Resize canvas to window size
function resize() {
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Set the canvas width and height properties
    canvas.width = canvasWidth * devicePixelRatio;
    canvas.height = canvasHeight * devicePixelRatio;

    // Set the canvas CSS width and height properties to match the window size
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    // Scale the canvas context to account for the device pixel ratio
    ctx.scale(devicePixelRatio, devicePixelRatio);
}

window.addEventListener('resize', resize);
resize();

let gameOver = false;

// Variables for the game ball's x and y coordinates
let x = canvasWidth / 2;
let y = canvasHeight / 2;
let chaserCount = 0;

// Chasers
let chasers = [];
const chaserSpeed = 2;
const radius = 10;

// Function to create a new chaser at a random position excluding the center and other chasers
function createChaser() {
    const minDistanceFromCenter = 100;
    const chaserRadius = 10;
    let chaserX, chaserY;

    function isOverlapping(existingChaser) {
        const dx = chaserX - existingChaser.x;
        const dy = chaserY - existingChaser.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (chaserRadius * 2);
    }

    do {
        chaserX = Math.random() * canvasWidth;
        chaserY = Math.random() * canvasHeight;
    } while ((Math.abs(chaserX - canvasWidth / 2) < minDistanceFromCenter &&
        Math.abs(chaserY - canvasHeight / 2) < minDistanceFromCenter) ||
    chasers.some(isOverlapping));

    chasers.push({ x: chaserX, y: chaserY });
    chaserCount ++;
}

// Spawn a new chaser every 1 second
setInterval(createChaser, 1000);

// Movement flags
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(event) {
    if (event.key === 'd' || event.key === 'ArrowRight') {
        rightPressed = true;
        event.preventDefault(); // Prevent default action
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
        leftPressed = true;
        event.preventDefault(); // Prevent default action
    }
    if (event.key === 's' || event.key === 'ArrowDown') {
        downPressed = true;
        event.preventDefault(); // Prevent default action
    } else if (event.key === 'w' || event.key === 'ArrowUp') {
        upPressed = true;
        event.preventDefault(); // Prevent default action
    }
    if (event.key === ' ') {
        spacePressed = true;
        event.preventDefault();
    }
}

function keyUpHandler(event) {
    if (event.key === 'd' || event.key === 'ArrowRight') {
        rightPressed = false;
        event.preventDefault(); // Prevent default action
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
        leftPressed = false;
        event.preventDefault(); // Prevent default action
    }
    if (event.key === 's' || event.key === 'ArrowDown') {
        downPressed = false;
        event.preventDefault(); // Prevent default action
    } else if (event.key === 'w' || event.key === 'ArrowUp') {
        upPressed = false;
        event.preventDefault(); // Prevent default action
    }
    if (event.key === ' ') {
        spacePressed = false;
        event.preventDefault();
    }
}

// Chaser logic
function updateChasers() {
    chasers.forEach(chaser => {
        const dx = x - chaser.x;
        const dy = y - chaser.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            chaser.x += (dx / distance) * chaserSpeed;
            chaser.y += (dy / distance) * chaserSpeed;
        }
    });
}

function circlesCollide(circle1, circle2) {
    const dx = circle2.x - circle1.x;
    const dy = circle2.y - circle1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < (circle1.radius + circle2.radius);
}

// Add this resetGame function to reset the game state
function resetGame() {
    gameOver = false;
    chaserCount = 0;
    x = canvasWidth / 2;
    y = canvasHeight / 2;
    chasers = [];
    draw();
}

function draw() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.font = "48px serif";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2);
        ctx.font = "24px serif";
        ctx.fillStyle = "white";
        ctx.fillText(`score: ${chaserCount}`, canvasWidth / 2, canvasHeight / 2 + 60);
        return;
    }

    ctx.clearRect(0, 0, canvasWidth * devicePixelRatio, canvasWidth * devicePixelRatio);

    if (rightPressed && x < canvasWidth - radius) {
        x += 5;
    }
    if (leftPressed && x > radius) {
        x -= 5;
    }
    if (downPressed && y < canvasHeight - radius) {
        y += 5;
    }
    if (upPressed && y > radius) {
        y -= 5;
    }
    if (spacePressed && rightPressed && x < canvasWidth - 3 * radius) {
        x += 20;
    }
    if (spacePressed && leftPressed && x > 3 * radius) {
        x -= 20;
    }
    if (spacePressed && downPressed && y < canvasHeight - 3 * radius) {
        y += 20;
    }
    if (spacePressed && upPressed && y > 3 * radius) {
        y -= 20;
    }

    // Update and draw all chasers
    updateChasers();

    // Collision detection
    for (let i = 0; i < chasers.length; i++) {
        if (circlesCollide({ x: x, y: y, radius: radius }, { x: chasers[i].x, y: chasers[i].y, radius: radius })) {
            gameOver = true;
            break;
        }
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    chasers.forEach(chaser => {
        ctx.beginPath();
        ctx.arc(chaser.x, chaser.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#dd0000";
        ctx.fill();
        ctx.closePath();
    });

    // Display chaser count during the game
    ctx.font = "10px serif";
    ctx.fillStyle = "white";
    ctx.fillText(`Chasers Spawned: ${chaserCount}`, 10, 20);

    requestAnimationFrame(draw);
}

draw();
