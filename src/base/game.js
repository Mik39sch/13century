export const settings = {
  appElementID: "#app",
  canvasWidth: 100,
  canvasHeight: 100,
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

    const appEl = document.querySelector(settings.appElementID);

    this._createCanvasEl(appEl);
    this.setKeyEvent();
  }

  setKeyEvent() {
    let leftbtn, rightbtn, upbtn, downbtn;
    if (this._smt()) {
      leftbtn = document.querySelector("#leftbtn");
      rightbtn = document.querySelector("#rightbtn");
      upbtn = document.querySelector("#upbtn");
      downbtn = document.querySelector("#downbtn");
    }

    const keydown = e => {
      this.keyboard = [...new Set([...this.keyboard, e.code])];
    }
    const keyup = e => {
      this.keyboard = this.keyboard.filter(a => a !== e.code);
    }

    if (this._smt()) {
      const keyDownEvents = ["mousedown", "touchstart"];
      keyDownEvents.forEach(eventName => {
        leftbtn.addEventListener(eventName, e => {
          keydown({ code: "ArrowLeft" });
        });
        rightbtn.addEventListener(eventName, e => {
          keydown({ code: "ArrowRight" });
        });
        upbtn.addEventListener(eventName, e => {
          keydown({ code: "ArrowUp" });
        });
        downbtn.addEventListener(eventName, e => {
          keydown({ code: "ArrowDown" });
        });
      });

      const keyUpEvents = ["mouseup", "touchend"];
      keyUpEvents.forEach(eventName => {
        leftbtn.addEventListener(eventName, e => {
          keyup({ code: "ArrowLeft" });
        });
        rightbtn.addEventListener(eventName, e => {
          keyup({ code: "ArrowRight" });
        });
        upbtn.addEventListener(eventName, e => {
          keyup({ code: "ArrowUp" });
        });
        downbtn.addEventListener(eventName, e => {
          keyup({ code: "ArrowDown" });
        });
      });
    }

    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
  }

  run() {
    this._draw();
  }

  /** private functions -----------------------------------------------------------------------------------------------*/
  _smt() {
    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)) {
      return true;
    } else {
      return false;
    }
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

    this.draw()

    this.ctx.restore();
    this.displayCtx.drawImage(this.canvasEl, 0, 0);

    const currentGameMode = Object.values(settings.gamemode).find(mode => mode.val === this.gamemode);
    if (!currentGameMode.text) {
      this.timer = requestAnimationFrame(this._draw.bind(this));
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(settings.canvasWidth / 2, settings.canvasWidth / 2, 25, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fillStyle = "blue";
    this.ctx.fill();
  }
}