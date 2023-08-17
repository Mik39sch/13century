import settings from "./settings";
export default class Player {
  constructor({ x, y, height, width }) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;
    this.angle = 0;
    this.speed = 3;
    this.color = "blue";
  }

  update(g) {
    this.updateX(g.keyboard);
    this.updateY(g.keyboard);
    this.updateAngle(g.keyboard);
  }

  updateX(direction) {
    const maxWidth = settings.canvasWidth;
    if (direction.find(key => key === "r")) {
      this.x = this.x + this.speed;
    } else if (direction.find(key => key === "l")) {
      this.x = this.x - this.speed;
    }

    if (this.x >= maxWidth - this.width / 2) {
      this.x = maxWidth - this.width / 2;
    }
    if (this.x <= this.width / 2) {
      this.x = this.width / 2;
    }
  }

  updateY(direction) {
    const maxHeight = settings.canvasHeight;
    if (direction.find(key => key === "u")) {
      this.y = this.y - this.speed;
    }
    if (direction.find(key => key === "d")) {
      this.y = this.y + this.speed;
    }

    if (this.y >= maxHeight - this.height / 2) {
      this.y = maxHeight - this.height / 2;
    }
    if (this.y <= this.height / 2) {
      this.y = this.height / 2;
    }
  }
  updateAngle(direction) {
    if (
      !direction.includes("r") && !direction.includes("l") &&
      direction.includes("u") && !direction.includes("d")
    ) {
      this.angle = 0;
    }
    if (
      direction.includes("r") && !direction.includes("l") &&
      direction.includes("u") && !direction.includes("d")
    ) {
      this.angle = 45;
    }
    if (
      direction.includes("r") && !direction.includes("l") &&
      !direction.includes("u") && !direction.includes("d")
    ) {
      this.angle = 90;
    }
    if (
      direction.includes("r") && !direction.includes("l") &&
      !direction.includes("u") && direction.includes("d")
    ) {
      this.angle = 135;
    }
    if (
      !direction.includes("r") && !direction.includes("l") &&
      !direction.includes("u") && direction.includes("d")
    ) {
      this.angle = 180;
    }
    if (
      !direction.includes("r") && direction.includes("l") &&
      !direction.includes("u") && direction.includes("d")
    ) {
      this.angle = 225;
    }
    if (
      !direction.includes("r") && direction.includes("l") &&
      !direction.includes("u") && !direction.includes("d")
    ) {
      this.angle = 270;
    }
    if (
      !direction.includes("r") && direction.includes("l") &&
      direction.includes("u") && !direction.includes("d")
    ) {
      this.angle = 315;
    }
  }

  draw(g) {
    let startPoint = this.x;
    let endPoint = this.y;
    let size = this.width / 2;

    let s1 = startPoint - size * Math.cos((90 + this.angle) / 180 * Math.PI);
    let e1 = endPoint - size * Math.sin((90 + this.angle) / 180 * Math.PI);
    let s2 = startPoint - size * Math.cos((210 + this.angle) / 180 * Math.PI);
    let e2 = endPoint - size * Math.sin((210 + this.angle) / 180 * Math.PI);
    let s3 = startPoint - size * Math.cos((330 + this.angle) / 180 * Math.PI);
    let e3 = endPoint - size * Math.sin((330 + this.angle) / 180 * Math.PI);

    g.ctx.beginPath();
    g.ctx.moveTo(s1, e1);
    g.ctx.lineTo(s2, e2);
    g.ctx.lineTo(s3, e3);
    g.ctx.closePath();
    g.ctx.fillStyle = this.color;
    g.ctx.fill();
  }
}