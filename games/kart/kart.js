const canvas =
document.getElementById("game");

const ctx =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

const keys = {};

window.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

const player = {
    x: 500,
    y: 500,
    width: 42,
    height: 24,
    angle: 0,
    speed: 0,
    maxSpeed: 7,
    acceleration: 0.15,
    friction: 0.965,
    turnSpeed: 0.045,
    color: "#ff4fd8"
};

const track = {
    centerX: 1000,
    centerY: 700,
    outerRadiusX: 820,
    outerRadiusY: 500,
    innerRadiusX: 430,
    innerRadiusY: 230
};

function update() {
    if (keys["w"]) {
        player.speed += player.acceleration;
    }

    if (keys["s"]) {
        player.speed -= player.acceleration;
    }

    player.speed *= player.friction;

    if (player.speed > player.maxSpeed) {
        player.speed = player.maxSpeed;
    }

    if (player.speed < -player.maxSpeed / 2) {
        player.speed = -player.maxSpeed / 2;
    }

    if (keys["a"]) {
        player.angle -= player.turnSpeed * (player.speed / 3);
    }

    if (keys["d"]) {
        player.angle += player.turnSpeed * (player.speed / 3);
    }

    const nextX =
    player.x + Math.cos(player.angle) * player.speed;

    const nextY =
    player.y + Math.sin(player.angle) * player.speed;

    if (isOnRoad(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
    } else {
        player.speed *= -0.35;
    }

    updateUI();
}

function isInsideEllipse(x, y, rx, ry) {
    const dx =
    x - track.centerX;

    const dy =
    y - track.centerY;

    return (
        (dx * dx) / (rx * rx) +
        (dy * dy) / (ry * ry)
    ) <= 1;
}

function isOnRoad(x, y) {
    const insideOuter =
    isInsideEllipse(
        x,
        y,
        track.outerRadiusX,
        track.outerRadiusY
    );

    const insideInner =
    isInsideEllipse(
        x,
        y,
        track.innerRadiusX,
        track.innerRadiusY
    );

    return insideOuter && !insideInner;
}

function drawTrack() {
    ctx.fillStyle = "#14532d";
    ctx.fillRect(
        track.centerX - 1000,
        track.centerY - 700,
        2000,
        1400
    );

    ctx.beginPath();
    ctx.ellipse(
        track.centerX,
        track.centerY,
        track.outerRadiusX,
        track.outerRadiusY,
        0,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = "#374151";
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(
        track.centerX,
        track.centerY,
        track.innerRadiusX,
        track.innerRadiusY,
        0,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = "#14532d";
    ctx.fill();

    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 8;

    ctx.beginPath();
    ctx.ellipse(
        track.centerX,
        track.centerY,
        track.outerRadiusX,
        track.outerRadiusY,
        0,
        0,
        Math.PI * 2
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(
        track.centerX,
        track.centerY,
        track.innerRadiusX,
        track.innerRadiusY,
        0,
        0,
        Math.PI * 2
    );
    ctx.stroke();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.setLineDash([30, 30]);

    ctx.beginPath();
    ctx.ellipse(
        track.centerX,
        track.centerY,
        625,
        365,
        0,
        0,
        Math.PI * 2
    );
    ctx.stroke();

    ctx.setLineDash([]);

    drawFinishLine();
}

function drawFinishLine() {
    const x =
    track.centerX + track.innerRadiusX;

    const y =
    track.centerY - 80;

    const square = 20;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 2; col++) {
            ctx.fillStyle =
            (row + col) % 2 === 0
            ? "white"
            : "black";

            ctx.fillRect(
                x + col * square,
                y + row * square,
                square,
                square
            );
        }
    }
}

function drawPlayer() {
    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    ctx.rotate(
        player.angle
    );

    ctx.fillStyle =
    player.color;

    ctx.fillRect(
        -player.width / 2,
        -player.height / 2,
        player.width,
        player.height
    );

    ctx.fillStyle =
    "white";

    ctx.fillRect(
        5,
        -7,
        14,
        14
    );

    ctx.fillStyle =
    "#111827";

    ctx.fillRect(
        -16,
        -14,
        8,
        5
    );

    ctx.fillRect(
        8,
        -14,
        8,
        5
    );

    ctx.fillRect(
        -16,
        9,
        8,
        5
    );

    ctx.fillRect(
        8,
        9,
        8,
        5
    );

    ctx.restore();
}

function drawWorldDetails() {
    ctx.fillStyle = "#22c55e";

    for (let i = 0; i < 60; i++) {
        const x =
        (i * 173) % 2000;

        const y =
        (i * 291) % 1400;

        ctx.beginPath();
        ctx.arc(
            x,
            y,
            6,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}

function draw() {
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.save();

    ctx.translate(
        canvas.width / 2 - player.x,
        canvas.height / 2 - player.y
    );

    drawWorldDetails();
    drawTrack();
    drawPlayer();

    ctx.restore();
}

function updateUI() {
    document.getElementById("speed").innerHTML =
    `🚕 ${Math.abs(Math.round(player.speed * 40))} km/h`;
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}

gameLoop();

window.addEventListener("resize", () => {
    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;
});
