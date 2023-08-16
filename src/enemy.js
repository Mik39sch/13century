import { randomInt } from "./util";

export default class Enemy {
  constructor({ x, y, height, width }) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;

    this.angle = 0;

    this.step = 0;
    this.prevD = []
  }

  update(g) {
    const darr = [
      ["u"], ["u", "r"], ["r"], ["r", "d"], ["d"], ["d", "l"], ["l"], ["l", "u"], []
    ]
    let direction = darr[randomInt({ max: 8, min: 0 })]
    if (this.step > 0) {
      this.step -= 1;
      direction = this.prevD;
    } else {
      this.step = randomInt({ max: 100, min: 10 });
      this.prevD = direction;
    }


    if (direction.find(key => key === "r")) {
      this.x = this.x + 1;
    }

    if (direction.find(key => key === "l")) {
      this.x = this.x - 1;
    }

    if (direction.find(key => key === "u")) {
      this.y = this.y - 1;
    }

    if (direction.find(key => key === "d")) {
      this.y = this.y + 1;
    }

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
    let size = this.width;

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
    g.ctx.fillStyle = 'orange';
    g.ctx.fill();
  }
}