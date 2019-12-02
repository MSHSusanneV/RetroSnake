class GameBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(0,0,width,height);
    this.snake = new SnakeShape(width-120, height/2, -1, 0, 10, this.ctx, width, height);
    this.interval = 0;

  }
  startGame() {
    this.proceedGame = this.proceedGame.bind(this);
    this.interval = setInterval(this.proceedGame, 400);
  }

  proceedGame() {
    this.snake.updateShape();   
    if (this.snake.isCollision()) {
      console.log ("Collision!");
      this.stopGame();
    }
    //check food here
  }
  stopGame() {
    clearInterval(this.interval);
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
    this.body =  [this.head,
      new ElementPosition (this.head.x + this.width, this.head.y),
      new ElementPosition(this.head.x + this.width*2, this.head.y), 
      new ElementPosition(this.head.x + this.width*3, this.head.y),
      new ElementPosition(this.head.x + this.width*4, this.head.y),
      new ElementPosition(this.head.x + this.width*5, this.head.y),
      new ElementPosition(this.head.x + this.width*6, this.head.y),
      new ElementPosition(this.head.x + this.width*7, this.head.y),
      new ElementPosition(this.head.x + this.width*8, this.head.y),
      new ElementPosition(this.head.x + this.width*9, this.head.y),
      new ElementPosition(this.head.x + this.width*10, this.head.y),                  
      new ElementPosition(this.head.x + this.width*11, this.head.y)];   
    

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
  }

  updateShape() {
    const tail = this.moveCurve();
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(this.head.x, this.head.y, this.width, this.width);
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(tail.x, tail.y, this.width, this.width); 
  }

  eat() {
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

let game = new GameBoard(480, 270);
game.startGame();

