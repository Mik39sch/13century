import baseCls from "../game"

export default class game extends baseCls {

  setKeyEvent() {
    const leftbtn = document.querySelector("#leftbtn");
    const rightbtn = document.querySelector("#rightbtn");
    const upbtn = document.querySelector("#upbtn");
    const downbtn = document.querySelector("#downbtn");

    const keyDownEvents = ["mousedown", "touchstart"];
    keyDownEvents.forEach(eventName => {
      this.addKeydownEventListener(leftbtn, eventName, { codel: "l" });
      this.addKeydownEventListener(rightbtn, eventName, { codel: "r" });
      this.addKeydownEventListener(upbtn, eventName, { codel: "u" });
      this.addKeydownEventListener(downbtn, eventName, { codel: "d" });
    });

    const keyUpEvents = ["mouseup", "touchend"];
    keyUpEvents.forEach(eventName => {
      this.addKeyupEventListener(leftbtn, eventName, { codel: "l" });
      this.addKeyupEventListener(rightbtn, eventName, { codel: "r" });
      this.addKeyupEventListener(upbtn, eventName, { codel: "u" });
      this.addKeyupEventListener(downbtn, eventName, { codel: "d" });
    });
  }
}
