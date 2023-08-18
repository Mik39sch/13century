import Enemy from "./enemy";
import Player from "./player";
import Stage from "./stage";

import settings from "./settings";
import { randomInt } from "./util";

export default class game {
  constructor() {
    this.loadCount = 0;
    this.gamemode = settings.gamemode.playing.val;
    this.keyboard = []
    this.canvasEl = undefined;
    this.ctx = undefined;
    this.displayCtx = undefined;
    this.stage = new Stage();

    const enemySpawnRoom = this.stage.realms[randomInt({ max: this.stage.realms.length - 1, min: 0 })];
    const enemySpawnX = randomInt({ max: enemySpawnRoom.roomRight, min: enemySpawnRoom.roomLeft });
    const enemySpawnY = randomInt({ max: enemySpawnRoom.roomBottom, min: enemySpawnRoom.roomTop });

    const playerSpawnRoom = this.stage.realms[randomInt({ max: this.stage.realms.length - 1, min: 0 })];
    const playerSpawnX = randomInt({ max: playerSpawnRoom.roomRight, min: playerSpawnRoom.roomLeft });
    const playerSpawnY = randomInt({ max: playerSpawnRoom.roomBottom, min: playerSpawnRoom.roomTop });


    this.models = [
      new Enemy({ x: enemySpawnX, y: enemySpawnY, height: settings.pixel, width: settings.pixel }),
      new Player({ x: playerSpawnX, y: playerSpawnY, height: settings.pixel, width: settings.pixel })
    ];

    const appEl = document.querySelector(settings.appElementID);

    this._createCanvasEl(appEl);
    this.setKeyEvent();

    this.stage.isInnerRoom(playerSpawnX, playerSpawnY, true);
    this.stage.isInnerPath(playerSpawnX, playerSpawnY, ["u"], true);
  }

  setKeyEvent() {
    this.addKeydownEventListener(document, "keydown");
    // this.addKeyupEventListener(document, "keyup");
  }

  addKeydownEventListener(el, event, listenerArgs = undefined) {
    const keydown = e => {
      this.keyboard = [this._adjustKeyCode(e.code)];
      for (const m of this.models) {
        m.update(this);
      }
      this._draw()
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
      for (const m of this.models) {
        m.update(this);
      }
      this._draw()
    }

    if (listenerArgs) {
      el.addEventListener(event, () => keyup(listenerArgs));
    } else {
      el.addEventListener(event, keyup);
    }
  }


  run() {
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

  _createCanvasEl(appEl) {
    const [w, h] = [settings.canvasWidth, settings.canvasHeight];
    let appElWidth = w;
    [appEl.style.width, appEl.style.height] = [`${appElWidth}px`, `${h}px`];
    this.canvasEl = document.createElement("canvas");
    [this.canvasEl.width, this.canvasEl.height] = [w, h];

    this.ctx = this.canvasEl.getContext('2d');
    const canvasEl = document.createElement("canvas");
    [canvasEl.style.width, canvasEl.style.height] = [`${w}px`, `${h}px`];
    [canvasEl.width, canvasEl.height] = [w, h];

    this.displayCtx = canvasEl.getContext('2d');
    appEl.appendChild(canvasEl);
  }

  _draw() {
    this.ctx.save();

    this.ctx.fillStyle = '#205030';
    this.ctx.fillRect(0, 0, settings.canvasWidth, settings.canvasHeight);

    this.stage.draw(this);

    for (const m of this.models) {
      m.draw(this);
    }

    this.ctx.restore();
    this.displayCtx.drawImage(this.canvasEl, 0, 0);

    // const currentGameMode = Object.values(settings.gamemode).find(mode => mode.val === this.gamemode);
    // if (!currentGameMode.text) {
    //   this.timer = requestAnimationFrame(this._draw.bind(this));
    // }
  }
}