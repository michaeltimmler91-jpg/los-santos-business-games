const canvas =
document.getElementById(
    "game"
);

const ctx =
canvas.getContext("2d");

canvas.width =
window.innerWidth;

canvas.height =
window.innerHeight;

const keys = {};

window.addEventListener(
    "keydown",
    e => {
        keys[e.key.toLowerCase()] = true;
    }
);

window.addEventListener(
    "keyup",
    e => {
        keys[e.key.toLowerCase()] = false;
    }
);

const player = {

    x: 500,
    y: 500,

    width: 40,
    height: 22,

    angle: 0,

    speed: 0,
    maxSpeed: 6,

    acceleration: 0.12,
    friction: 0.96,

    turnSpeed: 0.05,

    color: "#ff4fd8"
};

const track = {

    x: 120,
    y: 120,

    width: 1800,
    height: 1200
};

function update() {

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

    if (
        player.speed >
        player.maxSpeed
    ) {
        player.speed =
        player.maxSpeed;
    }

    if (
        player.speed <
        -player.maxSpeed / 2
    ) {
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

    player.x +=
    Math.cos(player.angle) *
    player.speed;

    player.y +=
    Math.sin(player.angle) *
    player.speed;

    checkTrackBounds();

    updateUI();
}

function checkTrackBounds() {

    if (
        player.x <
        track.x
    ) {
        player.x =
        track.x;

        player.speed *=
        -0.4;
    }

    if (
        player.y <
        track.y
    ) {
        player.y =
        track.y;

        player.speed *=
        -0.4;
    }

    if (
        player.x >
        track.x +
        track.width
    ) {
        player.x =
        track.x +
        track.width;

        player.speed *=
        -0.4;
    }

    if (
        player.y >
        track.y +
        track.height
    ) {
        player.y =
        track.y +
        track.height;

        player.speed *=
        -0.4;
    }
}

function drawTrack() {

    ctx.fillStyle =
    "#374151";

    ctx.fillRect(
        track.x,
        track.y,
        track.width,
        track.height
    );

    ctx.strokeStyle =
    "#facc15";

    ctx.lineWidth = 10;

    ctx.strokeRect(
        track.x,
        track.y,
        track.width,
        track.height
    );

    ctx.strokeStyle =
    "white";

    ctx.setLineDash([40,20]);

    ctx.beginPath();

    ctx.moveTo(
        track.x + 100,
        track.y + track.height / 2
    );

    ctx.lineTo(
        track.x + track.width - 100,
        track.y + track.height / 2
    );

    ctx.stroke();

    ctx.setLineDash([]);
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
        6,
        -6,
        12,
        12
    );

    ctx.restore();
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

    drawTrack();

    drawPlayer();

    ctx.restore();
}

function updateUI() {

    document.getElementById(
        "speed"
    ).innerHTML =

    `🚕 ${
        Math.abs(
            Math.round(
                player.speed * 40
            )
        )
    } km/h`;
}

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );
}

gameLoop();

window.addEventListener(
    "resize",
    () => {

        canvas.width =
        window.innerWidth;

        canvas.height =
        window.innerHeight;
    }
);
