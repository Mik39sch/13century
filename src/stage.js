import { randomInt } from "./util";
import settings from "./settings";

export default class Stage {
  constructor() {
    this.divideX = randomInt({ max: 3, min: 2 });
    this.divideY = randomInt({ max: 3, min: 2 });

    this.realms = [];

    this.divide();
    this.makeRoom();
  }

  divide() {
    let i, j, realm;
    let cnt;
    const aX = new Array(this.divideX);
    const aY = new Array(this.divideY);
    const fieldY = settings.canvasHeight;
    const fieldX = settings.canvasWidth;
    const blockY = Math.floor(fieldY / settings.pixel);
    const blockX = Math.floor(fieldX / settings.pixel);

    for (i = 0; i < this.divideX; i += 1) {
      aX[i] = 0;
    }
    for (i = 0; i < this.divideY; i += 1) {
      aY[i] = 0;
    }

    cnt = this.divideX;
    for (i = cnt; i < blockX; i += 1) {
      aX[Math.floor(Math.random() * this.divideX)] += 1;
    }

    cnt = this.divideY;
    for (i = cnt; i < blockY; i += 1) {
      aY[Math.floor(Math.random() * this.divideY)] += 1;
    }

    let pX = 1;
    let pY = 2;
    for (i = 0; i < this.divideX; i += 1) {
      for (j = 0; j < this.divideY; j += 1) {
        realm = {
          left: pX, right: pX + aX[i],
          top: pY, bottom: pY + aY[j],
          sizeX: aX[i], sizeY: aY[j], id: this.realms.length
        }
        this.realms.push(Object.assign({}, realm));
        pY += aY[j];
      }
      pY = 2;
      pX += aX[i];
    }
  }

  makeRoom() {
    var i,
      loopCnt,
      posX,
      posY,
      marginX,
      marginY,
      width,
      height,
      maxWidth,
      maxHeight,
      repeatFlag,
      ratio;

    loopCnt = 0;
    posX = 0;
    posY = 0;
    width = 0;
    height = 0;
    ratio = 0;

    const minHeight = 5;
    const minWidth = 5;
    const minArea = 25;
    const minRatio = 0.4;

    const setRoom = (r, left, top, width, height) => {
      r.roomLeft = left;
      r.roomTop = top;

      r.roomSizeX = width;
      r.roomSizeY = height;
      r.roomRight = left + width - 1;
      r.roomBottom = top + height - 1;
      return r;
    }

    for (i = 0; i < this.realms.length; i++) {
      const r = this.realms[i];
      if (r.sizeX * r.sizeY < minArea) {
        this.realms[i] = setRoom(r, r.left + 2, r.top + 2, r.sizeX - 4, r.sizeY - 4);
        continue;
      }
      loopCnt = 0;
      repeatFlag = true;
      while (repeatFlag) {
        loopCnt += 1;
        if (loopCnt > 100) {
          width = r.sizeX - 4;
          height = r.sizeY - 4;
          break;
        }
        maxWidth = r.sizeX - 4;
        maxHeight = r.sizeY - 4;
        width = randomInt({ max: maxWidth, min: minWidth });
        height = randomInt({ max: maxHeight, min: minHeight });
        ratio = width * height / (r.sizeX * r.sizeY);
        repeatFlag = true;
        if (width * height < minArea) { repeatFlag = false; }
        if (ratio < minRatio) { repeatFlag = false; }
      }

      marginX = r.sizeX - width - 4;
      if (marginX > 0) {
        posX = randomInt({ max: marginX, min: 2 });
      } else {
        posX = 2;
      }
      marginY = r.sizeY - height - 4;
      if (marginY > 0) {
        posY = randomInt({ max: marginY, min: 2 });
      } else {
        posY = 2;
      }
      this.realms[i] = setRoom(r, r.left + posX, r.top + posY, width, height);
    }
  }


  update(g) {
    console.log("it does not need");
  }
  draw(g) {
    this.drawScaleLine(g);
    this.drawDivide(g);
    this.drawRoom(g);
  }

  drawScaleLine(g) {
    g.ctx.strokeStyle = 'rgba(250, 250, 250, 0.25)';
    g.ctx.lineWidth = 1;

    const fieldY = settings.canvasHeight;
    const fieldX = settings.canvasWidth;
    const blockY = Math.floor(fieldY / settings.pixel);
    const blockX = Math.floor(fieldX / settings.pixel);

    let i;

    for (i = 0; i <= blockY; i += 1) {
      g.ctx.beginPath();
      g.ctx.moveTo(0, settings.pixel * i);
      g.ctx.lineTo(fieldX, settings.pixel * i);
      g.ctx.stroke();
      g.ctx.closePath();
    }

    for (i = 0; i <= blockX; i += 1) {
      g.ctx.beginPath();
      g.ctx.moveTo(settings.pixel * i, 0);
      g.ctx.lineTo(settings.pixel * i, fieldY);
      g.ctx.stroke();
      g.ctx.closePath();

    }
    g.ctx.strokeStyle = 'rgba(250, 250, 250, 1)';
    g.ctx.strokeRect(fieldX, fieldY, blockX * settings.pixel, blockY * settings.pixel);
  }

  drawDivide(g) {
    for (const realm of this.realms) {
      g.ctx.lineWidth = 2;
      g.ctx.strokeStyle = 'rgba(250, 250, 250, 0.1)';
      g.ctx.fillStyle = 'rgba(250, 250, 250, 0.05)';
      g.ctx.strokeRect(
        realm.left * settings.pixel,
        realm.top * settings.pixel,
        realm.sizeX * settings.pixel,
        realm.sizeY * settings.pixel
      );
      g.ctx.fillRect(
        realm.left * settings.pixel,
        realm.top * settings.pixel,
        realm.sizeX * settings.pixel,
        realm.sizeY * settings.pixel
      );
    }
  }

  drawRoom(g) {
    for (const r of this.realms) {

      g.ctx.lineWidth = 2;
      g.ctx.strokeStyle = 'rgba(0, 0, 150, 1)';
      g.ctx.fillStyle = 'rgba(0, 0, 150, 0.5)';
      g.ctx.strokeRect(
        r.roomLeft * settings.pixel,
        r.roomTop * settings.pixel,
        r.roomSizeX * settings.pixel,
        r.roomSizeY * settings.pixel
      );
      g.ctx.fillRect(
        r.roomLeft * settings.pixel,
        r.roomTop * settings.pixel,
        r.roomSizeX * settings.pixel,
        r.roomSizeY * settings.pixel
      );
    }
  }
}
