const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Variables for the game ball's x and y coordinates
let x = canvas.width / 2;
let y = canvas.height / 2;

// Chaser array to hold multiple chasers
let chasers = [];
const chaserSpeed = 2;

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
        chaserX = Math.random() * canvas.width;
        chaserY = Math.random() * canvas.height;
    } while ((Math.abs(chaserX - canvas.width / 2) < minDistanceFromCenter &&
        Math.abs(chaserY - canvas.height / 2) < minDistanceFromCenter) ||
    chasers.some(isOverlapping));

    chasers.push({ x: chaserX, y: chaserY });
}

// Spawn a new chaser every 3 seconds
setInterval(createChaser, 1000);

// Movement flags
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(event) {
    if (event.key === 'ArrowRight') {
        rightPressed = true;
        event.preventDefault(); // Prevent default action
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
        event.preventDefault(); // Prevent default action
    }
    if (event.key === 'ArrowDown') {
        downPressed = true;
        event.preventDefault(); // Prevent default action
    } else if (event.key === 'ArrowUp') {
        upPressed = true;
        event.preventDefault(); // Prevent default action
    }
}

function keyUpHandler(event) {
    if (event.key === 'ArrowRight') {
        rightPressed = false;
        event.preventDefault(); // Prevent default action
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
        event.preventDefault(); // Prevent default action
    }
    if (event.key === 'ArrowDown') {
        downPressed = false;
        event.preventDefault(); // Prevent default action
    } else if (event.key === 'ArrowUp') {
        upPressed = false;
        event.preventDefault(); // Prevent default action
    }
}

//chaser logic
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

    function updateChasers() {
        chasers.forEach(chaser => {
            const dx = x - chaser.x;
            const dy = y - chaser.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const moveX = (dx / distance) * chaserSpeed;
                const moveY = (dy / distance) * chaserSpeed;
            }
        });
    }

}

function circlesCollide(circle1, circle2) {
    const dx = circle2.x - circle1.x;
    const dy = circle2.y - circle1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < (circle1.radius + circle2.radius);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (rightPressed && x < canvas.width - 10) {
        x += 5;
    }
    if (leftPressed && x > 10) {
        x -= 5;
    }
    if (downPressed && y < canvas.height - 10) {
        y += 5;
    }
    if (upPressed && y > 10) {
        y -= 5;
    }

    // Update and draw all chasers
    updateChasers();

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    chasers.forEach(chaser => {
        ctx.beginPath();
        ctx.arc(chaser.x, chaser.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#DD9500";
        ctx.fill();
        ctx.closePath();
    });

    requestAnimationFrame(draw);
}

draw();
