const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
 
// Configuración del canvas
canvas.width = 800;
canvas.height = 400;
 
const tileSize = 40; // Tamaño de los bloques
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;
 
// Mapa de bloques (0 = vacío, 1 = tierra, 2 = césped)
let world = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => (y > rows / 2 ? (y === rows / 2 + 1 ? 2 : 1) : 0))
);
 
// Jugador
const player = {
    x: 5,
    y: rows / 2 - 1,
    width: tileSize,
    height: tileSize,
    speed: 0.1,
    dx: 0,
    dy: 0,
    jumping: false
};
 
// Dibujar el mundo
function drawWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (world[y][x] === 1) {
                ctx.fillStyle = "#8B4513"; // Tierra
            } else if (world[y][x] === 2) {
                ctx.fillStyle = "#228B22"; // Césped
            } else if (world[y][x] === 3) {
                ctx.fillStyle = "#808080"; // Piedra (color gris)
            } else {
                continue; // Espacio vacío, no dibujar nada
            }
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}
 
 
// Dibujar al jugador
function drawPlayer() {
    ctx.fillStyle = "black";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, player.width, player.height);
}
 
// Movimiento del jugador
canvas.addEventListener("mousedown", (e) => {
    const x = Math.floor(e.offsetX / tileSize);
    const y = Math.floor(e.offsetY / tileSize);
 
    if (e.button === 0) world[y][x] = 1; // Click izquierdo = Tierra
    if (e.button === 1) world[y][x] = 3; // Click central = Piedra
    if (e.button === 2) world[y][x] = 0; // Click derecho = Vacío

});
 
 
document.addEventListener("keyup", (e) => {
    if (e.key === "a" || e.key === "d") player.dx = 0;
});
 
// Gravedad y colisiones
function update() {
    player.dy += 0.01; // Gravedad
    player.x += player.dx;
    player.y += player.dy;
 
    // Evitar que caiga por el suelo
    if (player.y > rows / 2 - 1) {
        player.y = rows / 2 - 1;
        player.dy = 0;
        player.jumping = false;
    }
}
 
// Colocar o romper bloques con el ratón
canvas.addEventListener("mousedown", (e) => {
    const x = Math.floor(e.offsetX / tileSize);
    const y = Math.floor(e.offsetY / tileSize);
 
    if (e.button === 0) world[y][x] = 1; // Click izquierdo (colocar bloque)
    if (e.button === 2) world[y][x] = 0; // Click derecho (romper bloque)
});
 
// Evitar menú contextual del botón derecho
canvas.addEventListener("contextmenu", (e) => e.preventDefault());
 
// Bucle del juego
function gameLoop() {
    update();
    drawWorld();
    drawPlayer();
    requestAnimationFrame(gameLoop);
}
 
gameLoop();
 