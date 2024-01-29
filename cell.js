class Cell extends Rect {
  constructor({ pos, size, value = 0, fillColor = "white" }) {
    super({ pos, size, fillColor });

    this.value = value;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    ctx.closePath();

    ctx.save();
    ctx.fillStyle = this.fillColor;
    ctx.fill();
    ctx.restore();
  }
}
