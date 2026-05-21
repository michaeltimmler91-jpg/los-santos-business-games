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
    x: 260,
    y: 520,
    width: 42,
    height: 24,
    angle: 0,
    speed: 0,
    maxSpeed: 7,
    acceleration: 0.15,
    friction: 0.965,
    turnSpeed: 0.045,
    color: "#ff4fd8",
    lap: 1,
    checkpoints: {
        cp1: false,
        cp2: false,
        cp3: false
    }
};

const race = {
    totalLaps: 3,
    finished: false,
    startTime: Date.now(),
    finishTime: null
};

const roads = [
    // Start/Ziel Gerade unten
    { x: 180, y: 500, w: 1200, h: 140 },

    // rechte Gerade hoch
    { x: 1240, y: 260, w: 140, h: 380 },

    // obere Gerade zurück
    { x: 360, y: 260, w: 1020, h: 140 },

    // linke Gerade runter
    { x: 360, y: 260, w: 140, h: 620 },

    // untere Rückführung
    { x: 360, y: 740, w: 780, h: 140 },

    // kleine Schikane rechts unten
    { x: 1000, y: 620, w: 140, h: 260 },
    { x: 1000, y: 620, w: 380, h: 140 },

    // Verbindung zur Startgeraden
    { x: 1240, y: 500, w: 140, h: 260 }
];

const boostPads = [
    { x: 620, y: 548, w: 180, h: 44 },
    { x: 780, y: 308, w: 200, h: 44 },
    { x: 1048, y: 700, w: 44, h: 120 }
];


const checkpoints = {
    cp1: { x: 1240, y: 300, w: 140, h: 160 },
    cp2: { x: 700, y: 260, w: 220, h: 140 },
    cp3: { x: 360, y: 700, w: 140, h: 180 }
};
const finishLine = {
    x: 230,
    y: 500,
    w: 24,
    h: 140
};

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

    checkBoostPads();
    checkCheckpoints();
    checkFinishLine();
    updateUI();
}

function isOnRoad(x, y) {
    return roads.some(road => {
        return (
            x > road.x &&
            x < road.x + road.w &&
            y > road.y &&
            y < road.y + road.h
        );
    });
}

function isInsideRect(x, y, rect) {
    return (
        x > rect.x &&
        x < rect.x + rect.w &&
        y > rect.y &&
        y < rect.y + rect.h
    );
}

function checkBoostPads() {
    boostPads.forEach(pad => {
        if (isInsideRect(player.x, player.y, pad)) {
            player.speed += 0.35;

            if (player.speed > player.maxSpeed + 3) {
                player.speed = player.maxSpeed + 3;
            }
        }
    });
}

function checkCheckpoints() {
    Object.keys(checkpoints).forEach(key => {
        if (isInsideRect(player.x, player.y, checkpoints[key])) {
            player.checkpoints[key] = true;
        }
    });
}

function checkFinishLine() {
    if (
        isInsideRect(player.x, player.y, finishLine) &&
        player.checkpoints.cp1 &&
        player.checkpoints.cp2 &&
        player.checkpoints.cp3
    ) {
        player.lap++;

        player.checkpoints.cp1 = false;
        player.checkpoints.cp2 = false;
        player.checkpoints.cp3 = false;

        if (player.lap > race.totalLaps) {
            race.finished = true;
            race.finishTime = Date.now();

            document.getElementById("lap").innerHTML =
            "🏁 ZIEL!";
        }
    }
}

function drawWorld() {
    ctx.fillStyle = "#14532d";
    ctx.fillRect(0, 0, 2200, 1500);

    drawBuildings();
}

function drawBuildings() {
    ctx.fillStyle = "#111827";

    const buildings = [
        { x: 260, y: 180, w: 320, h: 180 },
        { x: 1120, y: 180, w: 300, h: 180 },
        { x: 240, y: 720, w: 220, h: 260 },
        { x: 760, y: 900, w: 260, h: 90 },
        { x: 1360, y: 840, w: 280, h: 300 },
        { x: 1720, y: 420, w: 260, h: 260 }
    ];

    buildings.forEach(b => {
        ctx.fillRect(b.x, b.y, b.w, b.h);

        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 4;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
    });
}

function drawRoads() {
    roads.forEach(road => {
        ctx.fillStyle = "#374151";
        ctx.fillRect(road.x, road.y, road.w, road.h);

        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 5;
        ctx.strokeRect(road.x, road.y, road.w, road.h);

        drawRoadLines(road);
    });
}

function drawRoadLines(road) {
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.lineWidth = 3;
    ctx.setLineDash([35, 25]);

    ctx.beginPath();

    if (road.w >= road.h) {
        ctx.moveTo(road.x, road.y + road.h / 2);
        ctx.lineTo(road.x + road.w, road.y + road.h / 2);
    } else {
        ctx.moveTo(road.x + road.w / 2, road.y);
        ctx.lineTo(road.x + road.w / 2, road.y + road.h);
    }

    ctx.stroke();
    ctx.setLineDash([]);
}

function drawBoostPads() {
    boostPads.forEach(pad => {
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(pad.x, pad.y, pad.w, pad.h);

        ctx.strokeStyle = "#86efac";
        ctx.lineWidth = 4;
        ctx.strokeRect(pad.x, pad.y, pad.w, pad.h);
    });
}

function drawCheckpoints() {
    ctx.fillStyle = "rgba(34,197,94,0.18)";

    Object.values(checkpoints).forEach(cp => {
        ctx.fillRect(cp.x, cp.y, cp.w, cp.h);
    });
}

function drawFinishLine() {
    const square = 14;

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 2; col++) {
            ctx.fillStyle =
            (row + col) % 2 === 0
            ? "white"
            : "black";

            ctx.fillRect(
                finishLine.x + col * square,
                finishLine.y + row * square,
                square,
                square
            );
        }
    }
}

function drawPlayer() {
    ctx.save();

    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);

    ctx.fillStyle = player.color;
    ctx.fillRect(
        -player.width / 2,
        -player.height / 2,
        player.width,
        player.height
    );

    ctx.fillStyle = "white";
    ctx.fillRect(5, -7, 14, 14);

    ctx.fillStyle = "#111827";
    ctx.fillRect(-16, -14, 8, 5);
    ctx.fillRect(8, -14, 8, 5);
    ctx.fillRect(-16, 9, 8, 5);
    ctx.fillRect(8, 9, 8, 5);

    ctx.restore();
}

function drawFinishOverlay() {
    if (!race.finished) return;

    const time =
    ((race.finishTime - race.startTime) / 1000)
    .toFixed(2);

    ctx.fillStyle = "rgba(0,0,0,0.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "bold 58px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "🏁 ZIEL!",
        canvas.width / 2,
        canvas.height / 2 - 40
    );

    ctx.font = "bold 28px Arial";

    ctx.fillText(
        `Zeit: ${time}s`,
        canvas.width / 2,
        canvas.height / 2 + 15
    );

    ctx.font = "20px Arial";

    ctx.fillText(
        "Seite neu laden für Neustart",
        canvas.width / 2,
        canvas.height / 2 + 60
    );
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(
        canvas.width / 2 - player.x,
        canvas.height / 2 - player.y
    );

    drawWorld();
    drawRoads();
    drawBoostPads();
    drawCheckpoints();
    drawFinishLine();
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
