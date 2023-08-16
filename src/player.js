export default class Player {
  constructor({ x, y, height, width }) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;

    this.angle = 0;
  }

  update(g) {
    if (g.keyboard.find(key => key === "r")) {
      this.x = this.x + 1;
    }

    if (g.keyboard.find(key => key === "l")) {
      this.x = this.x - 1;
    }

    if (g.keyboard.find(key => key === "u")) {
      this.y = this.y - 1;
    }

    if (g.keyboard.find(key => key === "d")) {
      this.y = this.y + 1;
    }

    if (
      !g.keyboard.includes("r") && !g.keyboard.includes("l") &&
      g.keyboard.includes("u") && !g.keyboard.includes("d")
    ) {
      this.angle = 0;
    }
    if (
      g.keyboard.includes("r") && !g.keyboard.includes("l") &&
      g.keyboard.includes("u") && !g.keyboard.includes("d")
    ) {
      this.angle = 45;
    }
    if (
      g.keyboard.includes("r") && !g.keyboard.includes("l") &&
      !g.keyboard.includes("u") && !g.keyboard.includes("d")
    ) {
      this.angle = 90;
    }
    if (
      g.keyboard.includes("r") && !g.keyboard.includes("l") &&
      !g.keyboard.includes("u") && g.keyboard.includes("d")
    ) {
      this.angle = 135;
    }
    if (
      !g.keyboard.includes("r") && !g.keyboard.includes("l") &&
      !g.keyboard.includes("u") && g.keyboard.includes("d")
    ) {
      this.angle = 180;
    }
    if (
      !g.keyboard.includes("r") && g.keyboard.includes("l") &&
      !g.keyboard.includes("u") && g.keyboard.includes("d")
    ) {
      this.angle = 225;
    }
    if (
      !g.keyboard.includes("r") && g.keyboard.includes("l") &&
      !g.keyboard.includes("u") && !g.keyboard.includes("d")
    ) {
      this.angle = 270;
    }
    if (
      !g.keyboard.includes("r") && g.keyboard.includes("l") &&
      g.keyboard.includes("u") && !g.keyboard.includes("d")
    ) {
      this.angle = 315;
    }
  }

  draw(g) {
    // 開始位置
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
    g.ctx.fillStyle = 'blue';
    g.ctx.fill();
  }
}