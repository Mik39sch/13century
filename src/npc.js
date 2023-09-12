import { randomInt } from "./util";
import Player from "./player";

export default class NPC extends Player {
  constructor({ x, y, height, width }) {
    super({ x, y, height, width });
    this.color = "red";
    this.speed = 1;
    this.step = 0;
    this.prevD = [];
  }

  update(g) {
    let darr = [
      ["u"], ["u", "r"], ["r"], ["r", "d"], ["d"], ["d", "l"], ["l"], ["l", "u"], []
    ];
    let direction = darr[randomInt({ max: darr.length - 1, min: 0 })]
    if (this.step > 0) {
      this.step -= 1;
      direction = this.prevD;
    } else {
      this.step = randomInt({ max: 100, min: 10 });
      this.prevD = direction;
    }
    this.updateX(direction, g.stage.maxX, g.stage.minX, g);
    this.updateY(direction, g.stage.maxY, g.stage.minY, g);
    this.updateAngle(direction);
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
    const r = g.stage.isInnerRoom(this.x, this.y);
    const p = g.stage.isInnerPath(this.x, this.y, []);
    if (r && r.visible || p && p.visible) {
      super.draw(g);
    }
  }
}