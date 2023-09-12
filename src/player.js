import settings from "./settings";
export default class Player {
  constructor({ x, y, height, width }) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;
    this.angle = "u";
    this.prevAngle = "u";
    this.color = "yellow";
  }

  update(g) {
    if (g.keyboard.includes("r") || g.keyboard.includes("l")) {
      this.updateAngle(g.keyboard);
    }

    if (g.keyboard.includes("u") || g.keyboard.includes("d")) {
      this.updateX(g.keyboard, g.stage.maxX, g.stage.minX, g);
      this.updateY(g.keyboard, g.stage.maxY, g.stage.minY, g);
    }

    g.stage.isInnerRoom(this.x, this.y, true);
    g.stage.isInnerPath(this.x, this.y, this.angle, true);
  }

  updateX(direction, max, min, g) {
    const prevX = this.x;
    if (
      this.angle === "r" && direction.includes("u") ||
      this.angle === "l" && direction.includes("d")
    ) {
      this.x = this.x + 1;
    } else if (
      this.angle === "r" && direction.includes("d") ||
      this.angle === "l" && direction.includes("u")
    ) {
      this.x = this.x - 1;
    }

    if (this.x >= max) {
      this.x = max;
    }
    if (this.x <= min) {
      this.x = min;
    }

    if (g.stage.hitWall(this.x, this.y)) {
      this.x = prevX;
    }
  }

  updateY(direction, max, min, g) {
    const prevY = this.y;

    if (
      this.angle === "u" && direction.includes("u") ||
      this.angle === "d" && direction.includes("d")
    ) {
      this.y = this.y - 1;
    } else if (
      this.angle === "u" && direction.includes("d") ||
      this.angle === "d" && direction.includes("u")
    ) {
      this.y = this.y + 1;
    }

    if (this.y >= max) {
      this.y = max;
    }
    if (this.y <= min) {
      this.y = min;
    }

    if (g.stage.hitWall(this.x, this.y)) {
      this.y = prevY;
    }
  }
  updateAngle(direction) {
    this.prevAngle = this.angle;
    if (direction.includes("r")) {
      if (this.angle === "u") {
        this.angle = "r";
      } else if (this.angle === "r") {
        this.angle = "d";
      } else if (this.angle === "d") {
        this.angle = "l";
      } else if (this.angle === "l") {
        this.angle = "u";
      }
    }
    if (direction.includes("l")) {
      if (this.angle === "u") {
        this.angle = "l";
      } else if (this.angle === "r") {
        this.angle = "u";
      } else if (this.angle === "d") {
        this.angle = "r";
      } else if (this.angle === "l") {
        this.angle = "d";
      }
    }
  }

  draw(g) {
    this.drawCharacter(g.ctx)
  }

  drawCharacter(ctx) {
    const startPoint = this.x * settings.pixel + this.width / 2;
    const endPoint = this.y * settings.pixel + this.width / 2;
    const size = this.width / 2;

    let angle = 0;
    if (this.angle === "r") {
      angle = 90;
    }
    if (this.angle === "d") {
      angle = 180;
    }
    if (this.angle === "l") {
      angle = 270;
    }

    const s1 = startPoint - size * Math.cos((90 + angle) / 180 * Math.PI);
    const e1 = endPoint - size * Math.sin((90 + angle) / 180 * Math.PI);
    const s2 = startPoint - size * Math.cos((210 + angle) / 180 * Math.PI);
    const e2 = endPoint - size * Math.sin((210 + angle) / 180 * Math.PI);
    const s3 = startPoint - size * Math.cos((330 + angle) / 180 * Math.PI);
    const e3 = endPoint - size * Math.sin((330 + angle) / 180 * Math.PI);

    ctx.beginPath();
    ctx.moveTo(s1, e1);
    ctx.lineTo(s2, e2);
    ctx.lineTo(s3, e3);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}