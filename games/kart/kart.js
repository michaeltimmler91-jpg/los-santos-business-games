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

const world = {
    width: 2400,
    height: 1600
};

const player = {
    x: 520,
    y: 1240,
    width: 44,
    height: 24,
    angle: 0,
    speed: 0,
    maxSpeed: 7.5,
    acceleration: 0.16,
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

const road = {
    width: 180
};

const boostPads = [
    { x: 820, y: 1180, w: 240, h: 44 },
    { x: 1580, y: 650, w: 44, h: 220 },
    { x: 840, y: 340, w: 220, h: 44 }
];

const checkpoints = {
    cp1: { x: 1540, y: 560, w: 170, h: 220 },
    cp2: { x: 800, y: 280, w: 260, h: 160 },
    cp3: { x: 360, y: 780, w: 180, h: 260 }
};

const finishLine = {
    x: 430,
    y: 1160,
    w: 34,
    h: 170
};

const roadMask =
document.createElement("canvas");

roadMask.width =
world.width;

roadMask.height =
world.height;

const maskCtx =
roadMask.getContext("2d");

function buildRoadPath(context) {
    context.beginPath();

    context.moveTo(460, 1240);

    context.bezierCurveTo(
        850, 1420,
        1450, 1380,
        1710, 1080
    );

    context.bezierCurveTo(
        1980, 760,
        1750, 430,
        1360, 420
    );

    context.bezierCurveTo(
        980, 410,
        720, 270,
        520, 520
    );

    context.bezierCurveTo(
        300, 790,
        260, 1100,
        460, 1240
    );
}

function createRoadMask() {
    maskCtx.clearRect(
        0,
        0,
        world.width,
        world.height
    );

    maskCtx.lineWidth =
    road.width;

    maskCtx.lineCap =
    "round";

    maskCtx.lineJoin =
    "round";

    maskCtx.strokeStyle =
    "white";

    buildRoadPath(maskCtx);

    maskCtx.stroke();
}

createRoadMask();

function isOnRoad(x, y) {
    if (
        x < 0 ||
        y < 0 ||
        x >= world.width ||
        y >= world.height
    ) {
        return false;
    }

    const pixel =
    maskCtx.getImageData(
        Math.floor(x),
        Math.floor(y),
        1,
        1
    ).data;

    return pixel[3] > 0;
}

function isInsideRect(x, y, rect) {
    return (
        x > rect.x &&
        x < rect.x + rect.w &&
        y > rect.y &&
        y < rect.y + rect.h
    );
}

function update() {
    if (race.finished) {
        updateUI();
        return;
    }

    if (keys["w"]) {
        player.speed +=
        player.acceleration;
    }

    if (keys["s"]) {
        player.speed -=
        player.acceleration;
    }

    player.speed *=
    player.friction;

    if (player.speed > player.maxSpeed) {
        player.speed =
        player.maxSpeed;
    }

    if (player.speed < -player.maxSpeed / 2) {
        player.speed =
        -player.maxSpeed / 2;
    }

    if (keys["a"]) {
        player.angle -=
        player.turnSpeed *
        (player.speed / 3);
    }

    if (keys["d"]) {
        player.angle +=
        player.turnSpeed *
        (player.speed / 3);
    }

    const nextX =
    player.x +
    Math.cos(player.angle) *
    player.speed;

    const nextY =
    player.y +
    Math.sin(player.angle) *
    player.speed;

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

function checkBoostPads() {
    boostPads.forEach(pad => {
        if (
            isInsideRect(
                player.x,
                player.y,
                pad
            )
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

function checkCheckpoints() {
    Object.keys(checkpoints).forEach(key => {
        if (
            isInsideRect(
                player.x,
                player.y,
                checkpoints[key]
            )
        ) {
            player.checkpoints[key] = true;
        }
    });
}

function checkFinishLine() {
    if (
        isInsideRect(
            player.x,
            player.y,
            finishLine
        ) &&
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

    ctx.fillRect(
        0,
        0,
        world.width,
        world.height
    );

    drawBuildings();
    drawDecorations();
}

function drawBuildings() {
    const buildings = [
        { x: 170, y: 170, w: 280, h: 260 },
        { x: 760, y: 120, w: 330, h: 160 },
        { x: 1420, y: 150, w: 330, h: 220 },
        { x: 1880, y: 530, w: 260, h: 260 },
        { x: 1600, y: 1190, w: 380, h: 240 },
        { x: 760, y: 960, w: 340, h: 160 },
        { x: 200, y: 1120, w: 220, h: 250 },
        { x: 1090, y: 650, w: 220, h: 220 }
    ];

    buildings.forEach(b => {
        ctx.fillStyle = "#0f172a";

        ctx.fillRect(
            b.x,
            b.y,
            b.w,
            b.h
        );

        ctx.strokeStyle = "#334155";

        ctx.lineWidth = 5;

        ctx.strokeRect(
            b.x,
            b.y,
            b.w,
            b.h
        );
    });
}

function drawDecorations() {
    ctx.fillStyle = "#22c55e";

    for (let i = 0; i < 70; i++) {
        const x =
        (i * 197) % world.width;

        const y =
        (i * 311) % world.height;

        if (!isOnRoad(x, y)) {
            ctx.beginPath();

            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }
}

function drawRoad() {
    ctx.lineCap =
    "round";

    ctx.lineJoin =
    "round";

    ctx.lineWidth =
    road.width + 18;

    ctx.strokeStyle =
    "#facc15";

    buildRoadPath(ctx);

    ctx.stroke();

    ctx.lineWidth =
    road.width;

    ctx.strokeStyle =
    "#374151";

    buildRoadPath(ctx);

    ctx.stroke();

    ctx.lineWidth = 4;

    ctx.strokeStyle =
    "rgba(255,255,255,0.7)";

    ctx.setLineDash([35, 35]);

    buildRoadPath(ctx);

    ctx.stroke();

    ctx.setLineDash([]);
}

function drawBoostPads() {
    boostPads.forEach(pad => {
        ctx.fillStyle = "#22c55e";

        ctx.fillRect(
            pad.x,
            pad.y,
            pad.w,
            pad.h
        );

        ctx.strokeStyle = "#86efac";

        ctx.lineWidth = 4;

        ctx.strokeRect(
            pad.x,
            pad.y,
            pad.w,
            pad.h
        );
    });
}

function drawCheckpoints() {
    ctx.fillStyle =
    "rgba(34,197,94,0.13)";

    Object.values(checkpoints).forEach(cp => {
        ctx.fillRect(
            cp.x,
            cp.y,
            cp.w,
            cp.h
        );
    });
}

function drawFinishLine() {
    const square = 17;

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

    ctx.fillRect(-16, -14, 8, 5);
    ctx.fillRect(8, -14, 8, 5);
    ctx.fillRect(-16, 9, 8, 5);
    ctx.fillRect(8, 9, 8, 5);

    ctx.restore();
}

function drawFinishOverlay() {
    if (!race.finished) return;

    const time =
    (
        (race.finishTime - race.startTime) /
        1000
    ).toFixed(2);

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
        "Seite neu laden fuer Neustart",
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

    drawWorld();
    drawRoad();
    drawBoostPads();
    drawCheckpoints();
    drawFinishLine();
    drawPlayer();

    ctx.restore();

    drawFinishOverlay();
}

function updateUI() {
    document.getElementById("speed").innerHTML =
    `🚕 ${
        Math.abs(
            Math.round(
                player.speed * 40
            )
        )
    } km/h`;

    if (!race.finished) {
        document.getElementById("lap").innerHTML =
        `🏁 Runde ${player.lap}/${race.totalLaps}`;
    }
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();

window.addEventListener("resize", () => {
    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;
});
