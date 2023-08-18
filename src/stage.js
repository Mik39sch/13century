import { randomInt } from "./util";
import settings from "./settings";

export default class Stage {
  constructor() {
    this.divideX = randomInt({ max: 4, min: 2 });
    this.divideY = randomInt({ max: 4, min: 2 });

    this.stageColor = 'rgba(0, 0, 150, 1)';

    this.realms = [];
    this.connects = [];

    this.divide();
    this.makeRoom();
    this.makePath();

    this.maxX = Math.max(...this.realms.map(r => r.right)) - 1;
    this.minX = Math.min(...this.realms.map(r => r.left));
    this.maxY = Math.max(...this.realms.map(r => r.bottom)) - 1;
    this.minY = Math.min(...this.realms.map(r => r.top));

    console.log(this.connects)
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
          sizeX: aX[i], sizeY: aY[j],
          id: this.realms.length, connectID: []
        }
        this.realms.push(Object.assign({}, realm));
        pY += aY[j];
      }
      pY = 2;
      pX += aX[i];
    }
  }

  makeRoom() {
    let i,
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

  makePath() {
    let i, ar, r;
    for (i = 0; i < this.realms.length; i += 1) {
      ar = this.getAdjacentRealmIndices(i);
      r = Math.floor(Math.random() * ar.length);
      this.addConnect(this.realms[i], this.realms[ar[r]]);
    }
  }

  addConnect(from, to) {
    let startX,
      startY,
      endX,
      endY,
      dir,
      middle;

    const isDuplicate = this.connects.some(c => c.fromId === from.id && c.toId === to.id || c.fromId === to.id && c.toId === from.id);
    if (isDuplicate) {
      return;
    }

    const connect = {
      fromId: from.id,
      toId: to.id,
    }

    const getRandomPointY = (r) => randomInt({ max: r.roomBottom - 2, min: r.roomTop + 2 });
    const getRandomPointX = (r) => randomInt({ max: r.roomRight - 2, min: r.roomLeft + 2 });
    if (from.left === to.right) {
      startX = from.roomLeft - 1;
      startY = getRandomPointY(from)
      endX = to.roomRight + 1;
      endY = getRandomPointY(to);
      middle = from.roomLeft - from.left;
      dir = 3;
    }

    if (to.left === from.right) {
      startX = from.roomRight + 1;
      startY = getRandomPointY(from);
      endX = to.roomLeft - 1;
      endY = getRandomPointY(to);
      middle = from.right - from.roomRight;
      dir = 1;
    }

    if (from.top === to.bottom) {
      startX = getRandomPointX(from);
      startY = from.roomTop - 1;
      endX = getRandomPointX(to);
      endY = to.roomBottom + 1;
      middle = from.roomTop - from.top;
      dir = 0;
    }

    if (to.top === from.bottom) {
      startX = getRandomPointX(from);
      startY = from.roomBottom + 1;
      endX = getRandomPointX(to);
      endY = to.roomTop - 1;
      middle = from.bottom - from.roomBottom;
      dir = 2;
    }

    connect.startX = startX;
    connect.startY = startY;
    connect.endX = endX;
    connect.endY = endY;
    connect.middle = middle;
    connect.direction = dir;
    this.connects.push(Object.assign({}, connect));

    from.connectID.push(to.id);
    to.connectID.push(from.id);
  }

  getAdjacentRealmIndices(idx) {
    const touchingRealms = [];
    const target = this.realms[idx];
    for (let i = 0; i < this.realms.length; i += 1) {
      if (idx !== i) {
        if (this.isAdjacent(target, this.realms[i])) { touchingRealms.push(i); }
      }
    }
    return touchingRealms;
  }

  isAdjacent(a, b) {
    if ((a.left === b.right) || (b.left === a.right)) {
      if ((a.top <= b.bottom) && (a.top >= b.top)) { return true; }
      if ((a.bottom >= b.top) && (a.bottom <= b.bottom)) { return true; }
    }

    if ((a.top === b.bottom) || (b.top === a.bottom)) {
      if ((a.left >= b.left) && (a.left <= b.right)) { return true; }
      if ((a.right >= b.left) && (a.right <= b.right)) { return true; }
    }
    return false;
  }


  update(g) {
    console.log("it does not need");
  }
  draw(g) {
    this.drawScaleLine(g.ctx);

    for (const r of this.realms) {
      this.drawDivide(g.ctx, r);
      this.drawRoom(g.ctx, r);
    }
    for (const c of this.connects) {
      this.drawConnect(g.ctx, c);
    }
  }

  drawScaleLine(ctx) {
    ctx.strokeStyle = 'rgba(250, 250, 250, 0.25)';
    ctx.lineWidth = 1;

    const fieldY = settings.canvasHeight;
    const fieldX = settings.canvasWidth;
    const blockY = Math.floor(fieldY / settings.pixel);
    const blockX = Math.floor(fieldX / settings.pixel);

    let i;

    for (i = 0; i <= blockY; i += 1) {
      ctx.beginPath();
      ctx.moveTo(0, settings.pixel * i);
      ctx.lineTo(fieldX, settings.pixel * i);
      ctx.stroke();
      ctx.closePath();
    }

    for (i = 0; i <= blockX; i += 1) {
      ctx.beginPath();
      ctx.moveTo(settings.pixel * i, 0);
      ctx.lineTo(settings.pixel * i, fieldY);
      ctx.stroke();
      ctx.closePath();

    }
    ctx.strokeStyle = 'rgba(250, 250, 250, 1)';
    ctx.strokeRect(fieldX, fieldY, blockX * settings.pixel, blockY * settings.pixel);
  }

  drawDivide(ctx, r) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(250, 250, 250, 0.1)';
    ctx.fillStyle = 'rgba(250, 250, 250, 0.05)';
    ctx.strokeRect(
      r.left * settings.pixel,
      r.top * settings.pixel,
      r.sizeX * settings.pixel,
      r.sizeY * settings.pixel
    );
    ctx.fillRect(
      r.left * settings.pixel,
      r.top * settings.pixel,
      r.sizeX * settings.pixel,
      r.sizeY * settings.pixel
    );
  }

  drawRoom(ctx, r) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.stageColor;
    ctx.fillStyle = this.stageColor;
    ctx.strokeRect(
      r.roomLeft * settings.pixel,
      r.roomTop * settings.pixel,
      r.roomSizeX * settings.pixel,
      r.roomSizeY * settings.pixel
    );
    ctx.fillRect(
      r.roomLeft * settings.pixel,
      r.roomTop * settings.pixel,
      r.roomSizeX * settings.pixel,
      r.roomSizeY * settings.pixel
    );
  }

  drawConnect(ctx, c) {
    var i,
      dir,
      posX,
      posY,
      lim;

    posX = c.startX;
    posY = c.startY;
    dir = c.direction;
    lim = c.middle;

    for (i = 0; i < lim; i += 1) {
      this.drawPath(ctx, posX, posY);
      if (dir === 0) { posY -= 1; }
      if (dir === 1) { posX += 1; }
      if (dir === 2) { posY += 1; }
      if (dir === 3) { posX -= 1; }
    }

    if (dir % 2 === 0) {
      lim = Math.abs(c.startX - c.endX);
      if (c.startX > c.endX) { dir = 3; }
      if (c.startX < c.endX) { dir = 1; }
    } else {
      lim = Math.abs(c.startY - c.endY) + 1;
      if (c.startY > c.endY) { dir = 0; }
      if (c.startY < c.endY) { dir = 2; }
    }

    for (i = 0; i < lim; i += 1) {
      this.drawPath(ctx, posX, posY);
      if (i !== lim - 1) {
        if (dir === 0) { posY -= 1; }
        if (dir === 1) { posX += 1; }
        if (dir === 2) { posY += 1; }
        if (dir === 3) { posX -= 1; }
      }
    }

    dir = c.direction;
    if (dir % 2 === 0) {
      lim = Math.abs(posY - c.endY);
    } else {
      lim = Math.abs(posX - c.endX);
    }

    for (i = 0; i < lim; i += 1) {
      if (dir === 0) { posY -= 1; }
      if (dir === 1) { posX += 1; }
      if (dir === 2) { posY += 1; }
      if (dir === 3) { posX -= 1; }
      this.drawPath(ctx, posX, posY);
    }
  }

  drawPath(ctx, x, y) {
    ctx.fillStyle = this.stageColor;
    ctx.fillRect(
      settings.pixel * x,
      settings.pixel * y,
      settings.pixel,
      settings.pixel
    );
  }
}
