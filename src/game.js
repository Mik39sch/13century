import Enemy from "./enemy";
import Player from "./player";

export const settings = {
  appElementID: "#app",
  canvasWidth: 1000,
  canvasHeight: 1000,
  gamemode: {
    "title": { val: 0, text: true },
    "playing": { val: 1, text: false },
    "gameclear": { val: 2, text: true },
    "gameover": { val: 3, text: true },
  }
}

export default class game {
  constructor() {
    this.loadCount = 0;
    this.gamemode = settings.gamemode.playing.val;
    this.keyboard = []
    this.canvasEl = undefined;
    this.ctx = undefined;
    this.displayCtx = undefined;
    this.models = [
      new Enemy({ x: settings.canvasWidth / 2, y: settings.canvasHeight / 2, height: 32, width: 32 }),
      new Player({ x: settings.canvasWidth / 2, y: settings.canvasHeight / 2, height: 32, width: 32 })
    ];

    const appEl = document.querySelector(settings.appElementID);

    this._createCanvasEl(appEl);
    this.setKeyEvent();
  }

  setKeyEvent() {
    this.addKeydownEventListener(document, "keydown");
    this.addKeyupEventListener(document, "keyup");
  }

  addKeydownEventListener(el, event, listenerArgs = undefined) {
    const keydown = e => {
      this.keyboard = [...new Set([...this.keyboard, this._adjustKeyCode(e.code)])];
    }

    if (listenerArgs) {
      el.addEventListener(event, () => keydown(listenerArgs));
    } else {
      el.addEventListener(event, keydown);
    }
  }

  addKeyupEventListener(el, event, listenerArgs = undefined) {
    const keyup = e => {
      this.keyboard = this.keyboard.filter(a => a !== this._adjustKeyCode(e.code));
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

    this.ctx.fillStyle = 'gray';
    this.ctx.fillRect(0, 0, settings.canvasWidth, settings.canvasHeight);

    for (const m of this.models) {
      m.update(this);
      m.draw(this);
    }

    this.ctx.restore();
    this.displayCtx.drawImage(this.canvasEl, 0, 0);

    const currentGameMode = Object.values(settings.gamemode).find(mode => mode.val === this.gamemode);
    if (!currentGameMode.text) {
      this.timer = requestAnimationFrame(this._draw.bind(this));
    }
  }
}