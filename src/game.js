//NEW BRANCH
class GameBoard {
  constructor(width, height, speed) {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,width,height);
    this.snake = null;
    this.food = null;
    this.interval = 0;
    this.score = 0;
    this.foodWeight = 1;
    this.gameSpeed = speed;
    this.eatSound = null;
    this.crashSound = null;
    this.createSound();
    this.objectThickness = 10;
  }

  startGame() {
    this.initGameObjects();
    this.proceedGame = this.proceedGame.bind(this);
    this.interval = setInterval(this.proceedGame, this.gameSpeed);
  }

  proceedGame() {
    this.snake.moveSnake();   
    if (this.snake.isCollision()) {
      this.crashSound.play();
      this.stopGame();
      return;
    }
    if (this.snake.foundFood(this.food)) {
      this.snake.eat(this.food);
      this.score += this.food.weight;
      this.eatSound.play();
      document.getElementById("score").innerHTML = "Score: " + this.score;
      let isFood = false;
      while (!isFood) {
        isFood = this.createFood();
      } 
      return;
    } 
  }

  stopGame() {
    clearInterval(this.interval);
  }

  initGameObjects() {
    const boardSide = Math.floor(Math.random()*4 + 1);  //1 - top, 2 - right, 3 - bottom, 4 - left   
    let foodx = 0;
    let foody = 0;
    switch (boardSide) {
      case 1:
        this.snake = new SnakeShape(this.canvas.width/2, 0, 
          0, 1, this.objectThickness, this.ctx, this.canvas.width, this.canvas.height);
        foodx = this.canvas.width*0.75; 
        foody = this.canvas.height*0.75;         
        break;
      case 2:
        this.snake = new SnakeShape(this.canvas.width, (this.canvas.height - this.objectThickness)/2, 
          -1, 0, this.objectThickness, this.ctx, this.canvas.width, this.canvas.height);
        foodx = this.canvas.width*0.25;
        foody = this.canvas.height*0.75;
        //this.food = new Food(this.canvas.width*0.25, this.canvas.height*0.75, 10, 1, this.ctx);  
        break;
      case 3:
        this.snake = new SnakeShape(this.canvas.width/2, this.canvas.height, 
          0, -1, this.objectThickness, this.ctx, this.canvas.width, this.canvas.height);
        foodx = this.canvas.width*0.25;
        foody = this.canvas.height*0.25;
        //this.food = new Food(this.canvas.width*0.25, this.canvas.height*0.25, 10, 1, this.ctx);  
        break;         
      case 4:
          this.snake = new SnakeShape(0, (this.canvas.height - this.objectThickness)/2, 
            1, 0, this.objectThickness, this.ctx, this.canvas.width, this.canvas.height);
          foodx = this.canvas.width*0.75;
          foody = this.canvas.height*0.25;
          //this.food = new Food(this.canvas.width*0.75, this.canvas.height*0.25, 10, 1, this.ctx);  
          break;         
      default:  
    }
    this.food = new Food(foodx - foodx % this.objectThickness, foody - foody % this.objectThickness, 
                         this.objectThickness, this.foodWeight, this.ctx);  
  }

  createFood() {
    let foodx = Math.floor(Math.random()*this.canvas.width);
    let foody = Math.floor(Math.random()*this.canvas.height);
    let gridx = foodx - foodx % this.objectThickness;
    let gridy = foody - foody % this.objectThickness;    
    let seg = null;
    for (seg in this.snake.body) 
      if (seg.x === gridx && seg.y === gridy) return false;
    this.food = new Food(gridx, gridy, this.objectThickness, this.foodWeight, this.ctx);
    return true;
  }

  createSound() {
    this.eatSound = document.createElement("audio");
    this.eatSound.src = "src/eat-sound.mp3";
    this.eatSound.setAttribute("preload", "auto");
    this.eatSound.setAttribute("controls", "none");
    this.eatSound.style.display = "none";
    document.body.appendChild(this.eatSound);

    this.crashSound = document.createElement("audio");
    this.crashSound.src = "src/crash-sound.mp3";
    this.crashSound.setAttribute("preload", "auto");
    this.crashSound.setAttribute("controls", "none");
    this.crashSound.style.display = "none";
    document.body.appendChild(this.crashSound);
  }

}

class Food {
  constructor (x, y, width, weight, ctx) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.weight = weight;
    this.ctx = ctx;
    this.drawFood();
  }
  drawFood() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, this.y, this.width, this.width);
  }


}

class ElementPosition {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
}

class MovingCurve {
  constructor (x, y, xdir, ydir, elementSize, ctx) {
    this.x = x; //do we need this?
    this.y = y;  //do we need this?
    this.ctx = ctx;
    this.width = elementSize;
    this.xdir = xdir; 
    this.ydir = ydir;
    this.head = new ElementPosition (x, y);
    this.body =  [this.head];

    document.onkeydown = e => {
      switch (e.keyCode) {
        case 38: //turn up
          if (this.ydir === 0) {this.ydir = -1; this.xdir = 0};
          break;
        case 40: //turn down
          if (this.ydir === 0) {this.ydir = 1; this.xdir = 0};
          break;
        case 37: //turn left
          if (this.xdir === 0) {this.xdir = -1; this.ydir = 0};
          break;
        case 39: //turn right
          if (this.xdir === 0) {this.xdir = 1; this.ydir = 0};
          break;
        default:
      }
    }
  }

  moveCurve() {
    this.head = new ElementPosition(this.head.x + this.xdir*this.width, 
                                    this.head.y + this.ydir*this.width);
    this.body.unshift(this.head);
    return this.body.pop();
  }
}

class SnakeShape extends MovingCurve {
  constructor (x, y, xdir, ydir, elementSize, ctx, boardWidth, boardHeight) {
    super (x, y, xdir, ydir, elementSize, ctx);
    this.xmax = boardWidth;
    this.ymax = boardHeight;
    this.lastTail = null;
  }

  moveSnake() {
    this.lastTail = this.moveCurve();
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(this.head.x, this.head.y, this.width, this.width);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.lastTail.x, this.lastTail.y, this.width, this.width); 
  }

  foundFood(food) {
    if (this.head.x === food.x && this.head.y === food.y) {
      //console.log ("Mahlzeit!");
      return true;
    }
    return false;
  }

  eat(food) {
    //console.log ("Danke!");
    this.body.push(this.lastTail);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(this.lastTail.x, this.lastTail.y, this.width, this.width); 


  }

  isCollision() {
    
    if (this.head.x > this.xmax || this.head.x < 0) return true;
    if (this.head.y > this.ymax || this.head.y < 0) return true;
    let len = this.body.length;
    for (let i = 0; i < len; i++) 
      if (this.body[i].x === this.head.x && this.body[i].y === this.head.y && this.body[i] !== this.head)
         return true;
    return false;

  }
}

let game = new GameBoard(280, 170, 300);   //(480, 270);
game.startGame();

