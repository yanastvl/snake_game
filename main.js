const canvas = document.getElementById('gameField');
const context = canvas.getContext('2d');
const startPauseButton = document.getElementById("startPauseButton");
const score = document.getElementById("score");

// условием победы является наращивание змейки практически до размеров игрового поля
const victorySnakeLength = canvas.width * canvas.height - 3;

const grid = 16;
let frameCounter = 0;
let scoreValue = 0;
let requestId;


// объявляем класс змейки с начальной длиной и расположением на поле
class Snake {
    constructor() {
      this.x = 160;
      this.y = 160;
      this.dx = grid;
      this.dy = 0;
      this.cells = [];
      this.length = 5;
    }

    // метод, перемещающий змейку по полю
    move() {
        snake.x += snake.dx;
        snake.y += snake.dy;
    }
}


// объявляем класс яблока с заданным расположением на поле
class Apple {
    constructor() {
        this.x = 320;
        this.y = 320;
    }
}


// создаем экземпляры змейки и яблока
let snake = new Snake();
let apple = new Apple();

function gameLoop() {
  requestId = undefined;

  // отображает текущий счет игры
  score.innerHTML = scoreValue;
  
  // коэффициент скорости игры (равен результату деления 60 fps на 12)
  let maxFrame = 5;

  // управляем условием победы
  if (snake.length == victorySnakeLength) {
      youWin();
      return;
  }

  startGame();

  // сравниваем количество максимальных кадров с увеличивающимся frameCounter
  if (++frameCounter < maxFrame) {
    return;
  }
  frameCounter = 0;

  snake.move();

  // очищаем игровое поле после каждого движения змейки
  context.clearRect(0,0,canvas.width,canvas.height);

  // условие поражения в случае касания границ игрового поля
  if (snake.x < 0 || snake.y < 0 || snake.x >= canvas.width || snake.y >= canvas.height) {
    youLose("Змейка коснулась границы игрового поля");
  }

  // добавляем новые ячейки нашей змейки на поле
  snake.cells.unshift({x: snake.x, y: snake.y});

  // удаляем ячейки когда их количество становится больше заданной длины змейки
  if (snake.cells.length > snake.length) {
    snake.cells.pop();
  }

  // рисуем яблоко
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // рисуем по одной ячейке нашей змейки
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  

    // проверяем, что змея достигла яблока, удлиняем её - и перемещаем яблоко
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.length++;
      scoreValue++;
      resetApple();
    }

    // проверяем, не переместилась ли змейка на уже занятые ячейки
    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          youLose("Змейка укусила себя");
      }
    }
  });
}

// обработчик, управляющий движением змейки по полю
document.addEventListener('keydown', function(e) {
  if (e.key === "ArrowLeft" && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  else if (e.key === "ArrowUp" && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  else if (e.key === "ArrowRight" && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  else if (e.key === "ArrowDown" && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// начинаем игру запуском анимации
function startGame() {
  if (!requestId) {
     requestId = window.requestAnimationFrame(gameLoop);
     startPauseButton.innerHTML = "Пауза";
  }
}

// старт игры или пауза через остановку анимации
function startPauseGame() {
  if (requestId) {
     window.cancelAnimationFrame(requestId);
     requestId = undefined;
     startPauseButton.innerHTML = "Возобновить";
  } else {
    startGame();
  }
}

// возвращает рандомное число из определенного диапазона
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// обновляем положение яблока
function resetApple() {
  let x = getRandomInt(0, 20) * grid;
  let y = getRandomInt(0, 20) * grid;

  // проверяем, что яблоко не было создано в одной из ячеек, занятой змейкой
  for (let i = 0; i < snake.cells.length; i++) {
    if (x === snake.cells[i].x && y === snake.cells[i].y) {

      // если яблоко создано в ячейке, принадлежащей змейке, вычитаем из score
      // и пробуем создать новое положение яблока
      scoreValue--;
      resetApple();
      break;
    }
  }
  apple.x = x;
  apple.y = y;
}

// перезапуск игры
function resetGame() {
  scoreValue = 0;
  let newSnake = new Snake();
  snake = newSnake;
  resetApple();
  startGame();
}

// сообщение о победе
function youWin() {
  alert("Победа!");
}

// сообщение о поражении и перезапуск игры
function youLose(reason) {
  alert(`Вы проиграли! ${reason}`);
  resetGame();
}