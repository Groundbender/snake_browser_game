const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highscoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;

let foodX, foodY;
let snakeX = 5,
  snakeY = 5;

let velocityX = 0,
  velocityY = 0; // переменная указывающая на направления змейки, исходя из нее будем менять координаты

let snakeBody = [];
let setIntervalId;
let score = 0;

// получаем максимальный результат из localStorage

let highScore = localStorage.getItem("high-score") || 0;
highscoreElement.innerHTML = `High Score: ${highScore}`;

// располагаем еду рандомно в ячейках от 1 до 30

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Игра окончена! Нажмите 'ОК', чтобы сыграть еще раз... ");
  location.reload();
};

// меняем направленине в зависимости от нажатия на клавиши

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// поменять направление при клике на клавиши

controls.forEach((button) =>
  button.addEventListener("click", (e) =>
    changeDirection({
      key: button.dataset.key, // передаем в key data аттрибуты наших кнопок снизу
    })
  )
);

const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`; // добавляем еду в поле с рандомными координатами

  // когда змейка съест еду

  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodY, foodX]); // добавляем еду в массив snakeBody
    score++;
    highScore = score >= highScore ? score : highScore; // если наш счет больше чем рекордный меняем рекордный счет
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score ${score}`;
    highscoreElement.innerText = `High Score: ${highScore}`;
  }

  // обновляем положение змейки

  snakeX += velocityX;
  snakeY += velocityY;

  // смещение значений элементов в теле змеи вперед на единицу

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  // проверяем, что тело змеи за стеной

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    return (gameOver = true);
  }

  // добавляем div для каждой части тела змеи

  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

    // проверка что голова змеи коснулась тела змеи

    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
