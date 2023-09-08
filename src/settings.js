const pixel = 16;
const widthSize = 60;
const heightSize = 30;

export default {
  appElementID: "#app",
  wrapperElementID: "#wrapper",
  width: widthSize,
  height: heightSize,
  viewWidth: widthSize * 4,
  viewHeight: heightSize * 4,
  canvasWidth: widthSize * pixel,
  canvasHeight: heightSize * pixel,
  gamemode: {
    "title": { val: 0, text: true },
    "playing": { val: 1, text: false },
    "gameclear": { val: 2, text: true },
    "gameover": { val: 3, text: true },
  },
  debugMode: true,
  pixel,
  visibleRange: 3,
}