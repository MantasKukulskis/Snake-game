const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let setIntervalId;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let gameOver = false;
let score = 0;

const bgMusic = document.getElementById("bgMusic");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");
bgMusic.volume = 0.3;
eatSound.volume = 0.6;
gameOverSound.volume = 0.5;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Record: ${highScore}`;

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  bgMusic.pause();

  gameOverSound.currentTime = 0;
  gameOverSound.play();

  setTimeout(() => {
    alert("Game over!");
    location.reload();
  }, 500); 
};

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }

  if (bgMusic.paused) {
    bgMusic.play().catch(err => console.warn("Music not playing:", err));
  }
};

const initGame = () => {
  if (gameOver) return handleGameOver();

  let html = `<div class="food" style="grid-area: ${foodY}/${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++;

    eatSound.currentTime = 0;
    eatSound.play();

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Taškai: ${score}`;
    highScoreElement.innerText = `Rekordas: ${highScore}`;
  }

  snakeX += velocityX;
  snakeY += velocityY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    const className = i === 0 ? "head" : "body";
    html += `<div class='${className}' style='grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}'></div>`;

    if (
      i !== 0 &&
      snakeBody[0][0] === snakeBody[i][0] &&
      snakeBody[0][1] === snakeBody[i][1]
    ) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);