

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
};

Ball.prototype.move = function(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  ball.drawBall();
  if(this.y + changeY > canvas.height-ballRadius || this.y + changeY < ballRadius) {
    changeY = -changeY;
  }
  if(this.x + changeX > canvas.width-ballRadius || this.x + changeX < ballRadius) {
    changeX = -changeX;
  }
  this.y += changeY;
  this.x += changeX;
};

module.exports = Ball;
