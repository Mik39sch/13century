import settings from "./settings";
export default class Player {
  constructor({ x, y, height, width }) {
    this.x = x;
    this.y = y;

    this.height = height;
    this.width = width;
    this.angle = "u";
    this.prevAngle = "u";
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