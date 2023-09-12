import { randomInt } from "./util";
import settings from "./settings";

export default class Stage {
  constructor() {
    this.divideX = randomInt({ max: 4, min: 2 });
    this.divideY = 2;

    this.stageColor1 = 'rgba(0, 0, 150, 1)';
    this.stageColor2 = 'rgba(0, 0, 150, 0.5)';

    this.defaultVisible = false;

    this.realms = [];
    this.connects = [];
    this.pathPositions = [];

    this.divide();
    this.makeRoom();
    this.makePath();

    this.maxX = Math.max(...this.realms.map(r => r.right)) - 1;
    this.minX = Math.min(...this.realms.map(r => r.left));
    this.maxY = Math.max(...this.realms.map(r => r.bottom)) - 1;
    this.minY = Math.min(...this.realms.map(r => r.top));
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
      r.visible = this.defaultVisible;
      r.know = false;
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
    for (const c of this.connects) {
      this.drawConnect(null, c, false);
    }
  }

  makePathObject(x, y) {
    let path = this.pathPositions.find(path => path.x === x && path.y === y);
    if (!path) {
      path = { x, y, visible: this.defaultVisible, know: false };
      this.pathPositions.push(path);
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
    for (const r of this.realms) {
      r.visible = this.defaultVisible;
    }
    for (const path of this.pathPositions) {
      path.visible = false;
    }
  }

  draw(g) {
    this.drawScaleLine(g);
    for (const r of this.realms) {
      this.drawRoom(g.ctx, r);
    }
    for (const c of this.connects) {
      this.drawConnect(g.ctx, c);
    }
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

  drawRoom(ctx, r) {

    ctx.lineWidth = 2;
    ctx.strokeStyle = r.visible ? this.stageColor1 : this.stageColor2;
    ctx.fillStyle = r.visible ? this.stageColor1 : this.stageColor2;
    ctx.strokeRect(
      r.roomLeft * settings.pixel,
      r.roomTop * settings.pixel,
      r.roomSizeX * settings.pixel,
      r.roomSizeY * settings.pixel
    );

    if (r.visible || r.know) {
      ctx.fillRect(
        r.roomLeft * settings.pixel,
        r.roomTop * settings.pixel,
        r.roomSizeX * settings.pixel,
        r.roomSizeY * settings.pixel
      );
    }
  }

  drawConnect(ctx, c, isDraw = true) {
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
      if (isDraw) {
        this.drawPath(ctx, posX, posY);
      } else {
        this.makePathObject(posX, posY);
      }

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
      if (isDraw) {
        this.drawPath(ctx, posX, posY);
      } else {
        this.makePathObject(posX, posY);
      }
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
      if (isDraw) {
        this.drawPath(ctx, posX, posY);
      } else {
        this.makePathObject(posX, posY);
      }
    }
  }

  drawPath(ctx, x, y) {
    const path = this.pathPositions.find(path => path.x === x && path.y === y);
    if (path.visible || path.know) {
      ctx.fillStyle = path.visible ? this.stageColor1 : this.stageColor2;
      ctx.fillRect(
        settings.pixel * x,
        settings.pixel * y,
        settings.pixel,
        settings.pixel
      );
    }
  }

  hitWall(x, y, direction = ["u"]) {
    if (this.isInnerRoom(x, y)) {
      return false;
    }

    if (this.isInnerPath(x, y, direction)) {
      return false;
    }
    return true;
  }

  isInnerRoom(x, y, shouldUpdateVisible = false) {
    for (const r of this.realms) {
      if (
        r.roomLeft <= x && x <= r.roomRight &&
        r.roomTop <= y && y <= r.roomBottom
      ) {
        if (shouldUpdateVisible) {
          r.visible = true;
          r.know = true;
          for (const path of this.pathPositions) {
            if (
              path.x >= r.roomLeft - 1 && path.x <= r.roomRight + 1 &&
              path.y >= r.roomTop - 1 && path.y <= r.roomBottom + 1
            ) {
              path.visible = true;
              path.know = true;
            }
          }
        }
        return r;
      }
    }
    return null;
  }

  isInnerPath(x, y, directions, shouldUpdateVisible = false) {
    const direction = directions.length > 0 ? directions[0] : null;
    const checkPosition = [];
    if (direction === "u") {
      for (let v = 1; v <= settings.visibleRange; v++) {
        checkPosition.push({ x, y: y - v });
      }
    }
    if (direction === "d") {
      for (let v = 1; v <= settings.visibleRange; v++) {
        checkPosition.push({ x, y: y + v });
      }
    }
    if (direction === "u" || direction === "d") {
      checkPosition.push({ x: x + 1, y });
      checkPosition.push({ x: x - 1, y });
    }

    if (direction === "l") {
      for (let v = 1; v <= settings.visibleRange; v++) {
        checkPosition.push({ x: x - v, y });
      }
    }
    if (direction === "r") {
      for (let v = 1; v <= settings.visibleRange; v++) {
        checkPosition.push({ x: x + v, y });
      }
    }
    if (direction === "l" || direction === "r") {
      checkPosition.push({ x, y: y + 1 });
      checkPosition.push({ x, y: y - 1 });
    }


    let current = null;
    for (const path of this.pathPositions) {
      if (path.x === x && path.y === y) {
        if (shouldUpdateVisible) {
          path.visible = true;
          path.know = true;
        }

        current = path;
      }
      if (shouldUpdateVisible) {
        if (checkPosition.some(pos => pos.x === path.x && pos.y === path.y)) {
          path.visible = true;
          path.know = true;
        }
      }
    }
    return current;
  }
}
