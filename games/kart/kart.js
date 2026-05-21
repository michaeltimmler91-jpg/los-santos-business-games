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
    x: 1420,
    y: 620,
    width: 42,
    height: 24,
    angle: Math.PI / 2,
    speed: 0,
    maxSpeed: 7,
    acceleration: 0.15,
    friction: 0.965,
    turnSpeed: 0.045,
    color: "#ff4fd8",
    lap: 1,
    checkpoints: {
        top: false,
        left: false,
        bottom: false
    }
};

const track = {
    centerX: 1000,
    centerY: 700,
    outerRadiusX: 820,
    outerRadiusY: 500,
    innerRadiusX: 430,
    innerRadiusY: 230
};

const race = {
    totalLaps: 3,
    finished: false,
    startTime: Date.now(),
    finishTime: null
};

const boostPads = [

    {
        x: 880,
        y: 320,
        width: 240,
        height: 40
    },

    {
        x: 880,
        y: 1040,
        width: 240,
        height: 40
    }

];

function update() {
    if (race.finished) {
        updateUI();
        return;
    }

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

    checkCheckpoints();
    checkFinishLine();
    checkBoostPads();
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

function checkCheckpoints() {
    if (
        player.y < track.centerY - 350
    ) {
        player.checkpoints.top = true;
    }

    if (
        player.x < track.centerX - 600
    ) {
        player.checkpoints.left = true;
    }

    if (
        player.y > track.centerY + 350
    ) {
        player.checkpoints.bottom = true;
    }
}

function checkFinishLine() {
    const finishX =
    track.centerX + track.innerRadiusX;

    const nearFinishX =
    Math.abs(player.x - finishX) < 35;

    const nearFinishY =
    player.y > track.centerY - 110 &&
    player.y < track.centerY + 110;

    if (
        nearFinishX &&
        nearFinishY &&
        player.checkpoints.top &&
        player.checkpoints.left &&
        player.checkpoints.bottom
    ) {
        player.lap++;

        player.checkpoints.top = false;
        player.checkpoints.left = false;
        player.checkpoints.bottom = false;

        if (player.lap > race.totalLaps) {
            race.finished = true;
            race.finishTime = Date.now();

            document.getElementById("lap").innerHTML =
            "🏁 ZIEL!";
        }
    }
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

    drawBoostPads();
    drawFinishLine();
    drawCheckpointMarkers();
    }
function drawBoostPads() {

    boostPads.forEach(pad => {

        ctx.fillStyle =
        "#22c55e";

        ctx.fillRect(
            pad.x,
            pad.y,
            pad.width,
            pad.height
        );

        ctx.strokeStyle =
        "#86efac";

        ctx.lineWidth = 4;

        ctx.strokeRect(
            pad.x,
            pad.y,
            pad.width,
            pad.height
        );

        ctx.fillStyle =
        "rgba(255,255,255,0.45)";

        for (
            let i = 0;
            i < pad.width;
            i += 40
        ) {

            ctx.beginPath();

            ctx.moveTo(
                pad.x + i,
                pad.y
            );

            ctx.lineTo(
                pad.x + i + 25,
                pad.y + pad.height
            );

            ctx.stroke();
        }
    });
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

function drawCheckpointMarkers() {

    ctx.fillStyle =
    "rgba(34,197,94,0.28)";

    // TOP

    ctx.fillRect(
        track.centerX - 140,
        track.centerY - 410,
        280,
        80
    );

    // LINKS

    ctx.fillRect(
        track.centerX - 710,
        track.centerY - 140,
        80,
        280
    );

    // BOTTOM

    ctx.fillRect(
        track.centerX - 140,
        track.centerY + 330,
        280,
        80
    );
}

function checkBoostPads() {

    boostPads.forEach(pad => {

        if (

            player.x >
            pad.x &&

            player.x <
            pad.x + pad.width &&

            player.y >
            pad.y &&

            player.y <
            pad.y + pad.height

        ) {

            player.speed += 0.35;

            if (
                player.speed >
                player.maxSpeed + 3
            ) {
                player.speed =
                player.maxSpeed + 3;
            }
        }
    });
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

function drawFinishOverlay() {
    if (!race.finished) return;

    const time =
    ((race.finishTime - race.startTime) / 1000)
    .toFixed(2);

    ctx.fillStyle =
    "rgba(0,0,0,0.72)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
    "white";

    ctx.font =
    "bold 58px Arial";

    ctx.textAlign =
    "center";

    ctx.fillText(
        "🏁 ZIEL!",
        canvas.width / 2,
        canvas.height / 2 - 40
    );

    ctx.font =
    "bold 28px Arial";

    ctx.fillText(
        `Zeit: ${time}s`,
        canvas.width / 2,
        canvas.height / 2 + 15
    );

    ctx.font =
    "20px Arial";

    ctx.fillText(
        "Seite neu laden f&uuml;r Neustart",
        canvas.width / 2,
        canvas.height / 2 + 60
    );
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

    drawFinishOverlay();
}

function updateUI() {
    document.getElementById("speed").innerHTML =
    `🚕 ${Math.abs(Math.round(player.speed * 40))} km/h`;

    if (!race.finished) {
        document.getElementById("lap").innerHTML =
        `🏁 Runde ${player.lap}/${race.totalLaps}`;
    }
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
