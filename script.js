var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

//ball variables
var ballX = canvas.width/2;
var ballY = canvas.height/2;
var ballRadius = 20;
var changeX = 2;
var changeY = -2;

//paddle variables
var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPress = false;
var leftPress = false;

//brick variables
var brickRowCount = 4;
var brickColumnCount = 6;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 50;

var score = 0;

function Ball (x, y, diameter, color) {
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.color = color;
}

Ball.prototype.drawBall = function (){
  context.beginPath();
  context.arc(this.x, this.y, this.diameter, 0, Math.PI*2);
  context.fillStyle = this.color;
  context.fill();
  context.closePath();
  return this;
};

Ball.prototype.move = function(){
  if(this.x + changeX > canvas.width-ballRadius || this.x + changeX < ballRadius) {
    changeX = -changeX;
  }
  if(this.y + changeY < ballRadius) {
    changeY = -changeY;
  } else if (this.y + changeY > paddle.y-ballRadius){
    if(changeX > 0){
      if(this.x > paddle.x && this.x < paddle.x + paddleWidth/3) {
        changeY = -changeY;
        changeX = -changeX;
      } else if(this.x > paddle.x + paddleWidth/3 && this.x < paddle.x + (paddleWidth/3)*2){
        changeY = -changeY - (1)/3;
      } else if(this.x > paddle.x + (paddleWidth/3)*2 && this.x < paddle.x + paddleWidth){
        changeY = -changeY;
      }else if (this.x < paddle.x || this.x > paddle.x + paddleWidth){
      //alert("GAME OVER");
      document.location.reload();
      }
    } else if(changeX < 0){
      if(this.x > paddle.x && this.x < paddle.x + paddleWidth/3) {
        changeY = -changeY;
      } else if(this.x > paddle.x + paddleWidth/3 && this.x < paddle.x + (paddleWidth/3)*2){
        changeY = -changeY - (1)/3;
      } else if(this.x > paddle.x + (paddleWidth/3)*2 && this.x < paddle.x + paddleWidth){
        changeY = -changeY;
        changeX = -changeX;
      } else if (this.x < paddle.x || this.x > paddle.x + paddleWidth){
      //alert("GAME OVER");
       }
    }
  }
  this.y += changeY;
  this.x += changeX;
  return this;
};

Ball.prototype.collisionDetection = function() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var brick = bricks[c][r];
            if(this.x + ballRadius > brick.x && this.x - ballRadius < brick.x+brickWidth && this.y + ballRadius > brick.y && this.y - ballRadius < brick.y+brickHeight) {
                changeY = -changeY;
                brick.exists = false;
                brick.x = -1000;
                brick.y = -1000;
                score++;
                if(score === brickRowCount*brickColumnCount) {
                  alert("You'll never get that time back. play again?")
                  document.location.reload();
                }
            }
        }
    }
};

function Paddle (x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Paddle.prototype.drawPaddle = function (){
  context.fillStyle="#333";
  context.fillRect(this.x, this.y, this.width, this.height);
  return this;
};

Paddle.prototype.move = function(){
  if(rightPress && this.x < canvas.width-this.width) {
    this.x += 10;
  } else if(leftPress && this.x > 0) {
    this.x -= 10;
}
};

var bricks = [];

for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, exists: true };
    }
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
          if(bricks[c][r].exists === true){
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            context.fillStyle="blue";
            context.fillRect(brickX, brickY, brickWidth, brickHeight);
          }
        }
    }
}

function drawScore () {
  context.font = "16px Helvetica";
  context.fillStyle = "red";
  context.fillText("Score: "+score, 8, 20)
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {rightPress = true;}
    else if(e.keyCode == 37) {leftPress = true;}
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {rightPress = false;}
    else if(e.keyCode == 37) {leftPress = false;}
}


var ball = new Ball (ballX, ballY, ballRadius, "yellowgreen");
var paddle = new Paddle(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);

requestAnimationFrame (function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawScore();
  ball.drawBall().move().collisionDetection();
  paddle.drawPaddle().move();
  requestAnimationFrame(gameLoop);
});
