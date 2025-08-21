const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 12;
const BALL_RADIUS = 12;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  vy: BALL_SPEED * (Math.random() * 2 - 1)
};
let playerScore = 0;
let aiScore = 0;

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp within canvas bounds
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// AI paddle movement
function moveAI() {
  // Simple AI: try to follow the ball
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ball.y - 10) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ball.y + 10) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp within canvas bounds
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Ball movement and collision
function moveBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Top/bottom wall collision
  if (ball.y - BALL_RADIUS < 0) {
    ball.y = BALL_RADIUS;
    ball.vy = -ball.vy;
  }
  if (ball.y + BALL_RADIUS > canvas.height) {
    ball.y = canvas.height - BALL_RADIUS;
    ball.vy = -ball.vy;
  }

  // Paddle collisions
  // Player paddle
  if (
    ball.x - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
    ball.x - BALL_RADIUS > PLAYER_X &&
    ball.y > playerY &&
    ball.y < playerY + PADDLE_HEIGHT
  ) {
    ball.x = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
    ball.vx = Math.abs(ball.vx);
    // Add some spin
    ball.vy += (ball.y - (playerY + PADDLE_HEIGHT / 2)) * 0.06;
  }

  // AI paddle
  if (
    ball.x + BALL_RADIUS > AI_X &&
    ball.x + BALL_RADIUS < AI_X + PADDLE_WIDTH &&
    ball.y > aiY &&
    ball.y < aiY + PADDLE_HEIGHT
  ) {
    ball.x = AI_X - BALL_RADIUS;
    ball.vx = -Math.abs(ball.vx);
    ball.vy += (ball.y - (aiY + PADDLE_HEIGHT / 2)) * 0.06;
  }

  // Scoring
  if (ball.x - BALL_RADIUS < 0) {
    aiScore++;
    resetBall();
  }
  if (ball.x + BALL_RADIUS > canvas.width) {
    playerScore++;
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.vx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ball.vy = BALL_SPEED * (Math.random() * 2 - 1);
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw middle line
  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.setLineDash([12]);
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  // Draw scores
  ctx.font = '32px Arial';
  ctx.fillText(playerScore, canvas.width / 2 - 60, 40);
  ctx.fillText(aiScore, canvas.width / 2 + 40, 40);
}

function gameLoop() {
  moveAI();
  moveBall();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();