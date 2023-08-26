import baseCls from "../game"
import settings from "../settings";

export default class game extends baseCls {

  constructor(w, h) {
    const btnWidth = 50;
    const appElWidth = w + btnWidth * 4;
    const appEl = document.querySelector(settings.appElementID);

    const leftBtn = document.createElement("button");
    [leftBtn.style.width, leftBtn.style.height] = [`${btnWidth}px`, `${h}px`];
    leftBtn.innerText = "<<<";
    leftBtn.id = "leftbtn";
    appEl.appendChild(leftBtn);

    const rightBtn = document.createElement("button");
    [rightBtn.style.width, rightBtn.style.height] = [`${btnWidth}px`, `${h}px`];
    rightBtn.innerText = ">>>";
    rightBtn.id = "rightbtn";
    appEl.appendChild(rightBtn);

    const jumpBtn = document.createElement("button");
    [jumpBtn.style.width, jumpBtn.style.height] = [`${btnWidth}px`, `${h}px`];
    jumpBtn.innerText = "UP";
    jumpBtn.id = "upbtn";
    appEl.appendChild(jumpBtn);

    const downBtn = document.createElement("button");
    [downBtn.style.width, downBtn.style.height] = [`${btnWidth}px`, `${h}px`];
    downBtn.innerText = "DOWN";
    downBtn.id = "downbtn";
    appEl.appendChild(downBtn);

    super(w, h);
  }

  setKeyEvent() {
    const leftbtn = document.querySelector("#leftbtn");
    const rightbtn = document.querySelector("#rightbtn");
    const upbtn = document.querySelector("#upbtn");
    const downbtn = document.querySelector("#downbtn");

    const keyDownEvents = ["mousedown", "touchstart"];
    keyDownEvents.forEach(eventName => {
      this.addKeydownEventListener(leftbtn, eventName, { code: "l" });
      this.addKeydownEventListener(rightbtn, eventName, { code: "r" });
      this.addKeydownEventListener(upbtn, eventName, { code: "u" });
      this.addKeydownEventListener(downbtn, eventName, { code: "d" });
    });

    // const keyUpEvents = ["mouseup", "touchend"];
    // keyUpEvents.forEach(eventName => {
    //   this.addKeyupEventListener(leftbtn, eventName, { code: "l" });
    //   this.addKeyupEventListener(rightbtn, eventName, { code: "r" });
    //   this.addKeyupEventListener(upbtn, eventName, { code: "u" });
    //   this.addKeyupEventListener(downbtn, eventName, { code: "d" });
    // });
  }
}
