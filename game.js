const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Game Constants
const gravity = 0.6;
const jumpForce = -10;
const speed = 5;

// Player Object
let player = {
    x: 100,
    y: 300,
    w: 30,
    h: 30,
    dy: 0,
    grounded: false,
    rotation: 0
};

// Obstacles
let obstacles = [
    { x: 600, w: 30, h: 30 },
    { x: 900, w: 30, h: 30 },
    { x: 1200, w: 30, h: 60 }
];

function draw() {
    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Floor
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 330, canvas.width, 70);

    // Update Player Physics
    player.dy += gravity;
    player.y += player.dy;

    // Ground Collision
    if (player.y + player.h > 330) {
        player.y = 330 - player.h;
        player.dy = 0;
        player.grounded = true;
        // Snap rotation to 90-degree increments when on ground
        player.rotation = Math.round(player.rotation / 90) * 90;
    } else {
        player.grounded = false;
        player.rotation += 5; // Rotate while in air
    }

    // Draw Player
    ctx.save();
    ctx.translate(player.x + player.w/2, player.y + player.h/2);
    ctx.rotate(player.rotation * Math.PI / 180);
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(-player.w/2, -player.h/2, player.w, player.h);
    ctx.strokeStyle = "white";
    ctx.strokeRect(-player.w/2, -player.h/2, player.w, player.h);
    ctx.restore();

    // Draw and Move Obstacles
    ctx.fillStyle = "#ff4d4d";
    obstacles.forEach(obs => {
        obs.x -= speed;
        ctx.fillRect(obs.x, 330 - obs.h, obs.w, obs.h);

        // Simple AABB Collision Detection
        if (player.x < obs.x + obs.w &&
            player.x + player.w > obs.x &&
            player.y < (330 - obs.h) + obs.h &&
            player.y + player.h > 330 - obs.h) {
            resetGame();
        }

        // Respawn obstacles to loop level
        if (obs.x < -50) {
            obs.x = canvas.width + Math.random() * 300;
        }
    });

    requestAnimationFrame(draw);
}

function resetGame() {
    player.y = 300;
    player.dy = 0;
    obstacles[0].x = 600;
    obstacles[1].x = 900;
    obstacles[2].x = 1200;
}

// Input Handling
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && player.grounded) {
        player.dy = jumpForce;
    }
});

// Click/Touch to jump
canvas.addEventListener("mousedown", () => {
    if (player.grounded) player.dy = jumpForce;
});

draw();
