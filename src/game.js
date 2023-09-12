import NPC from "./npc";
import Player from "./player";
import Stage from "./stage";
import threeDrawer from "./3ddrawer";

import settings from "./settings";
import { randomInt } from "./util";

export default class game {
  constructor() {
    this.loadCount = 0;
    this.gamemode = settings.gamemode.title;
    this.keyboard = []
    this.canvasEl = undefined;
    this.ctx = undefined;
    this.displayCtx = undefined;
    this.stage = undefined;
    this.initialized = false;

    this.prevTime = performance.now();

    const appEl = document.querySelector(settings.appElementID);
    const wrapperEl = document.querySelector(settings.wrapperElementID);

    this._createCanvasEl(appEl, wrapperEl, settings.canvasWidth, settings.canvasHeight);
    this.setKeyEvent();

    this.initializeGame();
  }

  initializeGame() {
    this.stage = new Stage();

    const spawnPos = () => {
      const r = this.stage.realms[randomInt({ max: this.stage.realms.length - 1, min: 0 })];
      return [randomInt({ max: r.roomRight, min: r.roomLeft }), randomInt({ max: r.roomBottom, min: r.roomTop })];
    }

    const [playerSpawnX, playerSpawnY] = spawnPos();

    this.player = new Player({ x: playerSpawnX, y: playerSpawnY, height: settings.pixel, width: settings.pixel });

    const enemyCount = randomInt({ max: 10, min: 3 });
    let enemySpawnX, enemySpawnY;
    this.enemies = [];
    for (let i = 0; i < enemyCount; i++) {
      [enemySpawnX, enemySpawnY] = spawnPos();
      this.enemies.push(new NPC({ x: enemySpawnX, y: enemySpawnY, height: settings.pixel, width: settings.pixel }));
    }

    const [broSpawnX, broSpawnY] = spawnPos();
    this.brother = new NPC({ x: broSpawnX, y: broSpawnY, height: settings.pixel, width: settings.pixel });

    this.stage.isInnerRoom(playerSpawnX, playerSpawnY, true);
    this.stage.isInnerPath(playerSpawnX, playerSpawnY, ["u"], true);
    const wrapperEl = document.querySelector(settings.wrapperElementID);
    if (this.canvas3DEl) {
      wrapperEl.removeChild(this.canvas3DEl);
    }

    this.canvas3DEl = document.createElement("canvas");
    [this.canvas3DEl.style.width, this.canvas3DEl.style.height] = [settings.canvasWidth, settings.canvasHeight];
    this.canvas3DEl.style.zIndex = 0;
    wrapperEl.appendChild(this.canvas3DEl);

    this.engine = new BABYLON.Engine(this.canvas3DEl);
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0.659, 0.863, 0.925);

    this.threeDrawer = new threeDrawer(this);
    this.threeDrawer.drawMap(this, this.stage);

    this.initialized = true;

    this._draw();
  }

  setKeyEvent() {
    this.addKeyupEventListener(document, "keyup");
  }

  addKeyupEventListener(el, event, listenerArgs = undefined) {
    const keyup = e => {
      const wrapperEl = document.querySelector(settings.wrapperElementID);
      if (this.textEl) {
        wrapperEl.removeChild(this.textEl);
        this.textEl = undefined;
      }

      if (this.gamemode.text) {
        this.gamemode = settings.gamemode.playing;
        if (!this.initialized) {
          this.initializeGame();
        }
        return;
      }

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

  _createCanvasEl(appEl, wrapperEl, width, height) {
    const [w, h] = [width, height];
    let appElWidth = w;
    [appEl.style.width, appEl.style.height] = [`${appElWidth}px`, `${h}px`];
    this.canvasEl = document.createElement("canvas");
    [this.canvasEl.width, this.canvasEl.height] = [w, h];

    this.ctx = this.canvasEl.getContext('2d');
    const canvasEl = document.createElement("canvas");
    [canvasEl.style.width, canvasEl.style.height] = [`${settings.viewWidth}px`, `${settings.viewHeight}px`];
    [canvasEl.width, canvasEl.height] = [w, h];
    canvasEl.style.zIndex = 1;

    this.displayCtx = canvasEl.getContext('2d');
    wrapperEl.appendChild(canvasEl);

    this.canvas3DEl = document.createElement("canvas");
    this.canvas3DEl.id = "3dcanvas";
    [this.canvas3DEl.style.width, this.canvas3DEl.style.height] = [w, h];
    this.canvas3DEl.style.zIndex = 0;
    wrapperEl.appendChild(this.canvas3DEl);
  }

  _draw() {
    let text = "";
    if (this.gamemode.val === settings.gamemode.title.val) {
      text = [
        { text: "Run away from pied piper of Hamelin", size: 16 },
        { text: "", size: 10 },
        { text: "Rule: ", size: 10 },
        { text: "  You should find brother(Pink).", size: 10 },
        { text: "  If you are found by pied piper of hamelin(Red)...", size: 10 },
        { text: "Control: ", size: 10 },
        { text: "  Right/Left key: Change Direction", size: 10 },
        { text: "  Up Key: forward, Down Key: Back", size: 10 },
        { text: "", size: 10 },
        { text: "Press any key, You can start the game.", size: 10 },
      ];
    }
    if (this.gamemode.val === settings.gamemode.gameclear.val) {
      text = [
        { text: "Congratulations!!!", size: 24 },
        { text: "", size: 10 },
        { text: "You could help your brother and run away!!", size: 10 },
        { text: "", size: 10 },
        { text: "Press any key, You can restart the game.", size: 10 },
      ];
    }
    if (this.gamemode.val === settings.gamemode.gameover.val) {
      text = [
        { text: "Game over!!!", size: 24 },
        { text: "", size: 10 },
        { text: "You could not run away!!", size: 10 },
        { text: "", size: 10 },
        { text: "Press any key, You can restart the game.", size: 10 },
      ];
    }

    if (this.gamemode.text) {
      this.drawText(text);
      return;
    }
    this.update();
    this.drawMap();
    this.scene.render();
  }

  update() {
    this.stage.update(this);
    this.player.update(this);
    for (const enemy of this.enemies) {
      enemy.update(this);
    }
    this.brother.update(this);
    this.threeDrawer.update(this);

    if (this.enemies.some(enemy => (
      enemy.x === this.player.x &&
      enemy.y === this.player.y
    ))) {
      this.gamemode = settings.gamemode.gameover;
      this.initialized = false;
      this._draw();
    }

    if (this.brother.x === this.player.x && this.brother.y === this.player.y) {
      this.gamemode = settings.gamemode.gameclear;
      this.initialized = false;
      this._draw();
    }
  }

  drawText(text) {
    if (this.textEl) return;
    const wrapperEl = document.querySelector(settings.wrapperElementID);

    this.textEl = document.createElement("canvas");
    [this.textEl.style.width, this.textEl.style.height] = [settings.canvasWidth, settings.canvasHeight];
    this.textEl.style.zIndex = 9;
    wrapperEl.appendChild(this.textEl);
    const ctx = this.textEl.getContext('2d');
    let currentY = 30;
    for (const t of text) {
      ctx.font = `${t.size}px serif`;
      ctx.fillStyle = 'rgba(200, 200, 200)';
      ctx.fillText(t.text, 10, currentY);
      currentY += t.size + 1;
    }
  }

  drawMap() {
    this.ctx.save();
    this.ctx.fillStyle = '#205030';
    this.ctx.fillRect(0, 0, settings.canvasWidth, settings.canvasHeight);

    this.stage.draw(this);
    this.brother.draw(this);
    for (const enemy of this.enemies) {
      enemy.draw(this);
    }
    this.player.draw(this);

    this.ctx.restore();
    this.displayCtx.drawImage(this.canvasEl, 0, 0);
  }
}