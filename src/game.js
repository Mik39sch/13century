import Enemy from "./enemy";
import Player from "./player";
import Stage from "./stage";
import threeDrawer from "./3ddrawer";

import settings from "./settings";
import { randomInt } from "./util";

export default class game {
  constructor(w, h) {
    this.loadCount = 0;
    this.gamemode = settings.gamemode.playing.val;
    this.keyboard = []
    this.canvasEl = undefined;
    this.ctx = undefined;
    this.displayCtx = undefined;
    this.stage = new Stage();

    this.prevTime = performance.now();

    const spawnPos = () => {
      const r = this.stage.realms[randomInt({ max: this.stage.realms.length - 1, min: 0 })];
      return [randomInt({ max: r.roomRight, min: r.roomLeft }), randomInt({ max: r.roomBottom, min: r.roomTop })];
    }

    const [playerSpawnX, playerSpawnY] = spawnPos();

    this.player = new Player({ x: playerSpawnX, y: playerSpawnY, height: settings.pixel, width: settings.pixel });

    const [enemySpawnX, enemySpawnY] = spawnPos();
    this.enemies = [
      new Enemy({ x: enemySpawnX, y: enemySpawnY, height: settings.pixel, width: settings.pixel }),
    ];

    const appEl = document.querySelector(settings.appElementID);

    this._createCanvasEl(appEl, w, h);
    this.setKeyEvent();

    this.stage.isInnerRoom(playerSpawnX, playerSpawnY, true);
    this.stage.isInnerPath(playerSpawnX, playerSpawnY, ["u"], true);

    this.threeDrawer = new threeDrawer(this);
    this.threeDrawer.drawMap(this, this.stage);
  }

  setKeyEvent() {
    // this.addKeydownEventListener(document, "keydown");
    this.addKeyupEventListener(document, "keyup");
  }

  addKeydownEventListener(el, event, listenerArgs = undefined) {
    const keydown = e => {
      this.keyboard = [this._adjustKeyCode(e.code)];
      this._draw();
    }

    if (listenerArgs) {
      el.addEventListener(event, () => keydown(listenerArgs));
    } else {
      el.addEventListener(event, keydown);
    }
  }

  addKeyupEventListener(el, event, listenerArgs = undefined) {
    const keyup = e => {
      this.keyboard = [this._adjustKeyCode(e.code)];
      this._draw();
    }

    if (listenerArgs) {
      el.addEventListener(event, () => keyup(listenerArgs));
    } else {
      el.addEventListener(event, keyup);
    }
  }


  run() {
    // this.engine.runRenderLoop(this._draw.bind(this));
    this._draw();
  }

  /** private functions -----------------------------------------------------------------------------------------------*/

  _adjustKeyCode(code) {
    const c = {
      "l": ["ArrowLeft"],
      "r": ["ArrowRight"],
      "u": ["ArrowUp"],
      "d": ["ArrowDown"],
    };

    for (const [k, v] of Object.entries(c)) {
      if (v.includes(code)) {
        return k;
      }
    }
    return code;
  }

  _createCanvasEl(appEl, width, height) {
    const [w, h] = [width, height];
    let appElWidth = w;
    [appEl.style.width, appEl.style.height] = [`${appElWidth}px`, `${h}px`];
    this.canvasEl = document.createElement("canvas");
    [this.canvasEl.width, this.canvasEl.height] = [w, h];

    this.ctx = this.canvasEl.getContext('2d');
    const canvasEl = document.createElement("canvas");
    [canvasEl.style.width, canvasEl.style.height] = [`${settings.viewWidth}px`, `${settings.viewHeight}px`];
    [canvasEl.width, canvasEl.height] = [w, h];

    this.displayCtx = canvasEl.getContext('2d');
    appEl.appendChild(canvasEl);

    this.canvas3DEl = document.createElement("canvas");
    [this.canvas3DEl.style.width, this.canvas3DEl.style.height] = [w, h];
    appEl.appendChild(this.canvas3DEl);

    this.engine = new BABYLON.Engine(this.canvas3DEl);
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
  }

  _draw() {
    this.update();
    this.drawMap();
    this.scene.render();
  }

  update() {
    this.stage.update(this);
    this.player.update(this);
    // for (const enemy of this.enemies) {
    //   enemy.update(this);
    // }
    this.threeDrawer.update(this);
  }

  drawMap() {
    this.ctx.save();
    this.ctx.fillStyle = '#205030';
    this.ctx.fillRect(0, 0, settings.canvasWidth, settings.canvasHeight);

    this.stage.draw(this);
    // for (const enemy of this.enemies) {
    //   enemy.draw(this);
    // }
    this.player.draw(this);

    this.ctx.restore();
    this.displayCtx.drawImage(this.canvasEl, 0, 0);
  }
}