import settings from "./settings";
export default class Player {
  constructor({ x, y, height, width }) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;
    this.angle = 0;
    this.color = "blue";

    this.characterDesign = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    this.color = { 0: "white", 1: "black" }

  }

  update(g) {
    this.updateX(g.keyboard, g.stage.maxX, g.stage.minX, g);
    this.updateY(g.keyboard, g.stage.maxY, g.stage.minY, g);
    this.updateAngle(g.keyboard);

    g.stage.isInnerRoom(this.x, this.y, true);
    g.stage.isInnerPath(this.x, this.y, g.keyboard, true);
  }

  updateX(direction, max, min, g) {
    const prevX = this.x;
    if (direction.find(key => key === "r")) {
      this.x = this.x + 1;
    } else if (direction.find(key => key === "l")) {
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
    if (direction.find(key => key === "u")) {
      this.y = this.y - 1;
    }
    if (direction.find(key => key === "d")) {
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
    this.drawCharacter(g.ctx)
  }

  drawCharacter(ctx) {
    let design = this.characterDesign.slice();
    const rotate = a => a[0].map((_, c) => a.map(r => r[c])).reverse();
    if (this.angle > 45 && this.angle <= 135) {
      design = rotate(rotate(rotate(design)));
    } else if (this.angle > 135 && this.angle <= 225) {
      design = rotate(rotate(design));
    } else if (this.angle > 225 && this.angle <= 270) {
      design = rotate(design);
    }

    const startX = this.x * settings.pixel;
    const startY = this.y * settings.pixel;

    let y = 0;
    let x = 0;
    for (const row of design) {
      x = 0;
      for (const colorIdx of row) {
        ctx.fillStyle = this.color[colorIdx];
        ctx.fillRect(
          startX + x,
          startY + y,
          1,
          1
        );
        x++;
      }
      y++;
    }
  }
}