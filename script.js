const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let devicePixelRatio = window.devicePixelRatio || 1;

// Game variables
let gameOver = false;

let lives = 3;
let playerX = canvasWidth / 2;
let playerY = canvasHeight / 2;

let chaserCount = 0;
let chasers = [];
const chaserSpeed = 2;
const radius = 10;

// Invincibility variables
let invincible = false;
let invincibilityDuration = 3000; // 3 seconds of invincibility
let invincibilityStartTime = 0;

// Movement flags
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let spacePressed = false;

// Initialize canvas
function resizeCanvas() {
    devicePixelRatio = window.devicePixelRatio || 1;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = canvasWidth * devicePixelRatio;
    canvas.height = canvasHeight * devicePixelRatio;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(devicePixelRatio, devicePixelRatio);
}

window.addEventListener('resize', debounce(resizeCanvas, 200));
resizeCanvas();

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(event) {
    switch (event.key) {
        case 'd':
        case 'ArrowRight':
            rightPressed = true;
            break;
        case 'a':
        case 'ArrowLeft':
            leftPressed = true;
            break;
        case 's':
        case 'ArrowDown':
            downPressed = true;
            break;
        case 'w':
        case 'ArrowUp':
            upPressed = true;
            break;
        case ' ':
            spacePressed = true;
            break;
        case 'Enter':
            if (gameOver) resetGame();
            break;
    }
    event.preventDefault();
}

function keyUpHandler(event) {
    switch (event.key) {
        case 'd':
        case 'ArrowRight':
            rightPressed = false;
            break;
        case 'a':
        case 'ArrowLeft':
            leftPressed = false;
            break;
        case 's':
        case 'ArrowDown':
            downPressed = false;
            break;
        case 'w':
        case 'ArrowUp':
            upPressed = false;
            break;
        case ' ':
            spacePressed = false;
            break;
    }
    event.preventDefault();
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function createChaser() {
    const minDistanceFromPlayer = 200;

    let chaserX, chaserY;

    do {
        chaserX = Math.random() * canvasWidth;
        chaserY = Math.random() * canvasHeight;

    } while ((Math.abs(playerX - chaserX) < minDistanceFromPlayer && Math.abs(playerY - chaserY) < minDistanceFromPlayer) || chasers.some(chaser => isOverlapping(chaserX, chaserY, chaser)));

    chasers.push({ x: chaserX, y: chaserY });
    chaserCount++;
}

function isOverlapping(x, y, chaser) {
    const dx = x - chaser.x;
    const dy = y - chaser.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (radius * 2);
}

function updateChasers() {
    chasers.forEach(chaser => {
        const dx = playerX - chaser.x;
        const dy = playerY - chaser.y;
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

function resetGame() {
    gameOver = false;
    lives = 3;
    chaserCount = 0;
    playerX = canvasWidth / 2;
    playerY = canvasHeight / 2;
    chasers = [];
    invincible = false;
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
        ctx.fillText(`Score: ${chaserCount}`, canvasWidth / 2, canvasHeight / 2 + 60);
        ctx.font = "12px serif";
        ctx.fillText("Press Enter to replay", canvasWidth / 2, canvasHeight / 2 + 120);
        return;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (rightPressed && playerX < canvasWidth - radius) playerX += 5;
    if (leftPressed && playerX > radius) playerX -= 5;
    if (downPressed && playerY < canvasHeight - radius) playerY += 5;
    if (upPressed && playerY > radius) playerY -= 5;
    if (spacePressed) {
        if (rightPressed && playerX < canvasWidth - 3 * radius) playerX += 20;
        if (leftPressed && playerX > 3 * radius) playerX -= 20;
        if (downPressed && playerY < canvasHeight - 3 * radius) playerY += 20;
        if (upPressed && playerY > 3 * radius) playerY -= 20;
    }

    updateChasers();

    if (invincible && (Date.now() - invincibilityStartTime) >= invincibilityDuration) {
        invincible = false;
    }

    for (let i = 0; i < chasers.length; i++) {
        if (!invincible && circlesCollide({ x: playerX, y: playerY, radius: radius }, { x: chasers[i].x, y: chasers[i].y, radius: radius })) {
            lives--;
            invincible = true;
            invincibilityStartTime = Date.now();
            if (lives === 0) {
                gameOver = true;
            }
            break;
        }
    }

    ctx.beginPath();
    ctx.arc(playerX, playerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = invincible ? "rgba(0, 149, 221, 0.5)" : "#0095DD"; // Visual feedback for invincibility
    ctx.fill();
    ctx.closePath();

    chasers.forEach(chaser => {
        ctx.beginPath();
        ctx.arc(chaser.x, chaser.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#dd0000";
        ctx.fill();
        ctx.closePath();
    });

    ctx.font = "10px serif";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${chaserCount}`, 20, 20);
    ctx.fillText(`Lives: ${lives}`, 20, 40);

    requestAnimationFrame(draw);
}

// Start game loop and chaser creation
requestAnimationFrame(draw);
setInterval(createChaser, 1000);
