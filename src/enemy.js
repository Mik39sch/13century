import { randomInt } from "./util";
import Player from "./player";

export default class Enemy extends Player {
  constructor({ x, y, height, width }) {
    super({ x, y, height, width });
    this.color = "orange";
    this.speed = 1;
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
    super.updateX(direction);
    super.updateY(direction);
    super.updateAngle(direction);
  }
}